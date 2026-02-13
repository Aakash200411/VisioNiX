# VisioNiX Frontend - Setup Instructions

## Installation & Running the Frontend

### Step 1: Install Dependencies

Navigate to the frontend folder and install all required packages:

```bash
cd frontend
npm install
```

This will install:
- React 19.2.0
- React Router v6
- Lucide React (icons)
- Axios (API calls)
- Tailwind CSS
- PostCSS & Autoprefixer

**Time:** ~2-3 minutes

### Step 2: Start Development Server

```bash
npm run dev
```

You should see output like:
```
  VITE v7.3.1  ready in 123 ms

  ➜  Local:   http://localhost:5173/
  ➜  press h to show help
```

### Step 3: Open in Browser

Visit: **http://localhost:5173**

You should now see the Login/Sign Up page with:
- Beautiful gradient background (purple/blue)
- VisioNiX branding
- Email & Password fields
- Toggle between Login and Sign Up forms

---

## What You Should See

### Initial Page (Login/Sign Up)
- Large "VisioNiX" header with VN logo
- "Vision & Image Analysis Platform" subtitle
- Email input field
- Password input field
- Full Name input field (only visible in Sign Up mode)
- "Sign In" or "Sign Up" button
- Toggle link to switch between modes

### Features Working:
✅ Form toggles between Login and Sign Up
✅ Input validation (required fields)
✅ Beautiful styling with gradients
✅ Hover effects on buttons
✅ Focus states on inputs
✅ Error message display area

---

## Troubleshooting

### Issue: Blank White Page

**Cause:** Dependencies not installed properly

**Solution:**
1. Delete `node_modules` folder: `rm -rf node_modules`
2. Delete `package-lock.json`
3. Run: `npm install`
4. Run: `npm run dev`

### Issue: "Cannot find module" errors

**Solution:**
```bash
npm install
npm run dev
```

### Issue: Port 5173 already in use

**Solution:** Vite will automatically use the next available port (5174, 5175, etc.)

### Issue: Styles not loading

**Cause:** Tailwind CSS not compiled (rare - we've converted critical styles to inline)

**Note:** The main authentication page now uses inline styles, so it will display properly even without Tailwind fully compiled.

---

## Project Structure

```
frontend/
├── src/
│   ├── pages/
│   │   ├── AuthPage.jsx        ← Login/Sign Up (currently uses inline styles)
│   │   ├── ChatPage.jsx        ← Main chatbot (uses Tailwind)
│   │   └── ExtractionPage.jsx  ← Results viewer (uses Tailwind)
│   ├── components/
│   │   ├── Sidebar.jsx
│   │   ├── ChatWindow.jsx
│   │   ├── ModelSelector.jsx
│   │   ├── Message.jsx
│   │   ├── ExtractionCard.jsx
│   │   └── ExtractionDetails.jsx
│   ├── context/
│   │   ├── AuthContext.jsx
│   │   ├── ChatContext.jsx
│   │   └── ExtractionContext.jsx
│   ├── hooks/
│   │   ├── useAuth.js
│   │   ├── useChat.js
│   │   └── useExtraction.js
│   ├── App.jsx                 ← Main app with routing
│   ├── index.css               ← Global Tailwind styles
│   └── main.jsx                ← Entry point
├── index.html                  ← HTML entry file
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
└── package.json
```

---

## Development Tips

### Hot Module Replacement (HMR)
Changes to your files will automatically reload in the browser. No need to refresh manually!

### Browser DevTools
Open DevTools (F12 or Right-click → Inspect) to see any errors in the Console tab.

### Edit Files
- **Pages:** `src/pages/`
- **Components:** `src/components/`
- **State:** `src/context/`
- **Styles:** `src/index.css`

### Next: Connect Backend
Once the frontend runs successfully, follow the guide in `NEXT_STEPS.md` to:
1. Connect to your backend API
2. Implement login/signup endpoints
3. Create chat functionality
4. Build extraction results display

---

## Build for Production

When ready to deploy:

```bash
npm run build
```

This creates an optimized `dist/` folder ready for deployment to Vercel, Netlify, or any hosting provider.

---

## Need Help?

Check these files:
- `FRONTEND_GUIDE.md` - Developer guide
- `NEXT_STEPS.md` - API integration guide
- `IMPLEMENTATION_SUMMARY.md` - Visual overview
- `FRONTEND_CHANGES.md` - Detailed changes list
