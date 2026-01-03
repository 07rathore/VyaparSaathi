# VyaparSaathi - Real-Time Tax & Compliance Copilot

> A fear-free, real-time compliance assistant that tells micro-businesses exactly what applies to them, what they need to do today, and how safe they are — in simple language.

## 🎯 Problem Statement

Micro-businesses, freelancers, gig workers, and small traders avoid formal compliance not due to unwillingness, but due to fear, complexity, unclear obligations, and dependence on intermediaries. VyaparSaathi removes fear and simplifies compliance using a real-time, intelligent copilot.

## ✨ Core Innovation Features

### 1. **Compliance Confidence Score (0-100)**
- Dynamic score based on user profile, pending obligations, and upcoming deadlines
- Visual indicators: Green (Safe), Yellow (Attention needed), Red (High risk)
- Updates in real-time as compliance status changes

### 2. **"What Applies to Me?" Engine**
- Simple 5-6 question onboarding
- Shows ONLY relevant compliances based on:
  - Type of work (freelancer, shop owner, gig worker, small business)
  - Monthly income range
  - GST registration status
  - State location
- Filters out irrelevant laws automatically

### 3. **Plain-Language Law Translator (AI-Powered)**
- Uses Gemini AI to explain compliance rules in simple English
- 1-2 line explanations
- Clear "What you need to do" and "By when" information
- Completely avoids legal jargon

### 4. **Real-Time Compliance Copilot (Chat)**
- Friendly chat interface powered by Gemini AI
- Answers questions like:
  - "Am I safe this month?"
  - "What happens if I miss filing?"
  - "Explain GST simply"
- Reassuring, non-threatening tone

### 5. **Proactive Action View**
- "Today's Actions" checklist
- Clear status: Pending, Done, Not applicable
- Each action shows:
  - What to do
  - Deadline
  - Penalty (if missed, in simple terms)

## 🛠️ Tech Stack

### Frontend
- **React** (Vite)
- **Tailwind CSS** - Responsive, mobile-first UI
- **React Router** - Navigation
- **Axios** - API calls

### Backend
- **Node.js** with **Express**
- **Prisma ORM** - Database management
- **SQLite** - Database (hackathon-friendly, easily switchable to PostgreSQL)
- **JWT** - Authentication
- **bcryptjs** - Password hashing

### AI Integration
- **Google Gemini API** - Compliance explanations and chat copilot
- Automatic model fallback (tries gemini-1.5-flash, gemini-1.5-pro, etc.)

## 📁 Project Structure

```
Hack_project_01/
├── backend/
│   ├── middleware/
│   │   └── auth.js          # JWT authentication middleware
│   ├── routes/
│   │   ├── auth.js          # Register/Login endpoints
│   │   ├── onboarding.js   # Onboarding flow
│   │   ├── dashboard.js     # Dashboard data
│   │   ├── actions.js      # Today's actions
│   │   └── ai.js           # AI endpoints (explain, chat)
│   ├── utils/
│   │   ├── complianceEngine.js  # Compliance logic & scoring
│   │   └── gemini.js            # Gemini API integration
│   ├── scripts/
│   │   └── seed.js         # Seed compliance rules
│   ├── prisma/
│   │   └── schema.prisma    # Database schema
│   ├── server.js           # Express server
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   └── PrivateRoute.jsx
│   │   ├── contexts/
│   │   │   └── AuthContext.jsx
│   │   ├── pages/
│   │   │   ├── Login.jsx
│   │   │   ├── Onboarding.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Actions.jsx
│   │   │   ├── Copilot.jsx
│   │   │   ├── ComplianceExplained.jsx
│   │   │   └── History.jsx
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── package.json
│   └── vite.config.js
└── README.md
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Google Gemini API key ([Get it here](https://makersuite.google.com/app/apikey))

### Backend Setup

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   ```bash
   cp .env.example .env
   ```
   Edit `.env` and add your values:
   ```env
   PORT=5000
   DATABASE_URL="file:./dev.db"
   JWT_SECRET=your-secret-key-change-in-production
   GEMINI_API_KEY=your-gemini-api-key-here
   ```

4. **Set up database:**
   ```bash
   npx prisma generate
   npx prisma migrate dev --name init
   ```

5. **Seed compliance rules:**
   ```bash
   node scripts/seed.js
   ```

6. **Start the server:**
   ```bash
   npm run dev
   ```
   Server will run on `http://localhost:5000`

