import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const imageUrl = searchParams.get('url');

    if (!imageUrl) {
      return new NextResponse('Missing image URL', { status: 400 });
    }

    // Validate that the URL is from Astria
    if (!imageUrl.startsWith('https://mp.astria.ai/') && 
        !imageUrl.startsWith('https://api.astria.ai/')) {
      return new NextResponse('Invalid image URL', { status: 400 });
    }

    // Fetch the image from Astria
    const response = await fetch(imageUrl, {
      headers: {
        'Authorization': `Bearer ${process.env.ASTRIA_API_KEY}`,
        'Accept': 'image/*',
      },
    });

    if (!response.ok) {
      console.error(`Failed to fetch image from Astria: ${response.status} ${response.statusText}`);
      return new NextResponse('Failed to fetch image', { status: response.status });
    }

    // Get the image data
    const imageBuffer = await response.arrayBuffer();
    const contentType = response.headers.get('content-type') || 'image/jpeg';

    // Return the image with proper headers
    return new NextResponse(imageBuffer, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=86400', // Cache for 24 hours
        'Access-Control-Allow-Origin': '*',
      },
    });
  } catch (error) {
    console.error('Error proxying image:', error);
    return new NextResponse('Internal server error', { status: 500 });
  }
}