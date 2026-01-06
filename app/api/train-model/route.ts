import { NextResponse } from 'next/server';
import { ConvexHttpClient } from 'convex/browser';
import { api } from '@/convex/_generated/api';

const ASTRIA_BASEURL = 'https://api.astria.ai';
const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

// Data Flow:

// 1. User uploads → UploadThing → URLs stored
// 2. Frontend calls → /api/train-model → Astria API
// 3. Astria trains → 15-30 minutes → Webhook callback
// 4. Database updated → Model ready for generation

export async function POST(req: Request) {
  console.log('API route handler started');

  // Input data:
  // - modelName: User-defined name for the model (e.g., "Morgan Portrait")
  // - gender: "Male" or "Female" - affects prompt generation later
  // - user_id: Clerk user ID for ownership
  // - imageUrls: Array of UploadThing URLs (5-20 images of the person)

  try {
    const body = await req.json();
    const { modelName, gender, user_id, imageUrls } = body;
    
    console.log('Request body received:', {
      modelName,
      gender,
      imageCount: imageUrls.length,
    });
    
    // Create the Astria-specific FormData
    //   Key Parameters Explained:
    // - tune[base_tune_id]: '1504944' - FLUX base model (state-of-the-art diffusion model)
    // - tune[model_type]: 'lora' - LoRA (Low-Rank Adaptation) - efficient fine-tuning technique
    // - tune[name]: 'flux' - Model architecture name
    // - tune[token]: 'model' - Token used in prompts to reference this person
    const astriaFormData = new FormData();
    astriaFormData.append('tune[title]', modelName);
    astriaFormData.append('tune[base_tune_id]', '1504944');
    astriaFormData.append('tune[model_type]', 'lora');
    astriaFormData.append('tune[name]', 'flux');
    astriaFormData.append('tune[token]', 'model');
    astriaFormData.append('tune[gender]', gender);

    // Add webhook URL for Astria callbacks
    //  Critical for Production:
    // - When training completes (15-30 minutes), Astria calls this webhook
    // - Updates model status from "processing" → "finished"
    // - Provides the lora_id needed for generation
    if (process.env.NEXT_PUBLIC_WEBHOOK_URL) {
      const webhookUrl = `${process.env.NEXT_PUBLIC_WEBHOOK_URL}/api/webhook/astria`;
      console.log('Setting webhook URL:', webhookUrl);
      astriaFormData.append('tune[callback]', webhookUrl);
    }

    // Add image URLs to the request
    //   - Sends 5-20 images of the person to Astria
    //   - Uses UploadThing URLs (already uploaded by user)
    imageUrls.forEach((imageUrl: string) => {
      astriaFormData.append('tune[image_urls][]', imageUrl);
    });

    console.log('Sending request to Astria...', {
      imageUrls,
      modelName,
      gender,
    });

    //   What happens:

    // - POST to https://api.astria.ai/tunes
    // - Authenticates with API key
    // - Sends all training parameters and images
    // - Returns training job ID and status
    
    const astriaResponse = await fetch(`${ASTRIA_BASEURL}/tunes`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.ASTRIA_API_KEY}`,
        'Accept': 'application/json',
      },
      body: astriaFormData,
    });



    console.log('Response status:', astriaResponse.status);
    const responseText = await astriaResponse.text();
    console.log('Response text:', responseText);

    if (!astriaResponse.ok) {
      throw new Error(`API error: ${astriaResponse.status} - ${responseText}`);
    }

    const astriaData = JSON.parse(responseText);
    console.log('Astria API success:', astriaData);

    // Store in Convex with the actual image URLs
    //   - model_id: Astria's training job ID
    //   - status: Initially "processing" (or "finished" if training completed)
    //   - images: Original training images
    //   - user_id: For ownership/permissions
    //   - gender: For filtering/display

    await convex.mutation(api.headshot_models.createHeadshotModel, {
      name: modelName,
      model_id: String(astriaData.id),
      images: imageUrls,
      user_id,
      gender,
    });

    // Returns Astria's response plus success message to frontend.
    return NextResponse.json({ 
      ...astriaData,
      message: "Model training started successfully" 
    });
  } catch (error) {
    console.error('Error in API route:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to train model' },
      { status: 500 }
    );
  }
}