import { NextResponse } from 'next/server';
import { ConvexHttpClient } from 'convex/browser';
import { api } from '@/convex/_generated/api';

const ASTRIA_BASEURL = 'https://api.astria.ai';
const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export async function POST(req: Request) {
  console.log('API route handler started');

  try {
    const formData = await req.formData();
    const imageUrls = formData.getAll('images') as string[];
    
    console.log('FormData received:', {
      modelName: formData.get('modelName'),
      gender: formData.get('gender'),
      imageCount: imageUrls.length,
    });
    
    // Create the Astria-specific FormData
    const astriaFormData = new FormData();
    astriaFormData.append('tune[title]', formData.get('modelName') as string);
    astriaFormData.append('tune[base_tune_id]', '1504944');
    astriaFormData.append('tune[model_type]', 'lora');
    astriaFormData.append('tune[name]', 'flux');
    astriaFormData.append('tune[token]', 'model');
    astriaFormData.append('tune[gender]', formData.get('gender') as string);

    // Add image URLs to the request
    imageUrls.forEach((imageUrl) => {
      astriaFormData.append('tune[image_urls][]', imageUrl);
    });

    console.log('Sending request to Astria...', {
      imageUrls,
      modelName: formData.get('modelName'),
      gender: formData.get('gender'),
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
      name: formData.get('modelName') as string,
      model_id: String(astriaData.id),
      images: imageUrls, // Use the actual URLs
      user_id: formData.get('user_id') as string,
      gender: formData.get('gender') as string,
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