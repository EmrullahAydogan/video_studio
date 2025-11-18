# 🎬 AI Video Studio

Professional AI-powered video editing studio built with React, Next.js, and FFmpeg.

## ✨ Features

### ✅ Currently Implemented (UI Complete)
- 🎥 **Timeline Editor** - Professional multi-track timeline with drag & drop
- ✂️ **Scene Management** - Trim, split, duplicate, reorder scenes
- 🎨 **Visual Effects** - Filters, transitions, transforms, Ken Burns effect
- 🎭 **Chroma Key** - Green screen removal with advanced controls
- 🤖 **AI Integration Ready** - Background removal, video generation (requires API keys)
- 📊 **Project Templates** - 8 pre-built templates for different use cases
- ⚡ **Keyboard Shortcuts** - Professional editing workflow
- 💾 **Auto-save** - Never lose your work
- 🔄 **Undo/Redo** - Full history system (50 states)
- 📍 **Timeline Markers** - Visual markers with snapping
- 🎯 **Snapping** - Smart snap to grid, markers, and scene boundaries

### 🎨 Effects & Tools
- **Filters**: Brightness, Contrast, Saturation, Blur
- **Transitions**: Fade, Slide, Zoom, Dissolve, Wipe
- **Transform**: Rotate, Flip, Crop
- **Ken Burns Effect**: Pan & zoom animations for images
- **Chroma Key**: Professional green screen removal
- **Speed Control**: 0.25x to 2x playback speed
- **Text Animations**: 6 different animation types
- **Picture-in-Picture**: Multi-layer compositing

## 🚀 One-Command Setup (All Platforms)

### Prerequisites
- **Docker Desktop** (Windows/Mac/Linux)
  - Windows: [Download Docker Desktop](https://www.docker.com/products/docker-desktop)
  - Mac: [Download Docker Desktop](https://www.docker.com/products/docker-desktop)
  - Linux: [Install Docker Engine](https://docs.docker.com/engine/install/)

### Installation

#### Windows
```cmd
setup.bat
```

#### macOS / Linux
```bash
./setup.sh
```

That's it! 🎉

The application will be available at:
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:4000

## 📋 Manual Setup (Without Docker)

### Frontend
```bash
cd frontend
npm install
npm run dev
```

### Backend
```bash
cd backend
npm install
npm start
```

**Note**: Manual setup requires Node.js 18+ and FFmpeg installed on your system.

## 🎯 Usage

1. **Create a Project**: Click "Templates" and choose a template, or start blank
2. **Add Media**: Drag & drop videos, images, or audio files to the timeline
3. **Edit**: Use the timeline to trim, reorder, and adjust scenes
4. **Apply Effects**: Select a scene and adjust properties in the right panel
5. **Export**: Click "Export" to render your final video

## ⌨️ Keyboard Shortcuts

### Playback
- `Space` - Play/Pause
- `Home` - Jump to start
- `End` - Jump to end
- `←/→` - Navigate frames
- `Shift + ←/→` - Skip 5 seconds

### Editing
- `Ctrl + Z` - Undo
- `Ctrl + Y` - Redo
- `Ctrl + C` - Copy scene
- `Ctrl + V` - Paste scene
- `Ctrl + D` - Duplicate scene
- `Delete` - Delete scene

### Timeline
- `S` - Toggle snapping
- `Ctrl + +` - Zoom in
- `Ctrl + -` - Zoom out
- `Ctrl + 0` - Reset zoom

### General
- `Ctrl + S` - Save project
- `?` - Show all shortcuts

## 🛠️ Tech Stack

### Frontend
- **React** - UI library
- **Next.js** - React framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Zustand** - State management
- **DnD Kit** - Drag & drop

### Backend
- **Node.js** - Runtime
- **Express** - Web framework
- **FFmpeg** - Video processing
- **Multer** - File uploads

### DevOps
- **Docker** - Containerization
- **Docker Compose** - Multi-container orchestration

## 📁 Project Structure

```
video_studio/
├── frontend/           # React/Next.js frontend
│   ├── src/
│   │   ├── components/ # UI components
│   │   ├── stores/     # Zustand state management
│   │   ├── types/      # TypeScript types
│   │   └── lib/        # Utilities
│   └── Dockerfile
├── backend/            # Node.js + Express backend
│   ├── src/
│   │   └── index.js    # API server
│   └── Dockerfile
├── docker-compose.yml  # Multi-container config
├── setup.sh            # Unix setup script
└── setup.bat           # Windows setup script
```

## 🔧 Configuration

### Environment Variables

**Backend** (`backend/.env`):
```env
NODE_ENV=development
PORT=4000
FRONTEND_URL=http://localhost:3000
```

**Frontend** (automatic):
```env
NEXT_PUBLIC_API_URL=http://localhost:4000
```

### AI Integration (Optional)

To enable AI features, add API keys to `backend/.env`:
```env
OPENAI_API_KEY=your_key_here
STABILITY_API_KEY=your_key_here
RUNWAY_API_KEY=your_key_here
```

## 🐳 Docker Commands

```bash
# Start services
docker-compose up

# Start in background
docker-compose up -d

# Stop services
docker-compose down

# View logs
docker-compose logs -f

# Rebuild containers
docker-compose up --build

# Remove all data
docker-compose down -v
```

## 🎓 Development

### Run in Development Mode
```bash
# Frontend (with hot reload)
cd frontend && npm run dev

# Backend (with nodemon)
cd backend && npm run dev
```

### Build for Production
```bash
# Frontend
cd frontend && npm run build

# Backend
cd backend && npm start
```

## 🐛 Troubleshooting

### Port Already in Use
Change ports in `docker-compose.yml`:
```yaml
ports:
  - "3001:3000"  # Frontend
  - "4001:4000"  # Backend
```

### Docker Not Starting
1. Ensure Docker Desktop is running
2. Check system resources (RAM/CPU)
3. Try: `docker-compose down && docker-compose up --build`

### FFmpeg Errors
FFmpeg is included in the Docker container. If running manually, install:
- **Windows**: [Download FFmpeg](https://ffmpeg.org/download.html)
- **Mac**: `brew install ffmpeg`
- **Linux**: `sudo apt install ffmpeg`

## 📝 License

MIT

## 🤝 Contributing

Contributions welcome! Feel free to:
- Report bugs
- Suggest features
- Submit pull requests

## 🎉 Acknowledgments

- FFmpeg for video processing
- React & Next.js teams
- All open-source contributors
