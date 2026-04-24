import { Router } from 'express';
import { GoogleGenAI } from '@google/genai';
import { 
  CLARIFY_INTENT_PROMPT, 
  GENERATE_PLAN_PROMPT, 
  GENERATE_REWARDS_PROMPT 
} from './prompts.js';

const router = Router();

// Middleware to extract API key
router.use('/gemini', (req, res, next) => {
  const authHeader = req.headers.authorization;
  let key = '';
  
  if (authHeader && authHeader.startsWith('Bearer ')) {
    key = authHeader.substring(7);
  }
  
  // Fallback to environment variable
  if (!key) {
    key = process.env.GEMINI_API_KEY || '';
  }
  
  if (!key) {
    return res.status(401).json({ error: 'No API key provided' });
  }
  
  (req as any).geminiApiKey = key;
  next();
});

router.post('/gemini/test-key', async (req, res) => {
  try {
    const ai = new GoogleGenAI({ apiKey: (req as any).geminiApiKey });
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: 'Respond with a valid JSON object: {"status": "ok"}',
      config: { responseMimeType: 'application/json' }
    });
    res.json(JSON.parse(response.text || '{}'));
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/gemini/clarify-intent', async (req, res) => {
  try {
    const { intent } = req.body;
    if (!intent) return res.status(400).json({ error: 'Intent is required' });

    const prompt = CLARIFY_INTENT_PROMPT.replace('{{USER_INTENT}}', intent);
    const ai = new GoogleGenAI({ apiKey: (req as any).geminiApiKey });
    
    // We import schema dynamically up top or assume it's enforced by the prompt JSON config
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: { responseMimeType: 'application/json' }
    });
    
    res.json(JSON.parse(response.text || '{}'));
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/gemini/generate-plan', async (req, res) => {
  try {
    const { intent, answers } = req.body;
    const prompt = GENERATE_PLAN_PROMPT
      .replace('{{USER_INTENT}}', intent)
      .replace('{{CLARIFICATION_ANSWERS}}', JSON.stringify(answers));
      
    const ai = new GoogleGenAI({ apiKey: (req as any).geminiApiKey });
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: { responseMimeType: 'application/json' }
    });
    
    res.json(JSON.parse(response.text || '{}'));
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/gemini/generate-rewards', async (req, res) => {
  try {
    const { intent, plan } = req.body;
    const prompt = GENERATE_REWARDS_PROMPT
      .replace('{{USER_INTENT}}', intent)
      .replace('{{ACTIVATION_PLAN}}', JSON.stringify(plan));
      
    const ai = new GoogleGenAI({ apiKey: (req as any).geminiApiKey });
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: { responseMimeType: 'application/json' }
    });
    
    res.json(JSON.parse(response.text || '{}'));
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
