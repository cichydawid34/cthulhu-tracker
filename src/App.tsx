import { useState, useEffect } from "react"
import { Character } from "./types"
import { CharacterCard } from "./components/CharacterCard"
import { CharacterModal } from "./components/CharacterModal"
import { ReferenceTab } from "./components/ReferenceTab"
import { DiceRollerTab } from "./components/DiceRollerTab"
import { FullCharacterSheet } from "./components/FullCharacterSheet"
import { Plus, Skull, FileText, Dices, Download, LogOut } from "lucide-react"
import { supabase } from "./lib/supabase"
import { LoginScreen } from "./components/LoginScreen"

function App() {
  const urlParams = new URLSearchParams(window.location.search);
  const sheetCharId = urlParams.get('charId');

  const [session, setSession] = useState<any>(null);
  const [role, setRole] = useState<'admin' | 'player'>('player');

  const [activeTab, setActiveTab] = useState<'tracker' | 'reference' | 'dice'>('tracker')
  const [characters, setCharacters] = useState<Character[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingChar, setEditingChar] = useState<Character | null>(null)
  const [isLoading, setIsLoading] = useState(true);

  // Authenticate
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      fetchRole(session?.user?.id);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      fetchRole(session?.user?.id);
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchRole = async (userId: string | undefined) => {
    if (!userId) {
      setRole('player');
      setIsLoading(false);
      return;
    }
    const { data } = await supabase.from('profiles').select('role').eq('id', userId).single();
    if (data) {
      setRole(data.role as 'admin' | 'player');
    }
    setIsLoading(false);
  }

  // Fetch Characters
  useEffect(() => {
    if (session) {
      fetchCharacters();
      
      // Setup Realtime
      const charSubscription = supabase
        .channel('custom-all-channel')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'characters' }, () => {
          fetchCharacters();
        })
        .subscribe();
        
      return () => {
        supabase.removeChannel(charSubscription);
      }
    }
  }, [session]);

  const fetchCharacters = async () => {
    const { data, error } = await supabase
      .from('characters')
      .select('*')
      .order('created_at', { ascending: false });
      
    if (error) {
      console.error("Error fetching characters", error);
    } else if (data) {
      setCharacters(data as Character[]);
    }
  }

  const handleSaveCharacter = async (char: Character) => {
      // Don't send empty user_id string to Postgres UUID column, leave as null
      const processedChar = { ...char, user_id: char.user_id || null };
      const { error } = await supabase.from('characters').upsert([processedChar]);
      if (error) {
          alert("Błąd zapisu: " + error.message);
      } else {
          fetchCharacters();
      }
      setIsModalOpen(false);
  }

  const handleDeleteCharacter = async (id: string) => {
    if (window.confirm("Na pewno chcesz usunąć tę kartę badacza z Bazy? Operacja nieodwracalna.")) {
      await supabase.from('characters').delete().eq('id', id);
      fetchCharacters();
    }
  }

  const handleEditCharacter = (char: Character) => {
    setEditingChar(char);
    setIsModalOpen(true);
  }

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setTimeout(() => setEditingChar(null), 150);
  }

  const handleExportTXT = () => {
    if (characters.length === 0) {
      alert("Brak badaczy do eksportu!");
      return;
    }

    let content = "=== CTHULHU SESSION TRACKER BACKUP ===\n";
    content += `Data: ${new Date().toLocaleDateString()}\n\n`;

    characters.forEach(c => {
      content += `[BADACZ]: ${c.characterName || "NN"} (Gracz: ${c.playerName || "NN"})\n`;
      content += `[ZAWÓD]: ${c.profession || "Brak"}\n`;
      content += `[STAN]: HP: ${c.hitPoints || "0"} | Sanity: ${c.sanity || "0"} | Luck: ${c.luck || "0"}\n`;
      content += `[STATYSTYKI]: STR: ${c.strength} CON: ${c.constitution} SIZ: ${c.size} DEX: ${c.dexterity} INT: ${c.intelligence} POW: ${c.power} CHA: ${c.charisma}\n`;
      content += `--------------------------------------------------\n\n`;
    });
    
    // Append Raw JSON for potential future imports
    content += "=== RAW SYSTEM DATA ===\n";
    content += JSON.stringify(characters, null, 2);

    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Akta_Cthulhu_Cloud_${new Date().toISOString().split('T')[0]}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (sheetCharId) {
    if (!session && !isLoading) {
       return <LoginScreen />;
    }
    return <FullCharacterSheet charId={sheetCharId} />
  }

  if (isLoading) return <div className="min-h-screen bg-[#dfd3c3] flex items-center justify-center p-4"><span className="special-font font-bold text-3xl animate-pulse">Łączenie z Bazą Danych...</span></div>;

  if (!session) {
    return <LoginScreen />;
  }

  return (
    <div className="min-h-screen bg-background text-foreground p-6 md:p-12 font-sans selection:bg-primary/30">
      <header className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between mb-8 gap-4">
        <div className="flex items-center gap-3 relative w-full md:w-auto">
          <div className="bg-primary/10 p-3 rounded-xl border border-primary/20 relative z-10 hidden sm:block">
            <Skull className="w-8 h-8 text-primary" />
          </div>
          <div className="flex-1">
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Cthulhu Session Tracker</h1>
            <p className="text-muted-foreground flex flex-wrap items-center gap-2">
                Zalogowano jako: {role === 'admin' ? "Mistrz Gry" : "Gracz"} 
                <span className="text-[10px] uppercase bg-green-900 border border-green-800 text-[#dfd3c3] px-2 py-0.5 font-bold shadow-sm rounded-sm">CLOUD {session.user.id.slice(0, 8)}...</span>
            </p>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-2 w-full md:w-auto justify-end">
            <button
                onClick={() => supabase.auth.signOut()}
                className="inline-flex items-center justify-center rounded-md text-sm font-bold transition-colors bg-black/5 text-[#2c241b] shadow hover:bg-black/10 h-10 px-4 gap-2 border border-[#2c241b]/20"
                title="Wyloguj Się"
            >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Wyloguj ({session.user?.email?.replace('@arkham.local', '')})</span>
            </button>

            {activeTab === 'tracker' && role === 'admin' && (
            <div className="flex gap-2">
                <button
                onClick={handleExportTXT}
                className="inline-flex items-center justify-center rounded-md text-sm font-bold transition-colors bg-[#ebdabd] text-[#2c241b] shadow hover:bg-white h-10 px-4 gap-2 border-2 border-[#2c241b]"
                title="Zapisz akta na dysku jako plik TXT"
                >
                <Download className="w-4 h-4" />
                <span className="hidden sm:inline">Backup</span>
                </button>
                <button
                onClick={() => { setEditingChar(null); setIsModalOpen(true); }}
                className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors bg-[#2c241b] text-[#f3ecd9] shadow hover:bg-black/80 h-10 px-6 gap-2 border border-[#2c241b]"
                >
                <Plus className="w-4 h-4" />
                <span className="hidden sm:inline">Nowy Gracz</span>
                </button>
            </div>
            )}
        </div>
      </header>

      <div className="max-w-7xl mx-auto mb-8 flex gap-2 border-b-2 border-[#2c241b] pb-0 overflow-x-auto">
        <button
          onClick={() => setActiveTab('tracker')}
          className={`uppercase font-bold tracking-widest special-font text-sm md:text-lg px-4 md:px-6 py-2 transition-colors border-t-2 border-l-2 border-r-2 whitespace-nowrap ${activeTab === 'tracker' ? 'border-[#2c241b] bg-[#e8decd] text-[#2c241b]' : 'border-transparent text-[#2c241b]/60 hover:bg-black/5 hover:text-[#2c241b]'}`}
        >
          <div className="flex items-center gap-2"><Skull className="w-4 h-4" /> Akta Badaczy</div>
        </button>
        {role === 'admin' && (
        <button
          onClick={() => setActiveTab('reference')}
          className={`uppercase font-bold tracking-widest special-font text-sm md:text-lg px-4 md:px-6 py-2 transition-colors border-t-2 border-l-2 border-r-2 whitespace-nowrap ${activeTab === 'reference' ? 'border-[#2c241b] bg-[#e8decd] text-[#2c241b]' : 'border-transparent text-[#2c241b]/60 hover:bg-black/5 hover:text-[#2c241b]'}`}
        >
          <div className="flex items-center gap-2"><FileText className="w-4 h-4" /> Tabele Losowe</div>
        </button>
        )}
        <button
          onClick={() => setActiveTab('dice')}
          className={`uppercase font-bold tracking-widest special-font text-sm md:text-lg px-4 md:px-6 py-2 transition-colors border-t-2 border-l-2 border-r-2 whitespace-nowrap ${activeTab === 'dice' ? 'border-[#2c241b] bg-[#e8decd] text-[#2c241b]' : 'border-transparent text-[#2c241b]/60 hover:bg-black/5 hover:text-[#2c241b]'}`}
        >
          <div className="flex items-center gap-2"><Dices className="w-4 h-4" /> Kości</div>
        </button>
      </div>

      <main className="max-w-7xl mx-auto">
        {activeTab === 'tracker' ? (
          characters.length === 0 ? (
            <div className="text-center py-24 border-2 border-dashed border-[#2c241b]/30 rounded-sm bg-black/5">
              <Skull className="w-12 h-12 text-[#2c241b]/50 mx-auto mb-4" />
              <h2 className="special-font text-2xl font-semibold mb-2 text-[#2c241b]">Brak Dostępnych Akt</h2>
              <p className="text-[#2c241b]/70 max-w-sm mx-auto font-medium">
                Archiwum jest puste lub Mistrz Gry nie przydzielił ci jeszcze dostępu do postaci. Poproś Mistrza Gry o podpięcie Twojego ID.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
              {characters.map((char) => (
                <CharacterCard key={char.id} character={char} onEdit={handleEditCharacter} onDelete={handleDeleteCharacter} isAdmin={role === 'admin'} />
              ))}
            </div>
          )
        ) : activeTab === 'reference' ? (
          <ReferenceTab />
        ) : (
          <DiceRollerTab />
        )}
      </main>

      {isModalOpen && role === 'admin' && (
        <CharacterModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onSave={handleSaveCharacter}
          initialData={editingChar}
        />
      )}
    </div>
  )
}

export default App
