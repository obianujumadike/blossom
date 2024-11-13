// src/app/api/analyze/route.ts

import { NextResponse } from 'next/server';
import axios from 'axios';

export async function POST(request: Request) {
  const formData = await request.formData();
  const file = formData.get('image');

  if (!file || !(file instanceof Blob)) {
    return NextResponse.json({ error: 'No image provided' }, { status: 400 });
  }

  try {
    const response = await axios.post(
      process.env.GCLOUD_MODEL_ENDPOINT as string,
      { image: file },
      {
        headers: {
          'Authorization': `Bearer ${process.env.GCLOUD_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const result = response.data; // Expected result from Google Cloud
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error analyzing image:', error);
    return NextResponse.json({ error: 'Error analyzing image' }, { status: 500 });
  }
}
