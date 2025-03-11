import { NextResponse } from 'next/server';
import { ConvexHttpClient } from 'convex/browser';
import { api } from '@/convex/_generated/api';

const ASTRIA_BASEURL = 'https://api.astria.ai';
const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export async function POST(req: Request) {
  console.log('API route handler started');

  try {
    const body = await req.json();
    const { modelName, gender, user_id, imageUrls } = body;
    
    console.log('Request body received:', {
      modelName,
      gender,
      imageCount: imageUrls.length,
    });
    
    // Create the Astria-specific FormData
    const astriaFormData = new FormData();
    astriaFormData.append('tune[title]', modelName);
    astriaFormData.append('tune[base_tune_id]', '1504944');
    astriaFormData.append('tune[model_type]', 'lora');
    astriaFormData.append('tune[name]', 'flux');
    astriaFormData.append('tune[token]', 'model');
    astriaFormData.append('tune[gender]', gender);

    // Add image URLs to the request
    imageUrls.forEach((imageUrl: string) => {
      astriaFormData.append('tune[image_urls][]', imageUrl);
    });

    console.log('Sending request to Astria...', {
      imageUrls,
      modelName,
      gender,
    });
    
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
    await convex.mutation(api.headshot_models.createHeadshotModel, {
      name: modelName,
      model_id: String(astriaData.id),
      images: imageUrls,
      user_id,
      gender,
    });

    return NextResponse.json(astriaData);
  } catch (error) {
    console.error('Error in API route:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to train model' },
      { status: 500 }
    );
  }
}