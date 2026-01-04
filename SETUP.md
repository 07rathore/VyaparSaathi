# Quick Setup Guide

## Step-by-Step Setup

### 1. Backend Setup (Terminal 1)

```bash
cd backend
npm install
cp .env.example .env
# Edit .env and add your GEMINI_API_KEY
npx prisma generate
npx prisma migrate dev --name init
npm run seed
npm run dev
```

Backend will run on `http://localhost:5000`

### 2. Frontend Setup (Terminal 2)

```bash
cd frontend
npm install
npm run dev
```

Frontend will run on `http://localhost:3000`

### 3. Get Gemini API Key

1. Go to https://makersuite.google.com/app/apikey
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy the key
5. Paste it in `backend/.env` as `GEMINI_API_KEY=your-key-here`

### 4. Test the Application

1. Open `http://localhost:3000` in your browser
2. Register a new account
3. Complete the onboarding (5 questions)
4. Explore the dashboard and features!

## Troubleshooting

### Database Issues
- If migration fails, delete `backend/dev.db` and run `npx prisma migrate dev --name init` again

### API Key Issues
- Make sure your Gemini API key is correctly set in `backend/.env`
- The app will still work without it, but AI features won't function
- If you get a "model not found" error, the app automatically tries alternative models (gemini-1.5-flash, gemini-1.5-pro)

### Port Already in Use
- Change `PORT` in `backend/.env` for backend
- Change `server.port` in `frontend/vite.config.js` for frontend

## Default Credentials

No default credentials - create your own account!


