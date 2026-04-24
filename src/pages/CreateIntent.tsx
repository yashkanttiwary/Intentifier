import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, Loader2, CheckCircle2 } from 'lucide-react';
import { useIntentStore } from '../store/useIntentStore';
import { apiFetch } from '../lib/apiClient';

export default function CreateIntent() {
  const [inputText, setInputText] = useState('');
  const [step, setStep] = useState<'input' | 'clarifying' | 'answering' | 'building' | 'done'>('input');
  const [errorMsg, setErrorMsg] = useState('');
  const navigate = useNavigate();
  
  const { 
    intent, 
    clarificationQuestions, 
    clarificationAnswers, 
    setIntent, 
    setQuestions, 
    setAnswer, 
    setPlan, 
    setRewards 
  } = useIntentStore();

  const handleClarify = async () => {
    if (!inputText.trim()) return;
    
    setIntent(inputText);
    setStep('clarifying');
    setErrorMsg('');
    try {
      const data = await apiFetch('/gemini/clarify-intent', {
        method: 'POST',
        body: JSON.stringify({ intent: inputText })
      });
      if (data.questions) {
        setQuestions(data.questions);
        setStep('answering');
      } else {
        throw new Error('Invalid response structure');
      }
    } catch (err: any) {
      setStep('input');
      setErrorMsg(err.message || 'Failed to clarify. Please try again.');
    }
  };

  const handleGeneratePlan = async () => {
    setStep('building');
    try {
      // 1. Build Plan
      const planData = await apiFetch('/gemini/generate-plan', {
        method: 'POST',
        body: JSON.stringify({ intent, answers: clarificationAnswers })
      });
      setPlan(planData);

      // 2. Build Rewards
      const rewardData = await apiFetch('/gemini/generate-rewards', {
        method: 'POST',
        body: JSON.stringify({ intent, plan: planData })
      });
      setRewards(rewardData);
      
      setStep('done');
      setTimeout(() => navigate('/dashboard'), 1500);

    } catch (err: any) {
      setStep('answering');
      setErrorMsg(err.message || 'Failed to generate plan.');
    }
  };

  const allAnswered = clarificationQuestions 
    ? clarificationQuestions.every((q: any) => clarificationAnswers[q.id] && clarificationAnswers[q.id].trim() !== '')
    : false;

  return (
    <div className="space-y-8 pt-6 p-6">
      <div className="space-y-4">
        <h2 className="text-4xl font-serif italic text-[#1a1a1a] leading-tight">
          Define the <br /><span className="pl-8 text-[#c2410c]">Ephemeral.</span>
        </h2>
        <p className="text-[#4a4a4a] text-sm max-w-sm">
          Start small. We will extract the true intent behind the desire.
        </p>
      </div>

      {step === 'input' && (
        <div className="space-y-4">
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="e.g. I want to walk 20 mins a day..."
            className="w-full bg-[#f8f7f4] border border-black/10 p-4 text-[#1a1a1a] placeholder:text-[#1a1a1a]/30 focus:outline-none focus:border-black/30 resize-none h-32 text-sm"
          />
          {errorMsg && <p className="text-[#c2410c] text-[11px] uppercase tracking-widest font-semibold">{errorMsg}</p>}
          <button
            onClick={handleClarify}
            disabled={inputText.trim().length < 3}
            className="w-full bg-[#1a1a1a] text-[#f8f7f4] font-semibold py-4 text-[11px] uppercase tracking-widest hover:bg-black transition-colors disabled:opacity-50 flex flex-row items-center justify-center gap-2"
          >
            <Sparkles size={14} /> Clarify Intent
          </button>
        </div>
      )}

      {step === 'clarifying' && (
        <div className="py-24 flex flex-col items-center justify-center space-y-6 text-center border-t border-black/10 mt-8">
          <Loader2 className="w-8 h-8 animate-spin text-[#c2410c]" />
          <p className="text-[10px] uppercase tracking-widest text-[#1a1a1a] opacity-60 animate-pulse">Extracting Narrative...</p>
        </div>
      )}

      {step === 'answering' && clarificationQuestions && (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 border-t border-black/10 pt-8 mt-4">
          <div className="space-y-8">
            {clarificationQuestions.map((q: any, i: number) => (
              <div key={q.id} className="space-y-4">
                <label className="text-sm font-semibold text-[#1a1a1a] block leading-relaxed">
                  <span className="text-[#c2410c] mr-2 font-serif italic text-lg">0{i + 1}.</span> {q.question}
                </label>
                <input
                  type="text"
                  value={clarificationAnswers[q.id] || ''}
                  onChange={(e) => setAnswer(q.id, e.target.value)}
                  placeholder="Your honest answer..."
                  className="w-full bg-transparent border-b border-black/20 px-0 py-2 text-[#1a1a1a] placeholder:text-[#1a1a1a]/30 focus:outline-none focus:border-[#1a1a1a] text-sm transition-colors"
                />
              </div>
            ))}
          </div>

          <button
            onClick={handleGeneratePlan}
            disabled={!allAnswered}
            className="w-full bg-[#1a1a1a] text-[#f8f7f4] font-semibold py-4 text-[11px] uppercase tracking-widest hover:bg-black transition-colors disabled:opacity-50 flex items-center justify-center gap-2 mt-4"
          >
            Construct Strategy
          </button>
        </div>
      )}

      {step === 'building' && (
        <div className="py-24 flex flex-col items-center justify-center space-y-6 text-center border-t border-black/10 mt-8">
          <Loader2 className="w-8 h-8 animate-spin text-[#c2410c]" />
          <p className="text-[10px] uppercase tracking-widest text-[#1a1a1a] font-semibold animate-pulse">Architecting Systems...</p>
          <p className="text-[#4a4a4a] text-xs italic font-serif">Structuring narrative permanence</p>
        </div>
      )}

      {step === 'done' && (
        <div className="py-24 flex flex-col items-center justify-center space-y-6 text-center border-t border-black/10 mt-8">
          <CheckCircle2 className="w-12 h-12 text-[#1a1a1a]" />
          <p className="text-[10px] uppercase tracking-widest text-[#1a1a1a] font-semibold">Blueprint Finalized</p>
        </div>
      )}
    </div>
  );
}
