import { NextResponse } from 'next/server';

const ASTRIA_BASEURL = 'https://api.astria.ai';

export async function POST(req: Request) {
  try {
    const { model_id, clothing_url } = await req.json();
    console.log('Received request:', { model_id, clothing_url });

    // Step 1: Create a faceid fine-tune of the garment
    const garmentFormData = new FormData();
    garmentFormData.append('tune[name]', `garment${Date.now()}`);
    garmentFormData.append('tune[title]', 'Garment Fine tune');
    garmentFormData.append('tune[type]', 'faceid');
    garmentFormData.append('tune[image_urls][]', clothing_url);
    garmentFormData.append('tune[base_model_id]', '1');

    const garmentResponse = await fetch(`${ASTRIA_BASEURL}/tunes`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.ASTRIA_API_KEY}`,
        'Accept': 'application/json',
      },
      body: garmentFormData
    });

    const garmentResponseText = await garmentResponse.text();
    console.log('Garment response:', garmentResponseText);

    if (!garmentResponse.ok) {
      throw new Error(`Garment fine-tune failed: ${garmentResponseText}`);
    }

    const garmentData = JSON.parse(garmentResponseText);
    console.log('Garment fine-tune created:', garmentData);

    // Check if the garment model is still training
    if (!garmentData.trained_at) {
      return NextResponse.json({
        status: 'training',
        message: 'Garment model is still training',
        eta: garmentData.eta,
        garment_id: garmentData.id
      });
    }

    // Step 2: Generate the try-on image using both models
    const tryOnFormData = new FormData();
    tryOnFormData.append('tune_id', model_id);
    tryOnFormData.append('prompt', `<lora:${garmentData.id}:1> person wearing the clothing, full body photo`);
    tryOnFormData.append('negative_prompt', 'bad quality, blurry, distorted');
    tryOnFormData.append('num_inference_steps', '30');

    console.log('Generating try-on image with prompt:', `<lora:${garmentData.id}:1> person wearing the clothing`);

    const tryOnResponse = await fetch(`${ASTRIA_BASEURL}/inference`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.ASTRIA_API_KEY}`,
        'Accept': 'application/json',
      },
      body: tryOnFormData
    });

    const tryOnResponseText = await tryOnResponse.text();
    console.log('Try-on response:', tryOnResponseText);

    if (!tryOnResponse.ok) {
      throw new Error(`Try-on generation failed: ${tryOnResponseText}`);
    }

    const tryOnData = JSON.parse(tryOnResponseText);
    console.log('Try-on image generated:', tryOnData);

    return NextResponse.json({
      status: 'success',
      inference_id: tryOnData.id,
      image_url: tryOnData.image_url
    });
  } catch (error) {
    console.error('Error in try-on API route:', error);
    console.error('Full error details:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
    });
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to generate try-on' },
      { status: 500 }
    );
  }
}