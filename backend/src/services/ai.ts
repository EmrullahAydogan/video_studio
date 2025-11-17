import { Request, Response } from 'express';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const generateImage = async (req: Request, res: Response) => {
  try {
    const { prompt, style, size = '1024x1024' } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    // Generate image using DALL-E
    const response = await openai.images.generate({
      model: 'dall-e-3',
      prompt: prompt + (style ? ` in ${style} style` : ''),
      size: size as any,
      quality: 'standard',
      n: 1,
    });

    res.json({
      success: true,
      image: response.data[0],
    });
  } catch (error) {
    console.error('Image generation error:', error);
    res.status(500).json({ error: 'Failed to generate image' });
  }
};

export const generateVideo = async (req: Request, res: Response) => {
  try {
    const { prompt, duration = 5, aspectRatio = '16:9' } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    // TODO: Integrate with video generation APIs (Runway, Stability AI, etc.)
    // For now, return a placeholder response

    res.json({
      success: true,
      message: 'Video generation started',
      jobId: `video-${Date.now()}`,
      estimatedTime: duration * 2, // seconds
    });
  } catch (error) {
    console.error('Video generation error:', error);
    res.status(500).json({ error: 'Failed to generate video' });
  }
};

export const suggestTransitions = async (req: Request, res: Response) => {
  try {
    const { scene1, scene2 } = req.body;

    // Use GPT to analyze scenes and suggest transitions
    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: 'You are a video editing expert. Suggest the best transition between two scenes.',
        },
        {
          role: 'user',
          content: `Scene 1: ${scene1}\nScene 2: ${scene2}\n\nSuggest 3 best transitions.`,
        },
      ],
    });

    res.json({
      success: true,
      suggestions: response.choices[0].message.content,
    });
  } catch (error) {
    console.error('Transition suggestion error:', error);
    res.status(500).json({ error: 'Failed to suggest transitions' });
  }
};

export const analyzeScene = async (req: Request, res: Response) => {
  try {
    const { imageUrl } = req.body;

    if (!imageUrl) {
      return res.status(400).json({ error: 'Image URL is required' });
    }

    // Use GPT-4 Vision to analyze the scene
    const response = await openai.chat.completions.create({
      model: 'gpt-4-vision-preview',
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: 'Analyze this scene and describe: 1) Main subjects 2) Colors 3) Mood 4) Composition',
            },
            {
              type: 'image_url',
              image_url: { url: imageUrl },
            },
          ],
        },
      ],
    });

    res.json({
      success: true,
      analysis: response.choices[0].message.content,
    });
  } catch (error) {
    console.error('Scene analysis error:', error);
    res.status(500).json({ error: 'Failed to analyze scene' });
  }
};
