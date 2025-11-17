'use client';

import { useState } from 'react';
import { useProjectStore } from '@/stores/useProjectStore';
import { Sparkles, Image, Video, Wand2, Zap, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { api } from '@/lib/api';

export function AIPanel() {
  const { addScene } = useProjectStore();
  const [prompt, setPrompt] = useState('');
  const [generationType, setGenerationType] = useState<'image' | 'video'>('image');
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;

    setIsGenerating(true);
    setError(null);

    try {
      if (generationType === 'image') {
        // Generate image with DALL-E
        const response = await api.generateImage(prompt);

        if (response.success && response.image) {
          const newScene = {
            type: 'ai-generated' as const,
            name: prompt.slice(0, 30) + '...',
            duration: 3,
            startTime: 0,
            prompt,
            aiProvider: 'openai' as const,
            src: response.image.url,
            thumbnail: response.image.url,
          };

          addScene(newScene);
          setPrompt('');
        }
      } else {
        // Generate video (Runway ML or similar)
        const response = await api.generateVideo(prompt, 5);

        if (response.success) {
          // For video, we get a job ID and need to poll for completion
          // For now, create a placeholder scene
          const newScene = {
            type: 'ai-generated' as const,
            name: prompt.slice(0, 30) + '...',
            duration: 5,
            startTime: 0,
            prompt,
            aiProvider: 'runway' as const,
            thumbnail: undefined,
          };

          addScene(newScene);
          setPrompt('');

          // TODO: Poll for video completion using jobId
          console.log('Video generation started, jobId:', response.jobId);
        }
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Generation failed';
      setError(errorMessage);
      console.error('Generation error:', err);

      // Fall back to placeholder for demo purposes
      if (errorMessage.includes('Failed to fetch') || errorMessage.includes('API')) {
        const newScene = {
          type: 'ai-generated' as const,
          name: prompt.slice(0, 30) + '...',
          duration: generationType === 'video' ? 5 : 3,
          startTime: 0,
          prompt,
          aiProvider: 'openai' as const,
          thumbnail: undefined,
        };
        addScene(newScene);
        setPrompt('');
        setError('Note: Using demo mode. Configure API keys for real AI generation.');
      }
    } finally {
      setIsGenerating(false);
    }
  };

  const suggestedPrompts = [
    'A serene mountain landscape at sunset',
    'Futuristic cityscape with flying cars',
    'Underwater coral reef with tropical fish',
    'Abstract geometric patterns in motion',
  ];

  const aiFeatures = [
    {
      icon: Sparkles,
      title: 'AI Scene Generation',
      description: 'Create stunning visuals from text',
      active: true,
    },
    {
      icon: Wand2,
      title: 'Smart Transitions',
      description: 'Auto-suggest scene transitions',
      active: false,
    },
    {
      icon: Zap,
      title: 'Auto-enhance',
      description: 'Improve colors and quality',
      active: false,
    },
  ];

  return (
    <div className="h-full flex flex-col bg-card border-l">
      {/* Header */}
      <div className="p-4 border-b">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-primary" />
          AI Studio
        </h2>
        <p className="text-xs text-muted-foreground mt-1">
          Generate content with AI
        </p>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {/* Generation Type */}
        <div>
          <label className="text-sm font-medium mb-2 block">Generate</label>
          <div className="grid grid-cols-2 gap-2">
            <Button
              variant={generationType === 'image' ? 'default' : 'outline'}
              onClick={() => setGenerationType('image')}
              className="w-full"
            >
              <Image className="w-4 h-4 mr-2" />
              Image
            </Button>
            <Button
              variant={generationType === 'video' ? 'default' : 'outline'}
              onClick={() => setGenerationType('video')}
              className="w-full"
            >
              <Video className="w-4 h-4 mr-2" />
              Video
            </Button>
          </div>
        </div>

        {/* Prompt Input */}
        <div>
          <label className="text-sm font-medium mb-2 block">Prompt</label>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Describe what you want to create..."
            className="w-full h-24 px-3 py-2 text-sm border rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-primary bg-background"
            disabled={isGenerating}
          />
        </div>

        {/* Error Message */}
        {error && (
          <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-md flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-destructive flex-shrink-0 mt-0.5" />
            <p className="text-xs text-destructive">{error}</p>
          </div>
        )}

        {/* Generate Button */}
        <Button
          onClick={handleGenerate}
          disabled={!prompt.trim() || isGenerating}
          className="w-full"
        >
          {isGenerating ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
              Generating...
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 mr-2" />
              Generate {generationType}
            </>
          )}
        </Button>

        {/* Suggested Prompts */}
        <div>
          <label className="text-sm font-medium mb-2 block">Suggestions</label>
          <div className="space-y-2">
            {suggestedPrompts.map((suggestedPrompt, index) => (
              <button
                key={index}
                onClick={() => setPrompt(suggestedPrompt)}
                className="w-full text-left text-xs p-2 rounded border hover:bg-accent transition-colors"
                disabled={isGenerating}
              >
                {suggestedPrompt}
              </button>
            ))}
          </div>
        </div>

        {/* AI Features */}
        <div className="pt-4 border-t">
          <label className="text-sm font-medium mb-3 block">AI Features</label>
          <div className="space-y-2">
            {aiFeatures.map((feature, index) => (
              <div
                key={index}
                className={`p-3 rounded-lg border ${
                  feature.active
                    ? 'bg-primary/5 border-primary/20'
                    : 'bg-muted/50 border-muted'
                }`}
              >
                <div className="flex items-start gap-3">
                  <feature.icon className={`w-5 h-5 ${
                    feature.active ? 'text-primary' : 'text-muted-foreground'
                  }`} />
                  <div className="flex-1">
                    <h4 className="text-sm font-medium">{feature.title}</h4>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {feature.description}
                    </p>
                  </div>
                  {!feature.active && (
                    <span className="text-xs text-muted-foreground">Soon</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
