import { useNavigate } from 'react-router-dom';
import { Target, ArrowRight, Zap, Trophy, Medal, Lock } from 'lucide-react';
import { useIntentStore } from '../store/useIntentStore';
import { useGamificationStore } from '../store/useGamificationStore';

export default function Dashboard() {
  const navigate = useNavigate();
  const { intent, plan, rewards, selectedReward, selectReward } = useIntentStore();
  const { xp, level, streak, momentum, completedQuests, completeQuest, incrementStreak } = useGamificationStore();

  if (!intent || !plan) {
    return (
      <div className="h-full flex flex-col items-center justify-center space-y-6 pt-20 p-6">
        <div className="w-20 h-20 bg-[#e5e7eb] border border-black/5 flex items-center justify-center">
          <Target className="w-8 h-8 text-[#1a1a1a]" />
        </div>
        
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-serif italic text-[#1a1a1a]">
            No Archive
          </h2>
          <p className="text-[#4a4a4a] text-sm">
            You haven't set a goal yet. Let's create an activation journey.
          </p>
        </div>

        <button 
          onClick={() => navigate('/create-intent')}
          className="group flex items-center gap-3 bg-[#1a1a1a] text-[#f8f7f4] px-6 py-3 text-[11px] uppercase tracking-widest font-semibold transition-all hover:bg-black"
        >
          <span>Craft New Intent</span>
          <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    );
  }

  // Handle Reward Selection if not yet selected
  if (rewards && rewards.rewards && !selectedReward) {
    return (
      <div className="space-y-6 pt-4 p-6">
        <h2 className="text-4xl font-serif italic text-[#1a1a1a] leading-tight">
          Lock in your <br /><span className="pl-12 text-[#c2410c]">Reward.</span>
        </h2>
        <p className="text-[#4a4a4a] text-sm leading-relaxed max-w-sm">
          Select one final reward to unlock after your journey. Choose what will drive you most.
        </p>

        <div className="space-y-4">
          {rewards.rewards.map((reward: any) => (
            <button
              key={reward.id}
              onClick={() => selectReward(reward)}
              className="w-full text-left p-6 bg-[#e5e7eb] border border-black/5 hover:border-black/20 transition-colors group relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-tr from-[#d1d5db] to-[#f3f4f6] opacity-50 pointer-events-none"></div>
              <div className="relative z-10">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="font-serif text-xl text-[#1a1a1a] group-hover:text-[#c2410c] transition-colors leading-tight">
                    {reward.title}
                  </h3>
                  <span className="text-[9px] uppercase font-bold tracking-widest text-[#1a1a1a]/60 border border-black/10 px-2 py-1">
                    {reward.category}
                  </span>
                </div>
                <p className="text-sm text-[#4a4a4a] leading-relaxed mb-4">{reward.description}</p>
                <div className="flex flex-col gap-1">
                  <p className="text-[11px] text-[#4a4a4a] tracking-wide"><strong className="text-[#1a1a1a] font-semibold">Strategy:</strong> {reward.whyItWorks}</p>
                  <p className="text-[11px] text-[#4a4a4a] tracking-wide"><strong className="text-[#1a1a1a] font-semibold">Friction:</strong> {reward.estimatedCost}</p>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    );
  }

  // Find the current active day (first incomplete day)
  const allDays = plan.days || [];
  const currentDayIndex = allDays.findIndex((d: any) => !completedQuests.includes(d.mainQuest?.id));
  const currentDay = currentDayIndex !== -1 ? allDays[currentDayIndex] : null;
  const isComplete = currentDayIndex === -1;

  const handleCompleteDailyQuest = (id: string, amount: number) => {
    completeQuest(id, amount);
    incrementStreak();
  };

  return (
    <div className="space-y-12 animate-in fade-in duration-500 pb-10 p-6">
      
      {/* Gamification Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-[#e5e7eb] border border-black/5 p-4 flex flex-col items-center justify-center text-center">
          <Trophy className="text-[#1a1a1a]/40 mb-2" size={20} />
          <span className="text-xl font-serif text-[#1a1a1a]">{level}</span>
          <span className="text-[9px] text-[#1a1a1a]/60 uppercase tracking-widest mt-1">Level</span>
        </div>
        <div className="bg-[#e5e7eb] border border-black/5 p-4 flex flex-col items-center justify-center text-center">
          <Zap className="text-[#1a1a1a]/40 mb-2" size={20} />
          <span className="text-xl font-serif text-[#1a1a1a]">{xp}</span>
          <span className="text-[9px] text-[#1a1a1a]/60 uppercase tracking-widest mt-1">Total XP</span>
        </div>
        <div className="bg-[#e5e7eb] border border-black/5 p-4 flex flex-col items-center justify-center text-center">
          <Medal className="text-[#1a1a1a]/40 mb-2" size={20} />
          <span className="text-xl font-serif text-[#1a1a1a]">{streak}</span>
          <span className="text-[9px] text-[#1a1a1a]/60 uppercase tracking-widest mt-1">Streak</span>
        </div>
      </div>

      {/* Target Intent */}
      <div className="space-y-4">
        <span className="block text-[9px] uppercase tracking-widest opacity-40 mb-2 border-b border-black/10 pb-2">Active Thesis</span>
        <h2 className="text-3xl font-serif italic text-[#1a1a1a] leading-[1.1]">
          "{intent}"
        </h2>
      </div>

      {/* Reward Vault Preview */}
      {selectedReward && (
        <div className="relative p-6 bg-[#1a1a1a] text-[#f8f7f4] border border-black/5 flex flex-col items-start overflow-hidden group">
          <Lock className="absolute opacity-[0.05] w-64 h-64 text-white -right-10 -bottom-10" />
          <span className="text-[9px] uppercase tracking-widest opacity-60 mb-4 relative z-10">Secured Relic</span>
          <h3 className="text-2xl font-serif italic relative z-10 mb-2">{selectedReward.title}</h3>
          <p className="text-[11px] opacity-80 tracking-wide relative z-10 uppercase">Unlocks upon validation</p>
        </div>
      )}

      {/* Journey */}
      <div>
        <div className="flex items-end justify-between mb-6 border-b border-black/10 pb-2">
          <h3 className="text-[9px] uppercase tracking-widest opacity-40">Tactical Strategy</h3>
          <span className="text-[10px] font-medium text-[#1a1a1a] uppercase tracking-widest">
            {plan.planTitle}
          </span>
        </div>

        {isComplete ? (
          <div className="p-8 bg-[#e5e7eb] border border-black/5 flex flex-col items-center text-center space-y-4">
            <Trophy className="text-[#c2410c] w-10 h-10" />
            <h3 className="text-2xl font-serif italic text-[#1a1a1a]">Archive Sealed</h3>
            <p className="text-[#4a4a4a] text-sm">You've unlocked your reward.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {allDays.map((day: any, idx: number) => {
              const isPast = completedQuests.includes(day.mainQuest?.id);
              const isActive = idx === currentDayIndex;
              const isFuture = idx > currentDayIndex;

              return (
                <div 
                  key={day.day} 
                  className={`p-6 border transition-all duration-300 ${
                    isActive ? 'bg-[#f8f7f4] border-[#1a1a1a] shadow-[4px_4px_0px_0px_rgba(26,26,26,1)]' : 
                    isPast ? 'bg-[#e5e7eb] border-black/10 opacity-70' : 
                    'bg-[#f8f7f4] border-black/10 opacity-40'
                  }`}
                >
                  <div className="flex justify-between items-center mb-4">
                    <h4 className={`font-serif italic text-xl ${isActive ? 'text-[#c2410c]' : 'text-[#1a1a1a]'}`}>
                      Vol {day.day}
                    </h4>
                    {isPast && <span className="text-[9px] uppercase tracking-widest border border-black/20 px-2 py-1">Verified</span>}
                  </div>
                  
                  <h3 className={`text-sm font-semibold uppercase tracking-wider mb-2 ${isActive ? 'text-[#1a1a1a]' : 'text-[#4a4a4a]'}`}>{day.title}</h3>
                  <p className="text-[#4a4a4a] text-sm mb-6 leading-relaxed bg-[#e5e7eb] p-3 border border-black/5">{day.mainQuest?.action}</p>
                  
                  {isActive && (
                    <button 
                      onClick={() => handleCompleteDailyQuest(day.mainQuest?.id, day.mainQuest?.xp)}
                      className="w-full bg-[#1a1a1a] text-[#f8f7f4] font-semibold py-3 text-[11px] uppercase tracking-widest hover:bg-black active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                    >
                      <Zap size={14} /> Execute (+{day.mainQuest?.xp} XP)
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

