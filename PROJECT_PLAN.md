# AI Video Studio - Proje Planı

## 🎯 Proje Özeti
Web tabanlı, yapay zeka destekli video düzenleme ve oluşturma platformu

## 🏗️ Mimari Tasarım

### Frontend Katmanı
```
┌─────────────────────────────────────────────┐
│          React + Next.js Frontend           │
├─────────────────────────────────────────────┤
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  │
│  │ Timeline │  │  Canvas  │  │   AI     │  │
│  │ Editor   │  │  Preview │  │  Panel   │  │
│  └──────────┘  └──────────┘  └──────────┘  │
└─────────────────────────────────────────────┘
```

### Backend Katmanı
```
┌─────────────────────────────────────────────┐
│          Node.js + Express API              │
├─────────────────────────────────────────────┤
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  │
│  │  Video   │  │    AI    │  │  Export  │  │
│  │Processing│  │ Services │  │  Queue   │  │
│  └──────────┘  └──────────┘  └──────────┘  │
└─────────────────────────────────────────────┘
```

## 📦 Temel Özellikler

### 1. Video Düzenleme
- ✂️ Kesme, kopyalama, yapıştırma
- 🎬 Sahne yönetimi
- 🎨 Geçiş efektleri
- 🖱️ Sürükle-bırak arayüz
- ⏱️ Timeline görünümü
- 🎵 Ses ekleme ve düzenleme

### 2. AI Özellikleri
- 🎨 AI ile sahne oluşturma (Text-to-Video)
- 🖼️ AI ile görsel oluşturma (Text-to-Image)
- ✨ Otomatik geçiş önerileri
- 🎬 Otomatik sahne algılama
- 📝 Otomatik altyazı oluşturma
- 🎵 AI müzik önerisi
- 🎨 Renk düzeltme ve iyileştirme

### 3. Export ve Paylaşım
- 📤 Farklı formatlarda export (MP4, WebM, GIF)
- 📊 Çözünürlük seçenekleri (720p, 1080p, 4K)
- ☁️ Bulut depolama entegrasyonu
- 🔗 Direkt sosyal medya paylaşımı

## 🛠️ Teknoloji Stack

### Frontend
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **UI Library**: Tailwind CSS + shadcn/ui
- **State Management**: Zustand
- **Drag & Drop**: @dnd-kit
- **Canvas**: Fabric.js / Konva.js
- **Video**: HTML5 Video API
- **Video Processing**: FFmpeg.wasm

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Video Processing**: FFmpeg
- **AI APIs**:
  - OpenAI (GPT-4 Vision, DALL-E)
  - Stability AI (Stable Diffusion)
  - Runway ML (Gen-2)
  - ElevenLabs (Ses)

### Database & Storage
- **Database**: PostgreSQL + Prisma ORM
- **Cache**: Redis
- **File Storage**: AWS S3 / Cloudflare R2
- **Queue**: Bull (video processing)

## 📁 Proje Yapısı

```
video-studio/
├── frontend/                 # Next.js Frontend
│   ├── src/
│   │   ├── app/             # Next.js App Router
│   │   ├── components/      # React Components
│   │   │   ├── editor/      # Video editor components
│   │   │   ├── timeline/    # Timeline components
│   │   │   ├── ai/          # AI panel components
│   │   │   └── ui/          # Reusable UI components
│   │   ├── lib/             # Utilities & helpers
│   │   ├── hooks/           # Custom React hooks
│   │   ├── stores/          # Zustand stores
│   │   └── types/           # TypeScript types
│   ├── public/              # Static assets
│   └── package.json
│
├── backend/                  # Node.js Backend
│   ├── src/
│   │   ├── routes/          # API routes
│   │   ├── services/        # Business logic
│   │   │   ├── video/       # Video processing
│   │   │   ├── ai/          # AI integrations
│   │   │   └── export/      # Export services
│   │   ├── utils/           # Utilities
│   │   └── types/           # TypeScript types
│   ├── prisma/              # Database schema
│   └── package.json
│
└── shared/                   # Shared types & utils
    └── types/
```

## 🎨 Arayüz Tasarımı

### Ana Ekran Bileşenleri

```
┌─────────────────────────────────────────────────────────┐
│  [Logo] [File] [Edit] [AI Tools] [Export]     [User]   │ <- Header/Toolbar
├─────────────────────────────────────────────────────────┤
│ 🎬 │                                           │  AI  │ │
│ Sce│         Video Preview Area               │ Panel│ │
│ nes│          (Canvas/Player)                 │      │ │
│    │                                           │ 🎨   │ │
│ 📁 │                                           │ 💡   │ │
│ Ass│                                           │ ✨   │ │
│ ets│                                           │      │ │
├────┴───────────────────────────────────────────┴──────┤ │
│              Timeline & Tracks                         │ │
│  ┌─────┐ ┌─────┐ ┌─────┐                             │ │
│  │Scene│ │Scene│ │Scene│  [+] Add Scene              │ │
│  └─────┘ └─────┘ └─────┘                             │ │
│  ────────────────────────────────────────────         │ │
│  🎵 Audio Track                                       │ │
└────────────────────────────────────────────────────────┘
```

## 🚀 Geliştirme Aşamaları

### Phase 1: Temel Altyapı (1-2 hafta)
- [x] Proje yapısı oluşturma
- [ ] Next.js frontend kurulumu
- [ ] Express backend kurulumu
- [ ] Database şeması tasarımı
- [ ] Temel UI bileşenleri

### Phase 2: Video Editor (2-3 hafta)
- [ ] Timeline component
- [ ] Drag & drop functionality
- [ ] Video preview/player
- [ ] Sahne yönetimi
- [ ] Kesme, kopyalama, yapıştırma

### Phase 3: AI Entegrasyonu (2-3 hafta)
- [ ] Text-to-Image (DALL-E, Stable Diffusion)
- [ ] Text-to-Video (Runway ML)
- [ ] Otomatik geçişler
- [ ] Sahne analizi
- [ ] Altyazı oluşturma

### Phase 4: Video İşleme (1-2 hafta)
- [ ] FFmpeg entegrasyonu
- [ ] Video export
- [ ] Format dönüşümleri
- [ ] Kalite ayarları
- [ ] Render queue

### Phase 5: Polish & Optimize (1 hafta)
- [ ] Performance optimizasyonu
- [ ] UX iyileştirmeleri
- [ ] Hata yönetimi
- [ ] Testing
- [ ] Documentation

## 🎯 Başlangıç Adımları

1. **Development Environment**
   ```bash
   npm create next-app@latest frontend -- --typescript --tailwind --app
   mkdir backend && cd backend && npm init -y
   ```

2. **Temel Bağımlılıklar**
   - Frontend: next, react, @dnd-kit, zustand, fabric, ffmpeg.wasm
   - Backend: express, prisma, bull, ffmpeg, multer

3. **İlk Component: Timeline**
   - Zaman çizelgesi görünümü
   - Sahne kartları
   - Sürükle-bırak

4. **AI Entegrasyonu Hazırlığı**
   - API key yönetimi
   - AI servis wrapper'ları
   - Rate limiting

## 💡 Önemli Notlar

- **Video İşleme**: Ağır işlemler backend'de FFmpeg ile, hafif işlemler browser'da FFmpeg.wasm ile
- **Real-time Preview**: WebRTC veya WebSocket ile real-time preview
- **Caching**: Video işleme sonuçlarını cache'le (Redis)
- **Progressive Loading**: Büyük videolar için chunk-based loading
- **Responsive**: Mobil ve tablet desteği düşünülerek tasarla
