import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Activity, Key, Loader2, Target } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import { apiFetch } from '../lib/apiClient';

export default function AuthScreen() {
  const [keyInput, setKeyInput] = useState('');
  const [remember, setRemember] = useState(false);
  const [status, setStatus] = useState<'idle'|'testing'|'success'|'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const navigate = useNavigate();
  const setAuthKey = useAuthStore(s => s.setApiKey);

  const handleTestKey = async () => {
    if (!keyInput.trim()) {
      setErrorMsg('Please enter an API key');
      return;
    }
    
    setStatus('testing');
    setErrorMsg('');
    
    try {
      await apiFetch('/gemini/test-key', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${keyInput}` }
      });
      setStatus('success');
      
      // Store API Key securely as per settings
      setAuthKey(keyInput, remember);
      setTimeout(() => navigate('/dashboard'), 800);
      
    } catch (err: any) {
      console.error(err);
      setStatus('error');
      setErrorMsg(err.message || 'Failed to validate API key. Please check your key constraints.');
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f7f4] flex flex-col items-center justify-center p-6 text-[#1a1a1a] relative overflow-hidden font-sans">
      {/* Background decoration */}
      <div className="absolute -left-10 top-1/2 -translate-y-1/2 text-[400px] font-serif italic opacity-[0.03] select-none pointer-events-none">
        I
      </div>

      <div className="w-full max-w-sm z-10 space-y-8">
        <div className="text-center space-y-3">
          <div className="mx-auto w-16 h-16 bg-[#e5e7eb] flex items-center justify-center mb-6 border border-black/5">
            <Target className="text-[#1a1a1a] w-8 h-8" />
          </div>
          <h1 className="text-5xl font-serif italic tracking-tight text-[#1a1a1a]">
            Intentifier
          </h1>
          <p className="text-[#4a4a4a] text-sm leading-relaxed">
            Convert weak intent into a clear, gamified activation journey.
          </p>
        </div>

        <div className="bg-[#e5e7eb] relative border border-black/5 overflow-hidden p-6">
          <div className="absolute inset-0 bg-gradient-to-tr from-[#d1d5db] to-[#f3f4f6] opacity-50 pointer-events-none"></div>
          <div className="space-y-6 relative z-10">
            <div className="space-y-2">
              <label className="text-[10px] font-semibold text-[#1a1a1a] uppercase tracking-widest flex items-center gap-2">
                <Key size={12} /> Gemini API Key
              </label>
              <input
                type="password"
                placeholder="AIzaSy..."
                value={keyInput}
                onChange={(e) => setKeyInput(e.target.value)}
                className="w-full bg-[#f8f7f4] border border-black/10 px-4 py-3 text-[#1a1a1a] placeholder:text-black/30 focus:outline-none focus:border-black/30 transition-all font-mono text-sm"
              />
              <p className="text-[10px] text-[#4a4a4a]">
                Your key runs locally and is passed via proxy route. 
                <br />If left blank, server defaults (if any) are not exposed here.
              </p>
            </div>

            <label className="flex items-center gap-3 py-2 cursor-pointer group">
              <div className="relative flex items-center justify-center h-4 w-4">
                <input 
                  type="checkbox" 
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                  className="peer appearance-none w-4 h-4 border border-black/20 bg-[#f8f7f4] checked:bg-[#1a1a1a] checked:border-[#1a1a1a] transition-colors"
                />
                <Activity size={10} className="absolute text-[#f8f7f4] pointer-events-none opacity-0 peer-checked:opacity-100 transition-opacity" />
              </div>
              <span className="text-xs text-[#4a4a4a] group-hover:text-[#1a1a1a] transition-colors select-none font-medium">
                Remember locally in browser
              </span>
            </label>

            {status === 'error' && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-600 text-[11px] uppercase tracking-widest font-semibold">
                {errorMsg}
              </div>
            )}
            {status === 'success' && (
              <div className="p-3 bg-green-50 border border-green-200 text-green-700 text-[11px] uppercase tracking-widest font-semibold text-center">
                Success! Routing strictly...
              </div>
            )}

            <button
              onClick={handleTestKey}
              disabled={status === 'testing' || status === 'success'}
              className="w-full bg-[#1a1a1a] text-[#f8f7f4] font-semibold py-3 text-[11px] uppercase tracking-widest hover:bg-black active:scale-[0.98] transition-all disabled:opacity-50 disabled:active:scale-100 flex items-center justify-center gap-2"
            >
              {status === 'testing' ? (
                <><Loader2 size={16} className="animate-spin" /> Verifying...</>
              ) : (
                'Start Journey'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
