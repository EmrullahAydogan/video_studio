// Stickers and Graphics Library

export interface Sticker {
  id: string;
  category: 'emoji' | 'shape' | 'icon';
  content: string;
  name: string;
}

export const STICKERS: Sticker[] = [
  // Emojis
  { id: 'emoji-1', category: 'emoji', content: '😀', name: 'Happy Face' },
  { id: 'emoji-2', category: 'emoji', content: '😍', name: 'Heart Eyes' },
  { id: 'emoji-3', category: 'emoji', content: '🎉', name: 'Party' },
  { id: 'emoji-4', category: 'emoji', content: '👍', name: 'Thumbs Up' },
  { id: 'emoji-5', category: 'emoji', content: '❤️', name: 'Heart' },
  { id: 'emoji-6', category: 'emoji', content: '🔥', name: 'Fire' },
  { id: 'emoji-7', category: 'emoji', content: '⭐', name: 'Star' },
  { id: 'emoji-8', category: 'emoji', content: '✨', name: 'Sparkles' },
  { id: 'emoji-9', category: 'emoji', content: '🎬', name: 'Movie' },
  { id: 'emoji-10', category: 'emoji', content: '📹', name: 'Video Camera' },
  { id: 'emoji-11', category: 'emoji', content: '🎥', name: 'Camera' },
  { id: 'emoji-12', category: 'emoji', content: '🎵', name: 'Music' },
  { id: 'emoji-13', category: 'emoji', content: '💡', name: 'Idea' },
  { id: 'emoji-14', category: 'emoji', content: '🚀', name: 'Rocket' },
  { id: 'emoji-15', category: 'emoji', content: '🎯', name: 'Target' },
  { id: 'emoji-16', category: 'emoji', content: '💎', name: 'Diamond' },
  { id: 'emoji-17', category: 'emoji', content: '🏆', name: 'Trophy' },
  { id: 'emoji-18', category: 'emoji', content: '✅', name: 'Check' },
  { id: 'emoji-19', category: 'emoji', content: '❌', name: 'X' },
  { id: 'emoji-20', category: 'emoji', content: '⚠️', name: 'Warning' },

  // Shapes (using Unicode symbols)
  { id: 'shape-1', category: 'shape', content: '●', name: 'Circle' },
  { id: 'shape-2', category: 'shape', content: '■', name: 'Square' },
  { id: 'shape-3', category: 'shape', content: '▲', name: 'Triangle' },
  { id: 'shape-4', category: 'shape', content: '◆', name: 'Diamond' },
  { id: 'shape-5', category: 'shape', content: '★', name: 'Star' },
  { id: 'shape-6', category: 'shape', content: '♥', name: 'Heart' },
  { id: 'shape-7', category: 'shape', content: '→', name: 'Arrow Right' },
  { id: 'shape-8', category: 'shape', content: '←', name: 'Arrow Left' },
  { id: 'shape-9', category: 'shape', content: '↑', name: 'Arrow Up' },
  { id: 'shape-10', category: 'shape', content: '↓', name: 'Arrow Down' },

  // Icons
  { id: 'icon-1', category: 'icon', content: '☀️', name: 'Sun' },
  { id: 'icon-2', category: 'icon', content: '🌙', name: 'Moon' },
  { id: 'icon-3', category: 'icon', content: '⚡', name: 'Lightning' },
  { id: 'icon-4', category: 'icon', content: '🌟', name: 'Glowing Star' },
  { id: 'icon-5', category: 'icon', content: '💫', name: 'Dizzy' },
  { id: 'icon-6', category: 'icon', content: '🎨', name: 'Art' },
  { id: 'icon-7', category: 'icon', content: '📱', name: 'Phone' },
  { id: 'icon-8', category: 'icon', content: '💻', name: 'Laptop' },
  { id: 'icon-9', category: 'icon', content: '🎮', name: 'Game' },
  { id: 'icon-10', category: 'icon', content: '🌍', name: 'Globe' },
];
