import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'

export async function GET(request: NextRequest) {
  try {
    // Get authentication information
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Extract query parameters
    const searchParams = request.nextUrl.searchParams
    const shopDomain = searchParams.get('shop') || searchParams.get('shop_domain')
    const returnUrl = searchParams.get('return_url') || `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/stores`
    const tenantId = searchParams.get('tenant_id')
    const storeName = searchParams.get('store_name')

    // Validate required parameters
    if (!shopDomain) {
      // If no shop domain is provided, redirect to the stores page
      const redirectUrl = new URL('/stores', process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000')
      redirectUrl.searchParams.set('error', 'missing_shop_domain')
      redirectUrl.searchParams.set('error_description', 'Please enter your shop domain to connect your Shopify store')
      return NextResponse.redirect(redirectUrl.toString())
    }

    // Prepare the query parameters for the n8n workflow
    const n8nBaseUrl = process.env.NEXT_PUBLIC_N8N_BASE_URL || 'https://n8n.weblion.pro/webhook'
    const n8nUrl = new URL(`${n8nBaseUrl}/shopify/install`)
    
    // Add query parameters
    n8nUrl.searchParams.set('shop', shopDomain)
    n8nUrl.searchParams.set('shop_domain', shopDomain)
    n8nUrl.searchParams.set('return_url', returnUrl)
    if (tenantId) n8nUrl.searchParams.set('tenant_id', tenantId)
    if (storeName) n8nUrl.searchParams.set('store_name', storeName)
    if (userId) n8nUrl.searchParams.set('user_id', userId)

    // Call the n8n workflow for Shopify installation using GET
    const n8nResponse = await fetch(n8nUrl.toString(), {
      method: 'GET',
      headers: {
        'Accept': 'application/json'
      }
    })

    if (!n8nResponse.ok) {
      console.error('N8N workflow failed:', await n8nResponse.text())
      return NextResponse.json({ error: 'Failed to start Shopify installation' }, { status: 500 })
    }

    // Get the response as text first to debug
    const responseText = await n8nResponse.text()
    console.log('N8N raw response:', responseText)
    
    let result
    try {
      result = JSON.parse(responseText)
    } catch (parseError) {
      console.error('Failed to parse n8n response:', parseError)
      console.error('Raw response:', responseText)
      return NextResponse.json({ error: 'Invalid JSON response from workflow' }, { status: 500 })
    }
    
    console.log('N8N parsed result:', result)
    
    // Function to extract auth_url from various response formats
    const extractAuthUrl = (data: any): string | null => {
      console.log('Extracting auth_url from:', typeof data, data)
      
      // Direct auth_url property
      if (data?.auth_url && typeof data.auth_url === 'string') {
        console.log('Found direct auth_url:', data.auth_url)
        return data.auth_url
      }
      
      // Array with auth_url in first element
      if (Array.isArray(data) && data[0]?.auth_url && typeof data[0].auth_url === 'string') {
        console.log('Found auth_url in array:', data[0].auth_url)
        return data[0].auth_url
      }
      
      // Sometimes the response might be double-encoded as a string
      if (typeof data === 'string') {
        try {
          const parsed = JSON.parse(data)
          return extractAuthUrl(parsed)
        } catch {
          // Check if the string itself looks like a URL
          if (data.includes('admin/oauth/authorize')) {
            console.log('Found auth_url as string:', data)
            return data
          }
          return null
        }
      }
      
      // Search for auth_url in nested objects
      if (typeof data === 'object' && data !== null) {
        for (const key in data) {
          const value = data[key]
          console.log(`Checking key "${key}":`, typeof value, value)
          
          // Check if this key contains auth_url as a string
          if (typeof value === 'string' && value.includes('admin/oauth/authorize')) {
            console.log('Found auth_url in key', key, ':', value)
            return value
          }
          
          // Check if the key itself suggests it's an auth_url
          if (key.includes('auth_url') && typeof value === 'string') {
            console.log('Found auth_url by key name:', value)
            return value
          }
          
          // Recursively search in nested objects/arrays
          if (typeof value === 'object' && value !== null) {
            const nested = extractAuthUrl(value)
            if (nested) {
              console.log('Found auth_url in nested object:', nested)
              return nested
            }
          }
        }
      }
      
      console.log('No auth_url found in data')
      return null
    }
    
    const authUrl = extractAuthUrl(result)
    
    if (authUrl && typeof authUrl === 'string' && authUrl.startsWith('http')) {
      console.log('Redirecting to:', authUrl)
      return NextResponse.redirect(authUrl)
    } else {
      console.error('No valid auth_url found. Extracted value:', typeof authUrl, authUrl)
      console.error('Full response for debugging:', JSON.stringify(result, null, 2))
      return NextResponse.json({ 
        error: 'No valid auth_url in workflow response',
        debug: {
          extractedValue: authUrl,
          extractedType: typeof authUrl,
          rawResponse: result
        }
      }, { status: 500 })
    }

  } catch (error) {
    console.error('Shopify install error:', error)
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
