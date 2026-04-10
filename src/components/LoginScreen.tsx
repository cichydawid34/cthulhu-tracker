import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { Skull } from 'lucide-react';

export function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isRegistering, setIsRegistering] = useState(false);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formattedNick = email.trim().toLowerCase().replace(/[^a-z0-9]/g, '');
    if (formattedNick.length < 3) {
      setError("Nick musi mieć przynajmniej 3 litery/cyfry.");
      setLoading(false);
      return;
    }
    
    // We append a fake domain since Supabase requires email format for Auth
    const fakeEmail = `${formattedNick}@arkham.local`;

    try {
      if (isRegistering) {
        const { error } = await supabase.auth.signUp({ email: fakeEmail, password });
        if (error) throw error;
        alert("Zarejestrowano pomyślnie. Możesz się teraz zalogować.");
        setIsRegistering(false);
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email: fakeEmail, password });
        if (error) throw error;
      }
    } catch (err: any) {
      setError(err.message || 'Dostęp odrzucony (złe hasło lub brak konta).');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#dfd3c3] text-[#2c241b] font-sans flex items-center justify-center p-4">
      <div className="fixed inset-0 pointer-events-none opacity-[0.03] z-0 bg-[url('data:image/svg+xml,%3Csvg width=\'100\' height=\'100\' viewBox=\'0 0 100 100\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.8\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100\' height=\'100\' filter=\'url(%23noise)\'/%3E%3C/svg%3E')]"></div>
      
      <div className="bg-[#ebdabd] border-[4px] border-[#2c241b] p-8 md:p-12 shadow-[0_20px_50px_rgba(0,0,0,0.5)] max-w-sm w-full relative z-10 flex flex-col gap-6">
        
        {/* Red Stamp effect */}
        <div className="absolute top-2 right-2 rotate-12 bg-red-800/10 p-1 border-2 border-red-800/40 text-red-800/40 special-font text-xl font-bold uppercase tracking-wide pointer-events-none z-0">
            RESTRICTED
        </div>

        <div className="text-center border-b-2 border-[#2c241b]/30 pb-6 mb-4 relative z-10">
          <Skull className="w-16 h-16 mx-auto mb-4 text-[#2c241b]" />
          <h1 className="special-font text-4xl font-bold tracking-widest uppercase leading-none">Miskatonic</h1>
          <h2 className="special-font text-2xl tracking-widest uppercase">Database</h2>
          <p className="font-bold text-[10px] uppercase tracking-widest opacity-70 mt-3 border-t border-b border-[#2c241b] inline-block px-3 py-1">Authorization Required</p>
        </div>

        {error && (
            <div className="bg-red-800/10 border-2 border-red-800 border-dashed text-red-800 p-3 text-sm font-bold text-center special-font">
                [ERROR] {error}
            </div>
        )}

        <form onSubmit={handleAuth} className="flex flex-col gap-5 relative z-10">
          <div>
            <label className="block special-font uppercase font-bold text-sm mb-1 opacity-80">Pseudonim (Twój Nick)</label>
            <input 
              type="text" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-[#dfd3c3]/50 border-2 border-[#2c241b] p-3 special-font font-bold focus:outline-none focus:border-red-800 focus:bg-[#dfd3c3] transition-colors"
              required 
            />
          </div>
          <div>
            <label className="block special-font uppercase font-bold text-sm mb-1 opacity-80">Passcode</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-[#dfd3c3]/50 border-2 border-[#2c241b] p-3 special-font font-bold focus:outline-none focus:border-red-800 focus:bg-[#dfd3c3] transition-colors"
              required 
            />
          </div>
          
          <button 
            type="submit" 
            disabled={loading}
            className="mt-4 bg-[#2c241b] text-[#ebdabd] p-4 special-font text-xl font-bold uppercase tracking-widest hover:bg-red-900 transition-colors disabled:opacity-50 shadow-[4px_4px_0_rgba(0,0,0,0.2)] active:shadow-none active:translate-y-1 active:translate-x-1"
          >
            {loading ? "Weryfikacja..." : (isRegistering ? "Zarejestruj Się" : "Odblokuj")}
          </button>
        </form>

        <button 
            type="button"
            onClick={() => setIsRegistering(!isRegistering)}
            className="text-xs font-bold uppercase tracking-widest opacity-60 hover:opacity-100 hover:text-red-800 mt-2 relative z-10"
        >
            {isRegistering ? "[ Wróć do Logowania ]" : "[ Nowy Badacz? Rejestracja ]"}
        </button>
      </div>
    </div>
  );
}
