# 🎬 AI Video Studio

**Yapay Zeka Destekli Profesyonel Video Düzenleme Platformu**

Modern web teknolojileri ile geliştirilmiş, AI tabanlı video oluşturma ve düzenleme stüdyosu. Sürükle-bırak arayüzü, gerçek zamanlı önizleme ve yapay zeka entegrasyonları ile profesyonel videolar oluşturun.

![Version](https://img.shields.io/badge/version-0.1.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)
![Next.js](https://img.shields.io/badge/Next.js-14-black)

## ✨ Özellikler

### 🎥 Video Düzenleme
- ✂️ **Kesme, Kopyalama, Yapıştırma** - Kolay video manipülasyonu
- 🎬 **Sahne Yönetimi** - Sahneleri organize edin ve düzenleyin
- 🎨 **Geçiş Efektleri** - Profesyonel geçişler (fade, slide, zoom, dissolve)
- 🖱️ **Sürükle-Bırak** - Sezgisel timeline arayüzü
- ⏱️ **Timeline Görünümü** - Detaylı zaman çizelgesi
- 🎵 **Ses Yönetimi** - Müzik ve ses efektleri ekleme

### 🤖 AI Özellikleri
- 🎨 **Text-to-Image** - Metinden görsel oluşturma (DALL-E, Stable Diffusion)
- 📹 **Text-to-Video** - Metinden video oluşturma (Runway ML)
- ✨ **Otomatik Geçişler** - AI destekli geçiş önerileri
- 🔍 **Sahne Analizi** - GPT-4 Vision ile sahne analizi
- 📝 **Otomatik Altyazı** - Konuşmadan altyazı oluşturma
- 🎨 **Renk İyileştirme** - AI tabanlı renk düzeltme

### 📤 Export ve Paylaşım
- 🎞️ **Çoklu Format** - MP4, WebM, GIF
- 📊 **Esnek Çözünürlük** - 720p, 1080p, 4K
- ☁️ **Bulut Depolama** - AWS S3 entegrasyonu
- 🔗 **Sosyal Medya** - Direkt paylaşım

## 🏗️ Mimari

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

## 🚀 Hızlı Başlangıç

### Gereksinimler

- Node.js 18+
- npm veya yarn
- FFmpeg (video işleme için)
- Redis (opsiyonel, export queue için)

### Kurulum

1. **Repository'yi klonlayın**
```bash
git clone <your-repo-url>
cd video_studio
```

2. **Bağımlılıkları yükleyin**
```bash
# Root package.json için
npm install

# Frontend için
cd frontend
npm install

# Backend için
cd ../backend
npm install
```

3. **Environment değişkenlerini ayarlayın**

Backend `.env` dosyası oluşturun:
```bash
cd backend
cp .env.example .env
# .env dosyasını düzenleyin ve API anahtarlarınızı ekleyin
```

4. **Geliştirme sunucularını başlatın**

```bash
# Root dizinden (hem frontend hem backend)
npm run dev

# VEYA ayrı ayrı:

# Frontend (port 3000)
cd frontend
npm run dev

# Backend (port 3001)
cd backend
npm run dev
```

5. **Tarayıcınızda açın**
```
http://localhost:3000
```

## 📁 Proje Yapısı

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
├── PROJECT_PLAN.md          # Detaylı proje planı
├── package.json             # Workspace package.json
└── README.md               # Bu dosya
```

## 🎯 Kullanım

### 1. Proje Oluşturma

Uygulama açıldığında otomatik olarak yeni bir proje oluşturulur.

### 2. Sahne Ekleme

**Manuel Ekleme:**
- Sol paneldeki "Assets" bölümünden dosya yükleyin
- Video veya görsel dosyalarını sürükle-bırak yapın

**AI ile Oluşturma:**
- Sağ panelde "AI Studio"yu kullanın
- Prompt girin (örn: "A sunset over the ocean")
- "Generate Image" veya "Generate Video" tıklayın
- Oluşturulan sahne otomatik olarak timeline'a eklenir

### 3. Timeline'da Düzenleme

- **Sürükle-Bırak**: Sahneleri yeniden sıralayın
- **Kesme**: Sahneye tıklayın, süresini ayarlayın
- **Kopyala**: Sahne üzerindeki copy butonuna tıklayın
- **Sil**: Sahne üzerindeki trash butonuna tıklayın

### 4. Önizleme

- Ortadaki canvas alanında gerçek zamanlı önizleme
- Play/Pause butonları ile kontrol
- Progress bar ile timeline'da gezinme
- Zoom in/out ile detaylı görünüm

### 5. Export

- Toolbar'da "Export" butonuna tıklayın
- Format seçin (MP4, WebM, GIF)
- Kalite ayarlarını belirleyin
- Render işlemini başlatın

## 🔌 API Endpoints

### Video İşleme
```
POST   /api/video/upload       # Video yükleme
POST   /api/video/process      # Video işleme
GET    /api/video/info/:id     # Video bilgisi
```

### AI Servisleri
```
POST   /api/ai/generate/image  # Görsel oluşturma
POST   /api/ai/generate/video  # Video oluşturma
POST   /api/ai/suggest-transitions  # Geçiş önerisi
POST   /api/ai/analyze-scene   # Sahne analizi
```

### Export
```
POST   /api/export/render      # Video render
GET    /api/export/status/:id  # Render durumu
```

## 🎨 Arayüz Bileşenleri

### EditorLayout
Ana düzenleyici layoutu. Tüm bileşenleri organize eder.

### Timeline
- Sahneleri görselleştirir
- Sürükle-bırak ile yeniden sıralama
- Zoom kontrolleri
- Playhead göstergesi

### VideoPreview
- Canvas tabanlı önizleme
- Gerçek zamanlı render
- Playback kontrolleri
- Timeline senkronizasyonu

### AIPanel
- AI görsel/video oluşturma
- Prompt girişi
- Önerilmiş promptlar
- AI özellikleri listesi

### AssetPanel
- Medya dosyaları yönetimi
- Dosya yükleme
- Asset organizasyonu

## 🔧 Geliştirme

### Yeni Özellik Ekleme

1. **Frontend Component**
```typescript
// src/components/yeni-feature/YeniComponent.tsx
export function YeniComponent() {
  // Component logic
}
```

2. **Backend Endpoint**
```typescript
// backend/src/routes/yeni.ts
router.post('/yeni-endpoint', async (req, res) => {
  // Endpoint logic
});
```

3. **Type Tanımlama**
```typescript
// frontend/src/types/index.ts
export interface YeniType {
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

## 📝 TODO ve Gelecek Özellikler

### Phase 1 - Core Features ✅
- [x] Proje yapısı
- [x] Timeline component
- [x] Drag & drop
- [x] Video preview
- [x] AI panel

### Phase 2 - Advanced Features 🚧
- [ ] Gerçek AI entegrasyonları (OpenAI, Runway)
- [ ] FFmpeg video işleme
- [ ] Video export/render
- [ ] Undo/Redo sistemi
- [ ] Keyboard shortcuts

### Phase 3 - Enhancement 📋
- [ ] Kullanıcı hesapları
- [ ] Proje kaydetme/yükleme
- [ ] Bulut depolama
- [ ] Gerçek zamanlı işbirliği
- [ ] Template library
- [ ] Ses düzenleme araçları

### Phase 4 - Professional Features 💡
- [ ] Gelişmiş efektler
- [ ] Color grading
- [ ] Motion graphics
- [ ] 3D transitions
- [ ] AI video enhancement
- [ ] Batch processing

## 🤝 Katkıda Bulunma

Katkılarınızı bekliyoruz! Lütfen şu adımları takip edin:

1. Fork yapın
2. Feature branch oluşturun (`git checkout -b feature/harika-ozellik`)
3. Değişikliklerinizi commit edin (`git commit -m 'Harika özellik eklendi'`)
4. Branch'inizi push edin (`git push origin feature/harika-ozellik`)
5. Pull Request açın

## 📄 Lisans

Bu proje MIT lisansı altında lisanslanmıştır.

## 🙏 Teşekkürler

- [Next.js](https://nextjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [FFmpeg](https://ffmpeg.org/)
- [OpenAI](https://openai.com/)
- [DND Kit](https://dndkit.com/)

## 📧 İletişim

Sorularınız için issue açabilir veya pull request gönderebilirsiniz.

---

**Yapay Zeka ile Video Düzenlemenin Geleceği** 🚀

Made with ❤️ using Next.js, TypeScript, and AI