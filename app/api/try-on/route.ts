import { NextResponse } from 'next/server';
import { ConvexHttpClient } from "convex/browser";
import { api } from "@/convex/_generated/api";

const ASTRIA_BASEURL = 'https://api.astria.ai';
const FLUX_BASE_MODEL = '1504944'; // Using the flux base model ID from your train-model route
const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

async function pollForCompletion(id: string, maxAttempts = 60) {
  for (let i = 0; i < maxAttempts; i++) {
    console.log(`Polling attempt ${i + 1}/${maxAttempts} for ID: ${id}`);
    
    const response = await fetch(`${ASTRIA_BASEURL}/tunes/${FLUX_BASE_MODEL}/prompts/${id}`, {
      headers: {
        'Authorization': `Bearer ${process.env.ASTRIA_API_KEY}`,
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      console.log(`Polling attempt ${i + 1} failed with status: ${response.status}`);
      continue;
    }

    const data = await response.json();
    console.log(`Polling attempt ${i + 1} response:`, data);

    if (data.images && data.images.length > 0) {
      console.log('Generation completed successfully');
      return { image_urls: data.images }; // Return all images
    }

    await new Promise(resolve => setTimeout(resolve, 3000));
  }
  throw new Error(`Timeout waiting for generation after ${maxAttempts} attempts`);
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    console.log('API route received request:', body);

    const formData = new FormData();
    formData.append('prompt[text]', body.prompt);
    formData.append('prompt[super_resolution]', String(body.super_resolution));
    formData.append('prompt[face_correct]', 'true');
    formData.append('prompt[face_swap]', 'true');
    formData.append('prompt[cfg_scale]', '3');
    formData.append('prompt[class]', 'man');
    formData.append('prompt[scheduler]', 'dpm++2m_karras');
    formData.append('prompt[num_inference_steps]', '30');
    formData.append('prompt[backend_version]', '0'); // Adding Backend V0 for FLUX
    formData.append('prompt[num_images]', '4'); // Request 4 images

    console.log('FormData contents:');
    for (const [key, value] of formData.entries()) {
      console.log(`${key}: ${value}`);
    }

    console.log('Sending request to Astria...');
    
    const response = await fetch(`${ASTRIA_BASEURL}/tunes/${FLUX_BASE_MODEL}/prompts`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.ASTRIA_API_KEY}`,
        'Accept': 'application/json',
      },
      body: formData
    });

    // Log the raw response
    const responseText = await response.text();
    console.log('Raw Astria response:', responseText);

    if (!response.ok) {
      throw new Error(`Generation failed: ${responseText}`);
    }

    let data;
    try {
      data = JSON.parse(responseText);
    } catch (error) {
      throw new Error(`Failed to parse Astria response: ${responseText}`);
    }

    console.log('Parsed Astria response:', data);

    if (!data.id) {
      throw new Error(`No prompt ID received from Astria. Full response: ${JSON.stringify(data)}`);
    }

    console.log('Starting to poll for completion...');
    const result = await pollForCompletion(data.id);
    console.log('Polling completed with result:', result);

    // Save each generated image to the database
    const { image_urls } = result;
    
    console.log('Body contents for debugging:', body);
    
    // Assuming you have access to the Convex client
    const promises = image_urls.map((imageUrl: string) => {
      if (!body.face_id || !body.lora_id || !body.user_id || !body.image_url) {
        console.error('Missing required fields:', { 
          face_id: body.face_id, 
          lora_id: body.lora_id, 
          user_id: body.user_id, 
          image_url: body.image_url 
        });
        throw new Error('Missing required fields for database insertion');
      }

      return convex.mutation(api.generations.create, {
        created_at: Date.now(),
        face_id: body.face_id,
        lora_id: body.lora_id,
        user_id: body.user_id,
        image_url_generation: imageUrl,
        image_url: body.image_url,
        gender: body.gender || 'unknown',
        prompt: body.prompt,
      });
    });

    await Promise.all(promises);

    return NextResponse.json({
      status: 'success',
      image_urls: result.image_urls
    });
  } catch (error) {
    console.error('Error in try-on API route:', error);
    return NextResponse.json(
      { 
        error: error instanceof Error ? error.message : 'Failed to generate try-on',
        details: error instanceof Error ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}