### Frontend Setup

1. **Navigate to frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start development server:**
   ```bash
   npm run dev
   ```
   Frontend will run on `http://localhost:3000`

## 📱 Application Screens

### 1. **Login/Register**
- Simple email-based authentication
- No OTP complexity
- Session-based auth with JWT

### 2. **Onboarding (5 Steps)**
- Step 1: Type of work
- Step 2: Monthly income range
- Step 3: GST registration status
- Step 4: State selection
- Step 5: City (optional)

### 3. **Main Dashboard**
- **Compliance Confidence Score** (big, visual)
- Status message (e.g., "You're compliant today", "2 actions pending")
- Next upcoming deadline card
- Risk indicator (Low/Medium/High)
- Quick stats (Total, Completed, Pending)

### 4. **Today's Actions**
- Checklist-style view
- Grouped by status (Pending, Completed, Not Applicable)
- Clear action buttons
- Deadline information
- Penalty warnings (if applicable)

### 5. **AI Compliance Copilot**
- Chat interface
- Suggested questions
- Real-time responses from Gemini AI
- Friendly, reassuring tone

### 6. **Compliance Explained**
- List of all applicable compliances
- Expandable simple explanations (AI-powered)
- Deadline and penalty information
- Plain language descriptions

### 7. **History & Proof**
- Timeline of completed filings
- Compliance rate statistics
- Credit eligibility message
- On-time vs overdue tracking

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Onboarding
- `GET /api/onboarding/status` - Check onboarding status
- `POST /api/onboarding/submit` - Submit onboarding answers

### Dashboard
- `GET /api/dashboard` - Get dashboard data (score, status, upcoming deadlines)

### Actions
- `GET /api/actions/today` - Get today's actions
- `POST /api/actions/:id/complete` - Mark action as completed
- `POST /api/actions/:id/not-applicable` - Mark action as not applicable

### AI
- `POST /api/ai/explain` - Get AI explanation for a compliance rule
- `POST /api/ai/chat` - Chat with compliance copilot

## 🗄️ Database Schema

### User
- Basic user information (email, password)

### UserProfile
- Work type, income range, GST status, location
- Onboarding completion status

### ComplianceRule
- Compliance rules with applicability conditions
- Frequency, deadlines, penalties

### UserComplianceStatus
- User's compliance status for each rule
- Due dates, completion dates, status

## 🎨 Design Principles

- **Never use scary legal language** - Always reassuring
- **Never show unnecessary complexity** - Only what applies
- **Always reassure the user** - Focus on solutions
- **Prefer clarity over features** - Simple is better
- **Design for low digital literacy** - Easy to understand

## 🔒 Security Features

- Password hashing with bcryptjs
- JWT-based authentication
- Protected routes with middleware
- Input validation

## 🧪 Testing the Application

1. **Register/Login:**
   - Create an account with email and password
   - Login with credentials

2. **Complete Onboarding:**
   - Answer 5 simple questions
   - System will determine applicable compliances

3. **View Dashboard:**
   - See your Compliance Confidence Score
   - Check pending actions
   - View upcoming deadlines

4. **Interact with AI Copilot:**
   - Ask questions about compliance
   - Get friendly, simple explanations

5. **Manage Actions:**
   - Mark actions as completed
   - View deadlines and penalties

## 🚧 Future Enhancements

- Email reminders for upcoming deadlines
- PDF generation for compliance reports
- Integration with actual filing systems
- Multi-language support
- Mobile app version
- Advanced analytics and insights

## 📝 Notes

- This is a hackathon-grade application focused on demo-readiness
- Mock compliance rules are included for demonstration
- SQLite is used for easy setup (can be switched to PostgreSQL)
- Gemini API key is required for AI features to work

## 🤝 Contributing

This is a hackathon project. For improvements:
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

This project is created for hackathon purposes.

## 👥 Team

Built with ❤️ for micro-businesses, freelancers, and small traders who deserve fear-free compliance.

---

**Remember:** Compliance doesn't have to be scary. VyaparSaathi is here to help! 😊


