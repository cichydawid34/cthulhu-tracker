import { useState } from "react";
import { Dices } from "lucide-react";

export function DiceRollerTab({ userName = "Badacz" }: { userName?: string }) {
  const [isRolling, setIsRolling] = useState(false);
  const [currentDice, setCurrentDice] = useState<number | null>(null);
  const [displayNumber, setDisplayNumber] = useState<number | string>("?");
  const [history, setHistory] = useState<{ dice: number, result: number, time: string, crit: string, userName: string }[]>([]);
  const [animationState, setAnimationState] = useState<'idle' | 'rolling' | 'impact' | 'crit'>('idle');
  const [criticalState, setCriticalState] = useState<'none' | 'success' | 'failure'>('none');

  const diceOptions = [4, 6, 8, 10, 12, 20, 100];

  const rollDice = (sides: number) => {
    if (isRolling) return;

    setIsRolling(true);
    setCurrentDice(sides);
    setAnimationState('rolling');
    setCriticalState('none');

    // Rapidly cycle the number to simulate rolling intensity
    const interval = setInterval(() => {
      setDisplayNumber(Math.floor(Math.random() * sides) + 1);
    }, 50);

    // After 1.5 seconds, lock it in with a cinematic BG3 "impact" shake/glow
    setTimeout(() => {
      clearInterval(interval);
      const finalResult = Math.floor(Math.random() * sides) + 1;
      setDisplayNumber(finalResult);

      let crit: 'none' | 'success' | 'failure' = 'none';
      if (sides === 100) {
        if (finalResult === 1) crit = 'success';
        if (finalResult === 100 || finalResult === 99) crit = 'failure';
      } else if (sides === 20) {
        if (finalResult === 20) crit = 'success';
        if (finalResult === 1) crit = 'failure';
      } else {
        if (finalResult === sides) crit = 'success';
        if (finalResult === 1) crit = 'failure';
      }

      setCriticalState(crit);
      setAnimationState(crit !== 'none' ? 'crit' : 'impact');

      setHistory(prev => [{
        dice: sides,
        result: finalResult,
        time: new Date().toLocaleTimeString(),
        crit,
        userName
      }, ...prev].slice(0, 10)); // Keep history of last 10 rolls

      setIsRolling(false);

      // Return to idle visual state after impact effect finishes
      setTimeout(() => setAnimationState('idle'), 600);
    }, 1500);
  };

  return (
    <div className="flex flex-col items-center max-w-4xl mx-auto p-4 animate-in fade-in duration-500">
      <div className="text-center border-b-2 border-[#2c241b] pb-4 mb-16 w-full">
        <h2 className="special-font text-3xl uppercase tracking-widest font-bold mb-2">Pulpit Rzutów</h2>
        <p className="text-sm font-bold tracking-widest border-t border-b border-[#2c241b] py-1 inline-block px-4">
          SYMULATOR SZCZĘŚCIA MISTRZA GRY
        </p>
      </div>

      {/* Main Cinematic Dice Area */}
      <div className="relative w-64 h-64 flex items-center justify-center mb-16">
        {currentDice ? (
          <div
            className={`
              w-56 h-56 rounded-full flex items-center justify-center border-4 relative
              transition-colors duration-150
              ${animationState === 'rolling'
                ? 'animate-dice-shake border-[#2c241b] bg-[#e8decd] shadow-[inset_0_0_40px_rgba(0,0,0,0.1)] text-[#2c241b]'
                : ''}
              ${animationState === 'impact'
                ? 'animate-dice-impact border-red-800 bg-[#e8decd] text-red-800'
                : ''}
              ${animationState === 'crit' && criticalState === 'success'
                ? 'animate-dice-crit-success border-yellow-500 bg-[#e8decd] text-yellow-600 shadow-[inset_0_0_40px_rgba(234,179,8,0.2)]'
                : ''}
              ${animationState === 'crit' && criticalState === 'failure'
                ? 'animate-dice-crit-fail border-red-950 bg-black/90 text-red-600'
                : ''}
              ${animationState === 'idle'
                ? (criticalState === 'success' ? 'border-yellow-500 bg-[#e8decd] text-yellow-600 shadow-[0_0_20px_rgba(234,179,8,0.3)] scale-105' :
                  criticalState === 'failure' ? 'border-red-950 bg-black/90 text-red-600 shadow-[0_0_20px_rgba(153,27,27,0.5)] scale-95' :
                    'border-[#2c241b] bg-[#e8decd] text-[#2c241b]')
                : ''}
            `}
            style={(animationState === 'rolling') ? {
              maskImage: 'radial-gradient(circle, white, black)',
              WebkitMaskImage: 'radial-gradient(circle, white, black)'
            } : {}}
          >
            <div className={`absolute top-4 font-bold opacity-40 uppercase tracking-widest ${animationState === 'rolling' ? 'animate-pulse' : ''}`}>
              D{currentDice}
            </div>

            {criticalState === 'success' && animationState !== 'rolling' && (
              <div className="absolute top-10 font-bold text-yellow-500 uppercase tracking-widest animate-in zoom-in duration-300">ALE BYDLE!</div>
            )}
            {criticalState === 'failure' && animationState !== 'rolling' && (
              <div className="absolute top-10 font-bold text-red-600 uppercase tracking-widest animate-in zoom-in duration-300">ALE CWEL!</div>
            )}

            <span className={`special-font font-bold select-none text-8xl
              ${animationState === 'impact' ? 'drop-shadow-[0_0_15px_rgba(220,38,38,0.5)]' : ''}
              ${(animationState === 'crit' || animationState === 'idle') && criticalState === 'success' ? 'drop-shadow-[0_0_25px_rgba(234,179,8,0.8)]' : ''}
              ${(animationState === 'crit' || animationState === 'idle') && criticalState === 'failure' ? 'drop-shadow-[0_0_25px_rgba(153,27,27,0.8)]' : ''}
            `}>
              {displayNumber}
            </span>
          </div>
        ) : (
          <div className="w-56 h-56 rounded-full flex items-center justify-center border-4 border-[#2c241b]/20 border-dashed text-[#2c241b]/30">
            <Dices size={80} strokeWidth={1} />
          </div>
        )}
      </div>

      {/* Selection Panel */}
      <div className="flex flex-wrap justify-center gap-4 w-full mb-12">
        {diceOptions.map(dice => (
          <button
            key={dice}
            onClick={() => rollDice(dice)}
            disabled={isRolling}
            className={`
              w-24 h-24 rounded-lg flex flex-col items-center justify-center gap-1 transition-all border-2 border-[#2c241b]
              ${isRolling
                ? 'opacity-30 cursor-not-allowed bg-transparent'
                : 'hover:bg-[#2c241b] hover:text-[#f3ecd9] bg-[#e8decd] hover:-translate-y-2 hover:shadow-[0_10px_20px_rgba(0,0,0,0.2)]'}
            `}
          >
            <span className="text-[10px] uppercase font-bold tracking-widest opacity-80 mt-1">Rzuć</span>
            <span className="special-font text-3xl font-bold">D{dice}</span>
          </button>
        ))}
      </div>

      {/* Roll History */}
      <div className="w-full max-w-lg border-2 border-[#2c241b]/40 bg-[#f3ecd9] shadow-[inset_0_0_10px_rgba(0,0,0,0.05)] p-5 relative">
        <h3 className="text-xs uppercase font-bold tracking-widest border-b-2 border-[#2c241b] pb-2 mb-3">Historia Sesji (Ostatnie 10)</h3>
        <div className="flex flex-col gap-1 max-h-48 overflow-y-auto pr-2 scrollbar-thin">
          {history.length === 0 ? (
            <p className="text-sm italic opacity-60 text-center py-4">Słychać tylko bicie twojego serca...</p>
          ) : (
            history.map((record, i) => (
              <div key={i} className={`flex justify-between items-center text-sm border-b border-[#2c241b]/10 py-2 ${i === 0 ? 'font-bold bg-black/5 px-2 -mx-2' : ''} ${record.crit === 'success' ? 'text-yellow-700' : record.crit === 'failure' ? 'text-red-700' : ''}`}>
                <span className="opacity-60 text-xs w-20">{record.time}</span>
                <span className="flex-1 text-center font-bold tracking-wider">{record.userName} rzucił kością <strong className={`special-font ${record.crit !== 'none' ? 'opacity-100' : 'text-red-900/80'}`}>K{record.dice}</strong></span>
                <span className="font-bold special-font text-xl w-16 text-right">
                  {record.crit === 'success' && '★ '}
                  {record.crit === 'failure' && '☠ '}
                  {record.result}
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
