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
    const platform = searchParams.get('platform') // optional filter by platform
    const limit = searchParams.get('limit') || '10'
    const offset = searchParams.get('offset') || '0'

    // Prepare the payload for the n8n workflow
    const payload = {
      user_id: userId,
      platform,
      limit: parseInt(limit),
      offset: parseInt(offset),
      timestamp: Date.now()
    }

    // Call the n8n workflow to get stores list
    const n8nBaseUrl = process.env.NEXT_PUBLIC_N8N_BASE_URL || 'https://n8n.weblion.pro/webhook'
    const n8nResponse = await fetch(`${n8nBaseUrl}/stores/list`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    })

    if (!n8nResponse.ok) {
      console.error('N8N stores list workflow failed:', await n8nResponse.text())
      return NextResponse.json({ error: 'Failed to fetch stores list' }, { status: 500 })
    }

    const result = await n8nResponse.json()
    
    // Return the stores list
    return NextResponse.json(result)

  } catch (error) {
    console.error('Stores list error:', error)
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    // Get authentication information
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Parse request body
    const body = await request.json()
    
    // Prepare the payload for the n8n workflow
    const payload = {
      user_id: userId,
      ...body,
      timestamp: Date.now()
    }

    // Call the n8n workflow
    const n8nBaseUrl = process.env.NEXT_PUBLIC_N8N_BASE_URL || 'https://n8n.weblion.pro/webhook'
    const n8nResponse = await fetch(`${n8nBaseUrl}/stores/list`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    })

    if (!n8nResponse.ok) {
      console.error('N8N stores list workflow failed:', await n8nResponse.text())
      return NextResponse.json({ error: 'Failed to process stores request' }, { status: 500 })
    }

    const result = await n8nResponse.json()
    
    // Return the result
    return NextResponse.json(result)

  } catch (error) {
    console.error('Stores list POST error:', error)
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
