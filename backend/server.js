import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
import onboardingRoutes from './routes/onboarding.js';
import dashboardRoutes from './routes/dashboard.js';
import actionsRoutes from './routes/actions.js';
import aiRoutes from './routes/ai.js';
import testModelsRoutes from './routes/test-models.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });


// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/onboarding', onboardingRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/actions', actionsRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/test-models', testModelsRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'VyaparSaathi API is running' });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});


