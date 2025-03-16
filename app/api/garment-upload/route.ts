import { NextResponse } from 'next/server';

const ASTRIA_BASEURL = 'https://api.astria.ai';
const REALISTIC_VISION_ID = '690204'; // Realistic Vision v5.1

const VALID_GARMENT_TYPES = ['clothing', 'shirt', 'pants', 'coat', 'swimming_suit'] as const;
type GarmentType = typeof VALID_GARMENT_TYPES[number];

// Format garment type for Astria API (replace underscores with spaces, etc.)
function formatGarmentType(type: string): string {
  return type.replace(/_/g, ' ');
}

export async function POST(req: Request) {
  try {
    console.log('Starting garment upload process');
    
    const body = await req.json();
    const { clothing_url, garment_type } = body;
    
    if (!clothing_url) {
      console.error('No clothing_url provided');
      return NextResponse.json(
        { error: 'No clothing URL provided' },
        { status: 400 }
      );
    }

    if (!garment_type || !VALID_GARMENT_TYPES.includes(garment_type)) {
      console.error('Invalid garment type:', garment_type);
      return NextResponse.json(
        { error: 'Invalid garment type provided' },
        { status: 400 }
      );
    }

    const formattedGarmentType = formatGarmentType(garment_type);
    console.log('Processing garment upload for URL:', clothing_url);
    console.log('Garment type:', formattedGarmentType);

    const garmentFormData = new FormData();
    garmentFormData.append('tune[title]', `${formattedGarmentType}-${Date.now()}`);
    garmentFormData.append('tune[name]', formattedGarmentType);
    garmentFormData.append('tune[model_type]', 'faceid');
    garmentFormData.append('tune[base_tune_id]', REALISTIC_VISION_ID);
    garmentFormData.append('tune[image_urls][]', clothing_url);
    garmentFormData.append('tune[class]', formattedGarmentType);
    
    console.log('Sending garment data to Astria');

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
      class: garment_type // Keep the original type in our response
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