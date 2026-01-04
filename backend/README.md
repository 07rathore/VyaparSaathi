# VyaparSaathi Backend

## Quick Start

1. Install dependencies:
   ```bash
   npm install
   ```

2. Create `.env` file:
   ```bash
   cp .env.example .env
   ```

3. Edit `.env` and add:
   - `GEMINI_API_KEY` - Get from https://makersuite.google.com/app/apikey
   - `JWT_SECRET` - Any random string for JWT signing

4. Set up database:
   ```bash
   npx prisma generate
   npx prisma migrate dev --name init
   npm run seed
   ```

5. Start server:
   ```bash
   npm run dev
   ```

Server runs on `http://localhost:5000`

## API Endpoints

- `POST /api/auth/register` - Register user
- `POST /api/auth/login` - Login user
- `GET /api/onboarding/status` - Check onboarding status
- `POST /api/onboarding/submit` - Submit onboarding
- `GET /api/dashboard` - Get dashboard data
- `GET /api/actions/today` - Get today's actions
- `POST /api/actions/:id/complete` - Mark action complete
- `POST /api/ai/explain` - Get AI explanation
- `POST /api/ai/chat` - Chat with copilot








