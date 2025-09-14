import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    // Extract query parameters from the callback
    const searchParams = request.nextUrl.searchParams
    const code = searchParams.get('code')
    const shop = searchParams.get('shop')
    const state = searchParams.get('state')
    const error = searchParams.get('error')
    const errorDescription = searchParams.get('error_description')

    // Handle OAuth errors
    if (error) {
      console.error('Shopify OAuth error:', { error, errorDescription })
      const returnUrl = new URL('/stores', process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000')
      returnUrl.searchParams.set('error', error)
      returnUrl.searchParams.set('error_description', errorDescription || 'OAuth authorization failed')
      return NextResponse.redirect(returnUrl.toString())
    }

    // Validate required parameters
    if (!code || !shop || !state) {
      console.error('Missing required OAuth parameters:', { code: !!code, shop: !!shop, state: !!state })
      const returnUrl = new URL('/stores', process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000')
      returnUrl.searchParams.set('error', 'invalid_request')
      returnUrl.searchParams.set('error_description', 'Missing required OAuth parameters')
      return NextResponse.redirect(returnUrl.toString())
    }

    // Prepare the payload for the n8n callback workflow
    const payload = {
      code,
      shop,
      state,
      timestamp: Date.now()
    }

    // Call the n8n workflow for Shopify OAuth callback
    const n8nBaseUrl = process.env.NEXT_PUBLIC_N8N_BASE_URL || 'https://n8n.weblion.pro/webhook'
    const n8nResponse = await fetch(`${n8nBaseUrl}/oauth/shopify/callback`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    })

    if (!n8nResponse.ok) {
      console.error('N8N callback workflow failed:', await n8nResponse.text())
      const returnUrl = new URL('/stores', process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000')
      returnUrl.searchParams.set('error', 'callback_failed')
      returnUrl.searchParams.set('error_description', 'Failed to process OAuth callback')
      return NextResponse.redirect(returnUrl.toString())
    }

    const result = await n8nResponse.json()
    console.log('N8N callback result:', result)

    // Extract return URL from state or use default
    let returnUrl = '/stores'
    try {
      // Parse state to extract return URL if it was encoded there
      const stateData = state.split('_')
      // You might need to adjust this parsing logic based on how you encode the state
      if (stateData.length > 3) {
        // Extract any additional data from state if needed
      }
    } catch (err) {
      console.warn('Failed to parse state:', err)
    }

    // Check if the callback was successful
    if (result && (result.success || result.status === 'success')) {
      // Redirect to success page
      const successUrl = new URL(returnUrl, process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000')
      successUrl.searchParams.set('success', 'true')
      successUrl.searchParams.set('shop', shop)
      return NextResponse.redirect(successUrl.toString())
    } else {
      // Redirect to error page
      const errorUrl = new URL(returnUrl, process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000')
      errorUrl.searchParams.set('error', 'installation_failed')
      errorUrl.searchParams.set('error_description', result?.error || 'Shopify app installation failed')
      return NextResponse.redirect(errorUrl.toString())
    }

  } catch (error) {
    console.error('Shopify callback error:', error)
    const returnUrl = new URL('/stores', process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000')
    returnUrl.searchParams.set('error', 'internal_error')
    returnUrl.searchParams.set('error_description', 'Internal server error during OAuth callback')
    return NextResponse.redirect(returnUrl.toString())
  }
}
