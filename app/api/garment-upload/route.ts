import { NextResponse } from 'next/server';

const ASTRIA_BASEURL = 'https://api.astria.ai';
const REALISTIC_VISION_ID = '690204'; // Realistic Vision v5.1

const VALID_GARMENT_TYPES = ['clothing', 'shirt', 'pants', 'coat', 'swimming_suit'] as const;
export type GarmentType = typeof VALID_GARMENT_TYPES[number];

//   Data Flow:

//   1. User uploads clothing → UploadThing → URL
//   2. Frontend calls → /api/garment-upload → Astria
//   3. Astria trains → FaceID model created
//   4. Model stored → Ready for try-on generation

//  Key Differences from Person Training:

// - REALISTIC_VISION_ID: Uses Realistic Vision v5.1 (ID: 690204) instead of FLUX
// - Different base model optimized for clothing and fashion imagery
// - Predefined garment types for consistent categorization

// Format garment type for Astria API (replace underscores with spaces, etc.)
function formatGarmentType(type: string): string {
  return type.replace(/_/g, ' ');
}

export async function POST(req: Request) {

//   Input Requirements:
//   - clothing_url: UploadThing URL of the clothing item image
//   - garment_type: Must be one of the valid types (shirt, pants, etc.)
//   - Single image vs. multiple images for person training

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

//   tune[model_type]: 'faceid'

// - Different from person training which uses 'lora'
// - FaceID is Astria's technique for clothing/object training
// - Creates embeddings that can be referenced in prompts

//   tune[base_tune_id]: '690204'

//   - Realistic Vision v5.1 - specialized for fashion/clothing
//   - Better at understanding garment details, textures, fits
//   - Different from FLUX used for person training

//   tune[class]

//   - Categorizes the clothing type
//   - Used later in generation prompts
//   - Helps AI understand what kind of garment it's learning
    
    console.log('Sending garment data to Astria');

  // API Call to Astria:
  // Same endpoint (/tunes) but different parameters create different model types.

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

    //   Key Response Fields:
    // - garment_id: Astria's ID for this clothing model
    // - is_trained: Whether training is complete (usually instant for clothing)
    // - eta: Estimated time for completion
    // - class: Original garment type for frontend use

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

// 7. How It Integrates with Try-On Generation

 // When generating try-on images, both models are combined:

  // From try-on/route.ts
//  const prompt = `<lora:${personLoraId}:1.0> <faceid:${clothingFaceId}:1.0> ${gender} model flux ${garmentType}`;

//  Dual Model System:
//   - Person model (<lora:ID>) provides the person's features
//   - Clothing model (<faceid:ID>) provides the garment to wear
//   - Combined in a single prompt for generation