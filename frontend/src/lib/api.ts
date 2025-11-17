/**
 * API client for backend communication
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

interface APIError {
  error: string;
  message?: string;
}

class APIClient {
  private baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;

    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      const error: APIError = await response.json();
      throw new Error(error.message || error.error || 'API request failed');
    }

    return response.json();
  }

  // AI endpoints
  async generateImage(prompt: string, style?: string) {
    return this.request<{ success: boolean; image: any }>('/api/ai/generate/image', {
      method: 'POST',
      body: JSON.stringify({ prompt, style }),
    });
  }

  async generateVideo(prompt: string, duration?: number) {
    return this.request<{ success: boolean; jobId: string; estimatedTime: number }>(
      '/api/ai/generate/video',
      {
        method: 'POST',
        body: JSON.stringify({ prompt, duration }),
      }
    );
  }

  async suggestTransitions(scene1: string, scene2: string) {
    return this.request<{ success: boolean; suggestions: string }>(
      '/api/ai/suggest-transitions',
      {
        method: 'POST',
        body: JSON.stringify({ scene1, scene2 }),
      }
    );
  }

  async analyzeScene(imageUrl: string) {
    return this.request<{ success: boolean; analysis: string }>(
      '/api/ai/analyze-scene',
      {
        method: 'POST',
        body: JSON.stringify({ imageUrl }),
      }
    );
  }

  // Video endpoints
  async uploadVideo(file: File) {
    const formData = new FormData();
    formData.append('video', file);

    const response = await fetch(`${this.baseURL}/api/video/upload`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Video upload failed');
    }

    return response.json();
  }

  async getVideoInfo(videoId: string) {
    return this.request<{ success: boolean; info: any }>(
      `/api/video/info/${videoId}`
    );
  }

  // Export endpoints
  async exportProject(scenes: any[], audioTracks: any[], settings: any) {
    return this.request<{ success: boolean; jobId: string }>(
      '/api/export/render',
      {
        method: 'POST',
        body: JSON.stringify({ scenes, audioTracks, settings }),
      }
    );
  }

  async getExportStatus(jobId: string) {
    return this.request<{
      success: boolean;
      jobId: string;
      state: string;
      progress: number
    }>(`/api/export/status/${jobId}`);
  }
}

export const api = new APIClient(API_BASE_URL);
