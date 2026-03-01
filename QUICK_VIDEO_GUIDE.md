# 🎥 Quick Video Production Guide

## Step 1: Deploy Your Platform

Choose one option:

### Option A: Vercel (Permanent, Free)
```bash
bash deploy-vercel.sh
```
Or manually:
```bash
npm install -g vercel
vercel --prod
```

### Option B: Ngrok (Temporary, Quick Demo)
```bash
bash deploy-ngrok.sh
```
Or manually:
```bash
npm run dev              # Terminal 1
ngrok http 5173          # Terminal 2
```

**Result:** You'll get a public URL like `https://your-app.vercel.app`

---

## Step 2: Generate QR Code

```bash
node generate-qr.js https://your-deployed-url.com
```

**Output:**
- `qr-code.png` - Use this in your video
- `qr-code-preview.html` - Open in browser to preview

**Test:** Scan with your phone to verify it works!

---

## Step 3: Prepare for Recording

### Install Recording Software

**macOS:**
- QuickTime (built-in)
- Or: OBS Studio from https://obsproject.com

**Windows:**
- Xbox Game Bar (Win + G)
- Or: OBS Studio from https://obsproject.com

**Linux:**
```bash
sudo apt install obs-studio
```

### Setup Checklist
```bash
cat RECORDING_CHECKLIST.txt
```

Key items:
- ✅ Clean desktop
- ✅ Disable notifications
- ✅ Test microphone
- ✅ Use Incognito browser
- ✅ Practice script

---

## Step 4: Record Your Video

### Read the Script
```bash
cat VIDEO_SCRIPT.md
```

### Recording Settings
- Resolution: 1920x1080 (1080p)
- Frame Rate: 30fps
- Audio: Enable microphone
- Duration: 10-12 minutes

### Structure
1. Intro (30s) - Show QR code
2. Dashboard (1m)
3. Role Access (1.5m)
4. Officers (2m)
5. Transfers (2.5m)
6. Leave (1.5m)
7. AI Reshuffle (1.5m)
8. Reports (1m)
9. Outro (30s) - Show QR code again

---

## Step 5: Edit Video

### Free Tools
- **DaVinci Resolve** (Best free option)
- **iMovie** (Mac)
- **Windows Video Editor** (Windows)

### Editing Tasks
- Remove mistakes/pauses
- Add QR code overlay (intro/outro)
- Add section titles
- Background music (optional, low volume)
- Export as MP4, 1080p

---

## Step 6: Publish

### Export Settings
```
Format: MP4 (H.264)
Resolution: 1920x1080
Frame Rate: 30fps
Bitrate: 8-12 Mbps
```

### Where to Publish
- YouTube (main)
- Vimeo (professional)
- LinkedIn (B2G audience)

---

## 🚀 Quick Commands Reference

```bash
# Deploy to Vercel
bash deploy-vercel.sh

# Quick demo with Ngrok
bash deploy-ngrok.sh

# Generate QR code
node generate-qr.js https://your-url.com

# Check setup status
bash check-setup.sh

# View recording checklist
cat RECORDING_CHECKLIST.txt

# Read full script
cat VIDEO_SCRIPT.md
```

---

## 📁 Files Created for You

- `VIDEO_WALKTHROUGH_GUIDE.md` - Complete detailed guide
- `VIDEO_SCRIPT.md` - Full narration script
- `RECORDING_CHECKLIST.txt` - Pre-recording checklist
- `deploy-vercel.sh` - Deploy to Vercel script
- `deploy-ngrok.sh` - Quick demo deployment
- `generate-qr.js` - QR code generator
- `QUICK_VIDEO_GUIDE.md` - This file

---

## ⏱️ Timeline Estimate

- Deploy: 30 minutes
- Generate QR: 5 minutes
- Script prep: 1 hour
- Recording: 2-3 hours
- Editing: 2-4 hours
- Publishing: 30 minutes

**Total: 1-2 days**

---

## 🎯 Test Login Credentials

For your video demo:

**Cabinet Secretary (full access):**
- Username: `cs.interior`
- Password: any

**Regional Coordinator (Nairobi):**
- Username: `rc.nairobi`
- Password: any

**County Commissioner (Nairobi):**
- Username: `cc.nairobi`
- Password: any

**Deputy Commissioner (Westlands):**
- Username: `dc.nairobi.westlands`
- Password: any

---

## 💡 Pro Tips

1. **Practice first** - Record a test run
2. **Speak slowly** - Easier to understand
3. **Show, don't just tell** - Demonstrate features
4. **QR code visibility** - Show for 5+ seconds
5. **Edit ruthlessly** - Remove dead air
6. **Add captions** - Accessibility matters
7. **Test on mobile** - Verify QR code works

---

## ❓ Need Help?

- Deployment issues? Check `CONVEX_TROUBLESHOOTING.md`
- Setup problems? Run `bash check-setup.sh`
- Recording tips? Read `VIDEO_WALKTHROUGH_GUIDE.md`
- Script questions? See `VIDEO_SCRIPT.md`

---

Good luck with your video! 🎬🚀🇰🇪
