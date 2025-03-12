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

    // Updated FormData structure for garment/shirt specific training
    const garmentFormData = new FormData();
    garmentFormData.append('tune[title]', `Shirt-${Date.now()}`);
    garmentFormData.append('tune[name]', 'shirt'); // Specifically marking as shirt
    garmentFormData.append('tune[model_type]', 'faceid');
    garmentFormData.append('tune[base_tune_id]', REALISTIC_VISION_ID);
    garmentFormData.append('tune[image_urls][]', clothing_url);
    garmentFormData.append('tune[class]', 'shirt'); // Adding class specification
    
    // Log the FormData contents
    console.log('Sending garment data to Astria:', {
      title: `Shirt-${Date.now()}`,
      name: 'shirt',
      model_type: 'faceid',
      base_tune_id: REALISTIC_VISION_ID,
      image_url: clothing_url,
      class: 'shirt'
    });

    const garmentResponse = await fetch(`${ASTRIA_BASEURL}/tunes`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.ASTRIA_API_KEY}`,
        'Accept': 'application/json',
      },
      body: garmentFormData
    });

    // Log raw response for debugging
    const responseText = await garmentResponse.text();
    console.log('Raw Astria response:', responseText);

    if (!garmentResponse.ok) {
      console.error('Astria API error:', responseText);
      return NextResponse.json(
        { error: `Garment upload failed: ${responseText}` },
        { status: garmentResponse.status }
      );
    }

    let garmentData;
    try {
      garmentData = JSON.parse(responseText);
    } catch (e) {
      console.error('Failed to parse Astria response:', e);
      return NextResponse.json(
        { error: 'Invalid response from Astria API' },
        { status: 500 }
      );
    }

    console.log('Garment upload successful:', garmentData);

    // Wait for training if needed
    if (!garmentData.trained_at) {
      console.log('Garment training in progress. ETA:', garmentData.eta);
    }

    return NextResponse.json({
      status: 'success',
      garment_id: garmentData.id,
      is_trained: !!garmentData.trained_at,
      eta: garmentData.eta,
      class: 'shirt' // Return the class for confirmation
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