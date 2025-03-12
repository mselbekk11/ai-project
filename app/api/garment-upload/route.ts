import { NextResponse } from 'next/server';

const ASTRIA_BASEURL = 'https://api.astria.ai';
const REALISTIC_VISION_ID = '690204'; // Realistic Vision v5.1

export async function POST(req: Request) {
  try {
    // Add request logging
    console.log('Starting garment upload process');
    
    const body = await req.json();
    const { clothing_url } = body;
    
    if (!clothing_url) {
      console.error('No clothing_url provided');
      return NextResponse.json(
        { error: 'No clothing URL provided' },
        { status: 400 }
      );
    }

    console.log('Processing garment upload for URL:', clothing_url);

    // Updated FormData structure to match Astria's docs exactly
    const garmentFormData = new FormData();
    garmentFormData.append('tune[title]', `Garment-${Date.now()}`);
    garmentFormData.append('tune[name]', 'garment');
    garmentFormData.append('tune[model_type]', 'faceid');
    garmentFormData.append('tune[base_tune_id]', REALISTIC_VISION_ID);
    garmentFormData.append('tune[image_urls][]', clothing_url);

    // Add fetch timeout and error handling
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout

    const garmentResponse = await fetch(`${ASTRIA_BASEURL}/tunes`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.ASTRIA_API_KEY}`,
        'Accept': 'application/json',
      },
      body: garmentFormData,
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (!garmentResponse.ok) {
      const errorData = await garmentResponse.json();
      console.error('Astria API error:', errorData);
      return NextResponse.json(
        { error: `Garment upload failed: ${JSON.stringify(errorData)}` },
        { status: garmentResponse.status }
      );
    }

    const garmentData = await garmentResponse.json();
    console.log('Garment upload successful:', garmentData);

    return NextResponse.json({
      status: 'success',
      garment_id: garmentData.id,
      is_trained: !!garmentData.trained_at,
      eta: garmentData.eta
    });

  } catch (error) {
    console.error('Error in garment upload API route:', error);
    return NextResponse.json(
      { 
        error: error instanceof Error ? error.message : 'Failed to upload garment',
        details: error instanceof Error ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}