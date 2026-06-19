import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import apiRouter from './routes/api.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 10000;

app.use(cors());
app.use(express.json());

import { isFirebaseAdminReady } from './config/firebase.js';
import { isSupabaseConfigured } from './config/supabase.js';

// Main APIs
app.use('/api', apiRouter);

// Basic health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    firebaseAdminReady: isFirebaseAdminReady,
    supabaseConfigured: isSupabaseConfigured,
    time: new Date() 
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
