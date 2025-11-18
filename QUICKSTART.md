# 🚀 Quick Start Guide

## 🎯 Goal
Get AI Video Studio running on your computer in **under 5 minutes**.

## 📋 Requirements

**Only requirement:** Docker Desktop

- [Download for Windows](https://www.docker.com/products/docker-desktop)
- [Download for Mac](https://www.docker.com/products/docker-desktop)
- [Download for Linux](https://docs.docker.com/engine/install/)

## ⚡ Installation

### Step 1: Download/Clone the Project

```bash
git clone <repository-url>
cd video_studio
```

### Step 2: Run Setup Script

**Windows:**
```cmd
setup.bat
```

**Mac/Linux:**
```bash
./setup.sh
```

### Step 3: Open Browser

Navigate to: **http://localhost:3000**

✅ **Done!** You're ready to edit videos.

## 🎬 First Video

1. Click **"Templates"** button
2. Choose **"YouTube Intro"** template
3. Click on scenes to edit properties
4. Adjust text, colors, animations
5. Click **"Export"** when ready

## 💡 Tips

- **Drag & Drop**: Drop video/image files directly on timeline
- **Keyboard**: Press `?` to see all shortcuts
- **Undo**: Use `Ctrl+Z` (or `Cmd+Z` on Mac)
- **Save**: Projects auto-save to browser storage

## 🆘 Help

### Nothing happens?
1. Make sure Docker Desktop is running
2. Wait 2-3 minutes for first-time build
3. Check terminal for errors

### Port already in use?
Edit `docker-compose.yml`:
```yaml
ports:
  - "3001:3000"  # Change 3000 to 3001
```

### Need more help?
- Check full [README.md](README.md)
- Open an issue on GitHub

## 🎓 Next Steps

- Explore the **[README.md](README.md)** for full documentation
- Learn **keyboard shortcuts** by pressing `?` in the app
- Try different **templates** for your use case
- Check **Scene Properties** panel on the right

Enjoy creating! 🎉
