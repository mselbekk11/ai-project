import { NextResponse } from 'next/server';
import { ConvexHttpClient } from "convex/browser";
import { api } from "@/convex/_generated/api";

const ASTRIA_BASEURL = 'https://api.astria.ai';
const FLUX_BASE_MODEL = '1504944'; // Using the flux base model ID from your train-model route
const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

// Key Point: Uses FLUX model for generation (same as person training), not Realistic Vision. The clothing FaceID gets combined with FLUX.

//   Why Polling is Needed:
//  - AI generation takes time (30 seconds to 2 minutes)
//  - Not instant like a normal API call
//  - Checks every 3 seconds for completion
//  - Exponential backoff on errors to avoid overwhelming the API
//  - Timeout after 60 attempts (~3 minutes total)

async function pollForCompletion(id: string, maxAttempts = 60) {
  for (let i = 0; i < maxAttempts; i++) {
    console.log(`Polling attempt ${i + 1}/${maxAttempts} for ID: ${id}`);
    
    try {
      const response = await fetch(`${ASTRIA_BASEURL}/tunes/${FLUX_BASE_MODEL}/prompts/${id}`, {
        headers: {
          'Authorization': `Bearer ${process.env.ASTRIA_API_KEY}`,
          'Accept': 'application/json',
        },
        // Add timeout to prevent hanging requests
        signal: AbortSignal.timeout(10000), // 10 second timeout
      });

      if (!response.ok) {
        console.log(`Polling attempt ${i + 1} failed with status: ${response.status}`);
        // Wait a bit longer if we get an error response
        await new Promise(resolve => setTimeout(resolve, 5000));
        continue;
      }

      const data = await response.json();
      console.log(`Polling attempt ${i + 1} response:`, data);

      if (data.images && data.images.length > 0) {
        console.log('Generation completed successfully');
        return { image_urls: data.images }; // Return all images
      }
    } catch (error) {
      console.error(`Polling attempt ${i + 1} failed with error:`, error);
      // Exponential backoff - wait longer after each failed attempt
      const backoffTime = Math.min(5000 * Math.pow(1.5, i), 30000);
      console.log(`Waiting ${backoffTime}ms before next attempt...`);
      await new Promise(resolve => setTimeout(resolve, backoffTime));
      continue;
    }

    await new Promise(resolve => setTimeout(resolve, 3000));
  }
  throw new Error(`Timeout waiting for generation after ${maxAttempts} attempts`);
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    console.log('API route received request:', body);

  //   Critical Input Data:

  // - body.prompt: The combined prompt like <lora:123:1.0> <faceid:456:1.0> Male model flux shirt
  // - body.face_id: Clothing model ID (FaceID)
  // - body.lora_id: Person model ID (LoRA)
  // - body.user_id: For ownership
  // - body.image_url: Original clothing image reference
  // - super_resolution: true (Upscales output quality)
  // - inpaint_faces: true (Enhances facial details)
  // - seed: Random number (For consistent results)
  // - face_correct: false (No face correction)
  // - face_swap: false (No face swapping)
  // - film_grain: false (No film grain effect)
  // - style: Enhance

    const formData = new FormData();
    formData.append('prompt[text]', body.prompt);
    formData.append('prompt[super_resolution]', 'true');
    formData.append('prompt[inpaint_faces]', 'true');
    formData.append('prompt[seed]', Math.floor(Math.random() * 2000) + 1 + '');
    formData.append('prompt[face_correct]', 'false');
    formData.append('prompt[face_swap]', 'false');
    formData.append('prompt[film_grain]', 'false');
    formData.append('prompt[style]', 'Enhance');
    formData.append('prompt[hires_fix]', 'true');
    formData.append('prompt[cfg_scale]', '3');
    formData.append('prompt[class]', 'man');
    formData.append('prompt[scheduler]', 'dpm++2m_karras');
    formData.append('prompt[num_inference_steps]', '30');
    formData.append('prompt[backend_version]', '0'); // Adding Backend V0 for FLUX
    formData.append('prompt[num_images]', body.num_images ? body.num_images.toString() : '2'); // Use the number from the request or default to 2
    formData.append('prompt[w]', '768'); 
    formData.append('prompt[h]', '1280'); 

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
      throw new Error(`Failed to parse Astria response: ${responseText}. Error: ${error instanceof Error ? error.message : String(error)}`);
    }

    console.log('Parsed Astria response:', data);

    if (!data.id) {
      throw new Error(`No prompt ID received from Astria. Full response: ${JSON.stringify(data)}`);
    }

    console.log('Starting to poll for completion...');
    const result = await pollForCompletion(data.id);
    console.log('Polling completed with result:', result);


// const result = await pollForCompletion(data.id);

//   What Happens:
//   1. Submit generation job to Astria with all parameters
//   2. Get job ID back immediately
//   3. Poll for completion until images are ready
//   4. Return generated image URLs





    // Save each generated image to the database
    const { image_urls } = result;
    
    console.log('Body contents for debugging:', body);
    
    // Assuming you have access to the Convex client
    const promises = image_urls.map(async (imageUrl: string) => {
      if (!body.face_id || !body.lora_id || !body.user_id || !body.image_url) {
        console.error('Missing required fields:', { 
          face_id: body.face_id, 
          lora_id: body.lora_id, 
          user_id: body.user_id, 
          image_url: body.image_url 
        });
        throw new Error('Missing required fields for database insertion');
      }
      
      // If we have a clothing_item_id, fetch its class
      let clothingClass = undefined;
      if (body.clothing_item_id) {
        try {
          // Query the clothing item directly from Convex using the getById function
          const clothingItem = await convex.query(api.clothing_items.getById, {
            id: body.clothing_item_id
          });
          
          if (clothingItem && clothingItem.class) {
            clothingClass = clothingItem.class;
            console.log(`Found clothing class: ${clothingClass} for item ID: ${body.clothing_item_id}`);
          }
        } catch (error) {
          console.error('Error fetching clothing item class:', error);
          // Continue without the class rather than failing the entire generation
        }
      }

  // Database Record Created:

  // - Links generated image to both models used
  // - Stores original clothing reference
  // - Records the exact prompt used
  // - Associates with user for ownership

      return convex.mutation(api.generations.create, {
        created_at: Date.now(),
        face_id: body.face_id,
        lora_id: body.lora_id,
        user_id: body.user_id,
        image_url_generation: imageUrl,
        image_url: body.image_url,
        gender: body.gender || 'unknown',
        prompt: body.prompt,
        clothing_item: clothingClass, // Store the clothing class instead of ID
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


//   1. Frontend constructs prompt:
// "<lora:2986814:1.0> <faceid:2987006:1.0> Male model flux shirt fashion editorial"

// 2. POST to /api/try-on with:
//    {
//      prompt: "...",
//      face_id: 2987006,     // Clothing model
//      lora_id: 2986814,     // Person model
//      user_id: "user_123",
//      num_images: 2
//    }

// 3. Astria Generation:
//    - Submits job → Gets ID: "prompt_789"
//    - Polls every 3s → Checks completion
//    - After 45s → Images ready

// 4. Database Storage:
//    - Saves 2 generated images
//    - Links to both models
//    - Records prompt used

// 5. Frontend Response:
//    - Returns generated image URLs
//    - User sees try-on results