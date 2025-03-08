import { NextResponse } from 'next/server';

const ASTRIA_BASEURL = 'https://api.astria.ai';

export async function POST(req: Request) {
  console.log('API route handler started');

  try {
    const formData = await req.formData();
    console.log('FormData received:', {
      modelName: formData.get('modelName'),
      gender: formData.get('gender'),
      imageCount: formData.getAll('images').length,
    });
    
    // Create the Astria-specific FormData
    const astriaFormData = new FormData();
    astriaFormData.append('tune[title]', formData.get('modelName') as string);
    astriaFormData.append('tune[base_tune_id]', '1504944');
    astriaFormData.append('tune[model_type]', 'lora');
    astriaFormData.append('tune[name]', 'flux');
    astriaFormData.append('tune[token]', 'model');
    astriaFormData.append('tune[gender]', formData.get('gender') as string);

    // Add images
    const images = formData.getAll('images');
    images.forEach((image) => {
      astriaFormData.append('tune[images][]', image);
    });

    console.log('Sending request to Astria...');
    
    const response = await fetch(`${ASTRIA_BASEURL}/tunes`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.ASTRIA_API_KEY}`,
      },
      body: astriaFormData,
    });

    console.log('Response status:', response.status);
    const responseText = await response.text();
    console.log('Response text:', responseText);

    if (!response.ok) {
      throw new Error(`API error: ${response.status} - ${responseText}`);
    }

    const data = JSON.parse(responseText);
    console.log('Astria API success:', data);
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error in API route:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to train model' },
      { status: 500 }
    );
  }
}