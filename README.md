# 🍿 CineSync — Real-Time Watch Party & WebRTC Video Call Platform

CineSync is a modern, full-featured **Real-Time Watch Party & WebRTC Video Call** web application. It enables users to invite friends to watch videos in synchronized real-time playback while video calling, chatting, screen sharing, and recording watch party sessions.

---

## ✨ Features Included

1. **🎬 Synchronized Watch Party**:
   - Host & guest video playback synchronization (`Play`, `Pause`, `Seek`, `Change Video Source`).
   - Smart drift auto-resync (keeps all participants strictly synced with the host timestamp).
   - Sample HD video library (*Big Buck Bunny*, *Elephant Dream*, *Tears of Steel*, etc.).
   - Support for pasting direct MP4/WebM video URLs and YouTube links.
   - Support for loading local video files directly from your device.

2. **📹 WebRTC HD Video & Audio Calls**:
   - Real-time peer-to-peer video call grid powered by WebRTC & PeerJS.
   - Microphone Mute/Unmute toggle.
   - Camera On/Off toggle.
   - Participant video tiles with status badges (Host tag, muted, video off, raise hand).

3. **🖥️ Screen Sharing**:
   - One-click screen sharing (`getDisplayMedia`) into the room call grid.

4. **💬 Live Party Chat & Floating Reactions**:
   - Real-time text messaging with user avatars and host badges.
   - System event logs (join/leave room alerts, video sync notifications).
   - Interactive floating emoji bursts (❤️, 🔥, 🎉, 😂, 👏, 🍿) and celebratory confetti!

5. **🔴 Local Session Recording**:
   - Host or participants can record the watch party session using the browser `MediaRecorder` API.
   - Live timer banner (`● REC 00:45`).
   - One-click local video download (`.webm` video file).

6. **🔗 Easy Invites & QR Code**:
   - Shareable room links (`?room=party-xyz`).
   - Instant Room Code copy.
   - Dynamic QR Code generator for mobile phone scanning.

---

## 🛠️ Built With

- **React 19** + **Vite 8**
- **Vanilla CSS** (Custom dark mode design system with glassmorphism & glow effects)
- **PeerJS** (WebRTC P2P Data & Media Streams)
- **BroadcastChannel** (Zero-latency local multi-tab sync fallback)
- **Lucide React** (Icons)
- **QRCode.react** (QR Code generator)
- **Canvas-Confetti** (Celebration animations)

---

## 🚀 How to Run Locally

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Start Development Server**:
   ```bash
   npm run dev
   ```
   Open `http://localhost:5173/` in your browser.

3. **Test with Multiple Friends / Tabs**:
   - Click **Start Watch Party** to generate a room code (e.g. `party-8891`).
   - Open a second browser window/tab with `http://localhost:5173/?room=party-8891` or scan the QR Code.

---

## 🌐 How to Deploy to Vercel or Netlify

### Option 1: Deploy to Vercel (Recommended)

1. **Push to GitHub**:
   - Push this repository to your GitHub account:
     ```bash
     git init
     git add .
     git commit -m "Initial CineSync commit"
     git branch -M main
     git remote add origin https://github.com/YOUR_USERNAME/cinesync.git
     git push -u origin main
     ```

2. **Deploy on Vercel**:
   - Go to [Vercel Dashboard](https://vercel.com/new).
   - Import your `cinesync` repository.
   - Keep default settings (**Framework**: Vite, **Build Command**: `npm run build`, **Output Directory**: `dist`).
   - Click **Deploy**.
   - Your live link will be generated (e.g. `https://cinesync.vercel.app`).

### Option 2: Deploy to Netlify

1. **Deploy via Netlify Dashboard**:
   - Go to [Netlify Dashboard](https://app.netlify.com/start).
   - Connect your GitHub repository.
   - Build settings will automatically detect `netlify.toml`:
     - **Build Command**: `npm run build`
     - **Publish Directory**: `dist`
   - Click **Deploy Site**.
   - Your live link will be generated (e.g. `https://cinesync.netlify.app`).

2. **Deploy via Netlify CLI (Instant)**:
   ```bash
   npm install -g netlify-cli
   npm run build
   netlify deploy --prod
   ```

---

## 📄 License
MIT License
