# 🎬 AI Video Studio

**AI-Powered Professional Video Editing Platform**

A modern AI-based video creation and editing studio built with cutting-edge web technologies. Create professional videos with drag-and-drop interface, real-time preview, and artificial intelligence integrations.

![Version](https://img.shields.io/badge/version-0.1.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)
![Next.js](https://img.shields.io/badge/Next.js-14-black)

## ✨ Features

### 🎥 Video Editing
- ✂️ **Cut, Copy, Paste** - Easy video manipulation
- 🎬 **Scene Management** - Organize and arrange scenes
- 🎨 **Transition Effects** - Professional transitions (fade, slide, zoom, dissolve)
- 🖱️ **Drag & Drop** - Intuitive timeline interface
- ⏱️ **Timeline View** - Detailed timeline visualization
- 🎵 **Audio Management** - Add music and sound effects with volume and fade controls

### 🤖 AI Features
- 🎨 **Text-to-Image** - Generate images from text (DALL-E, Stable Diffusion)
- 📹 **Text-to-Video** - Generate videos from text (Runway ML)
- ✨ **Auto Transitions** - AI-powered transition suggestions
- 🔍 **Scene Analysis** - Scene analysis with GPT-4 Vision
- 📝 **Auto Subtitles** - Generate subtitles from speech
- 🎨 **Color Enhancement** - AI-based color correction

### 📤 Export & Sharing
- 🎞️ **Multiple Formats** - MP4, WebM, GIF
- 📊 **Flexible Resolution** - 720p, 1080p, 4K
- ☁️ **Cloud Storage** - AWS S3 integration
- 🔗 **Social Media** - Direct sharing

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────┐
│                  Next.js Frontend                    │
│  ┌────────┐  ┌─────────┐  ┌─────────┐  ┌────────┐  │
│  │Timeline│  │ Canvas  │  │   AI    │  │ Assets │  │
│  │ Editor │  │ Preview │  │  Panel  │  │ Panel  │  │
│  └────────┘  └─────────┘  └─────────┘  └────────┘  │
└─────────────────────────────────────────────────────┘
                         ↕
┌─────────────────────────────────────────────────────┐
│              Express.js Backend API                  │
│  ┌────────┐  ┌─────────┐  ┌─────────┐  ┌────────┐  │
│  │ Video  │  │   AI    │  │ Export  │  │ Queue  │  │
│  │Process │  │Services │  │ Render  │  │ (Bull) │  │
│  └────────┘  └─────────┘  └─────────┘  └────────┘  │
└─────────────────────────────────────────────────────┘
                         ↕
┌─────────────────────────────────────────────────────┐
│         External Services & Storage                  │
│  ┌────────┐  ┌─────────┐  ┌─────────┐  ┌────────┐  │
│  │ OpenAI │  │Stability│  │ Runway  │  │  AWS   │  │
│  │   API  │  │   AI    │  │   ML    │  │   S3   │  │
│  └────────┘  └─────────┘  └─────────┘  └────────┘  │
└─────────────────────────────────────────────────────┘
```

## 🛠️ Teknoloji Stack

### Frontend
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **Drag & Drop**: @dnd-kit
- **Canvas Rendering**: Fabric.js
- **Video Processing**: FFmpeg.wasm

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Video Processing**: FFmpeg
- **Job Queue**: Bull + Redis
- **AI Services**:
  - OpenAI (GPT-4, DALL-E 3)
  - Stability AI
  - Runway ML

### DevOps
- **Database**: PostgreSQL
- **Cache**: Redis
- **Storage**: AWS S3
- **Deployment**: Vercel (Frontend), AWS EC2 (Backend)

## 🚀 Quick Start

### Requirements

- Node.js 18+
- npm or yarn
- FFmpeg (for video processing)
- Redis (optional, for export queue)

### Installation

1. **Clone the repository**
```bash
git clone <your-repo-url>
cd video_studio
```

2. **Install dependencies**
```bash
# Root package.json
npm install

# Frontend
cd frontend
npm install

# Backend
cd ../backend
npm install
```

3. **Set up environment variables**

Create backend `.env` file:
```bash
cd backend
cp .env.example .env
# Edit .env and add your API keys
```

4. **Start development servers**

```bash
# From root directory (both frontend and backend)
npm run dev

# OR separately:

# Frontend (port 3000)
cd frontend
npm run dev

# Backend (port 3001)
cd backend
npm run dev
```

5. **Open in your browser**
```
http://localhost:3000
```

## 📁 Project Structure

```
video-studio/
├── frontend/                 # Next.js Frontend
│   ├── src/
│   │   ├── app/             # Next.js App Router
│   │   │   ├── layout.tsx   # Root layout
│   │   │   ├── page.tsx     # Ana sayfa
│   │   │   └── globals.css  # Global stiller
│   │   ├── components/      # React Components
│   │   │   ├── editor/      # Video editor components
│   │   │   │   ├── EditorLayout.tsx
│   │   │   │   ├── VideoPreview.tsx
│   │   │   │   ├── Toolbar.tsx
│   │   │   │   └── AssetPanel.tsx
│   │   │   ├── timeline/    # Timeline components
│   │   │   │   ├── Timeline.tsx
│   │   │   │   └── SceneCard.tsx
│   │   │   ├── ai/          # AI panel components
│   │   │   │   └── AIPanel.tsx
│   │   │   └── ui/          # Reusable UI components
│   │   │       └── button.tsx
│   │   ├── lib/             # Utilities & helpers
│   │   │   └── utils.ts
│   │   ├── stores/          # Zustand stores
│   │   │   └── useProjectStore.ts
│   │   └── types/           # TypeScript types
│   │       └── index.ts
│   ├── public/              # Static assets
│   ├── package.json
│   ├── tsconfig.json
│   ├── tailwind.config.ts
│   └── next.config.js
│
├── backend/                  # Node.js Backend
│   ├── src/
│   │   ├── index.ts         # Express app
│   │   ├── routes/          # API routes
│   │   │   ├── video.ts     # Video endpoints
│   │   │   ├── ai.ts        # AI endpoints
│   │   │   └── export.ts    # Export endpoints
│   │   └── services/        # Business logic
│   │       ├── video.ts     # Video processing
│   │       ├── ai.ts        # AI integrations
│   │       └── export.ts    # Export/render
│   ├── uploads/             # Uploaded files
│   ├── exports/             # Rendered videos
│   ├── package.json
│   ├── tsconfig.json
│   └── .env.example
│
├── PROJECT_PLAN.md          # Detailed project plan
├── package.json             # Workspace package.json
└── README.md               # This file
```

## 🎯 Usage

### 1. Create Project

A new project is automatically created when the application opens.

### 2. Add Scenes

**Manual Import:**
- Upload files from the "Assets" panel on the left
- Drag and drop video or image files

**AI Generation:**
- Use "AI Studio" on the right panel
- Enter a prompt (e.g., "A sunset over the ocean")
- Click "Generate Image" or "Generate Video"
- Generated scene is automatically added to timeline

### 3. Edit Timeline

- **Drag & Drop**: Reorder scenes
- **Trim**: Click on scene, adjust duration
- **Copy**: Click copy button on scene
- **Delete**: Click trash button on scene

### 4. Preview

- Real-time preview in center canvas area
- Control with Play/Pause buttons
- Navigate timeline with progress bar
- Zoom in/out for detailed view

### 5. Export

- Click "Export" button in toolbar
- Select format (MP4, WebM, GIF)
- Set quality options
- Start rendering

## 🔌 API Endpoints

### Video Processing
```
POST   /api/video/upload       # Upload video
POST   /api/video/process      # Process video
GET    /api/video/info/:id     # Get video info
```

### AI Services
```
POST   /api/ai/generate/image  # Generate image
POST   /api/ai/generate/video  # Generate video
POST   /api/ai/suggest-transitions  # Suggest transitions
POST   /api/ai/analyze-scene   # Analyze scene
```

### Export
```
POST   /api/export/render      # Render video
GET    /api/export/status/:id  # Get render status
```

## 🎨 UI Components

### EditorLayout
Main editor layout. Organizes all components.

### Timeline
- Visualizes scenes
- Reorder with drag and drop
- Zoom controls
- Playhead indicator

### VideoPreview
- Canvas-based preview
- Real-time rendering
- Playback controls
- Timeline synchronization

### AIPanel
- AI image/video generation
- Prompt input
- Suggested prompts
- AI features list

### AssetPanel
- Media file management
- File upload
- Asset organization

## 🔧 Development

### Adding New Features

1. **Frontend Component**
```typescript
// src/components/new-feature/NewComponent.tsx
export function NewComponent() {
  // Component logic
}
```

2. **Backend Endpoint**
```typescript
// backend/src/routes/new.ts
router.post('/new-endpoint', async (req, res) => {
  // Endpoint logic
});
```

3. **Type Definition**
```typescript
// frontend/src/types/index.ts
export interface NewType {
  // Type definition
}
```

### Testing

```bash
# Frontend test
cd frontend
npm run test

# Backend test
cd backend
npm run test
```

### Build

```bash
# Frontend build
cd frontend
npm run build

# Backend build
cd backend
npm run build
```

## 📝 TODO & Future Features

### Phase 1 - Core Features ✅
- [x] Project structure
- [x] Timeline component
- [x] Drag & drop
- [x] Video preview
- [x] AI panel

### Phase 2 - Advanced Features ✅
- [x] Real AI integrations (OpenAI DALL-E for images)
- [x] Improved video upload with duration detection
- [x] Video export/render dialog with quality settings
- [x] Undo/Redo system (useUndoRedo hook)
- [x] Keyboard shortcuts system
- [x] Automatic thumbnail generation for videos
- [x] API client for backend communication
- [ ] FFmpeg video processing (backend integration needed)

### Phase 3 - Enhancement 🚧
- [x] Project save/load (localStorage)
- [x] Project management UI (create, load, delete, duplicate)
- [x] Auto-save functionality
- [x] Project export/import (JSON files)
- [x] Multiple project support
- [ ] User accounts (authentication)
- [ ] Database integration (PostgreSQL + Prisma)
- [ ] Cloud storage (AWS S3)
- [ ] Real-time collaboration
- [ ] Template library
- [ ] Audio editing tools

### Phase 4 - Professional Features ✅ (Mostly Complete)
- [x] Advanced effects and filters panel
- [x] Color grading (brightness, contrast, saturation, blur)
- [x] Transition effects (fade, slide, zoom, dissolve, wipe)
- [x] Text overlay with full customization
- [x] Scene properties panel with real-time editing
- [x] Tabbed sidebar (AI Studio + Properties)
- [x] Audio volume and fade controls
- [x] Audio track management with visual waveforms
- [ ] Motion graphics
- [ ] 3D transitions
- [ ] AI video enhancement
- [ ] Batch processing

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [FFmpeg](https://ffmpeg.org/)
- [OpenAI](https://openai.com/)
- [DND Kit](https://dndkit.com/)

## 📧 Contact

For questions, please open an issue or submit a pull request.

---

**The Future of AI-Powered Video Editing** 🚀

Made with ❤️ using Next.js, TypeScript, and AI