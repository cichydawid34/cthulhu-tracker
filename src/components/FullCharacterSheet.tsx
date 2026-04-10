import { useEffect, useState } from "react";
import { Character } from "../types";
import { Brain, Heart, Dices } from "lucide-react";
import { supabase } from "../lib/supabase";

export function FullCharacterSheet({ charId }: { charId: string }) {
  const [character, setCharacter] = useState<Character | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchChar = async () => {
      setIsLoading(true);
      const { data, error } = await supabase.from("characters").select("*").eq("id", charId).single();
      
      if (error) {
        console.error("Failed to fetch character from Supabase", error);
      } else if (data) {
        setCharacter(data as Character);
      }
      setIsLoading(false);
    };

    fetchChar();
  }, [charId]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#dfd3c3] flex items-center justify-center p-4">
        <span className="special-font font-bold text-3xl animate-pulse text-[#2c241b]">Przeszukiwanie akt...</span>
      </div>
    );
  }

  if (!character) {
    return (
      <div className="min-h-screen bg-[#dfd3c3] flex items-center justify-center p-4">
        <h1 className="text-3xl special-font font-bold uppercase tracking-widest text-[#2c241b]">Zapis nie odnaleziony</h1>
      </div>
    );
  }

  const hash = character.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const caseNo = `1924-${1000 + (hash % 8999)}`;

  return (
    <div className="min-h-screen bg-[#dfd3c3] text-[#2c241b] p-2 md:p-4 font-sans flex items-center justify-center selection:bg-red-800/30 overflow-x-hidden">
      {/* Background grit */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.03] z-0 bg-[url('data:image/svg+xml,%3Csvg width=\'100\' height=\'100\' viewBox=\'0 0 100 100\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.8\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100\' height=\'100\' filter=\'url(%23noise)\'/%3E%3C/svg%3E')]"></div>

      {/* Main Dossier Container */}
      <div className="w-full max-w-5xl bg-[#ebdabd] border-2 border-[#2c241b] p-4 md:p-6 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.5)] relative z-10 flex flex-col gap-4 shadow-black/40 transform relative before:absolute before:inset-0 before:shadow-[inset_0_0_100px_rgba(40,30,20,0.1)] before:pointer-events-none">
        
        {/* Huge Stamps */}
        <div className="absolute top-4 right-4 lg:right-10 rotate-[12deg] opacity-70 pointer-events-none select-none z-0 mix-blend-multiply flex flex-col items-end">
          <span className="special-font text-3xl md:text-5xl text-red-800/80 border-[4px] border-red-800/80 p-2 rounded-sm uppercase tracking-widest whitespace-nowrap inline-block animate-dice-impact shadow-sm">
            CONFIDENTIAL
          </span>
          <span className="special-font text-xs text-red-800/60 font-bold mt-1 rotate-[-5deg]">DEPARTMENT OF PSYCHOLOGICAL REVIEW</span>
        </div>

        {/* Paperclips */}
        <div className="absolute top-[-15px] left-10 w-8 h-20 border-[4px] border-gray-400 rounded-full opacity-80 z-30 pointer-events-none shadow-[4px_4px_4px_rgba(0,0,0,0.2)] bg-transparent"></div>
        <div className="absolute top-[-12px] left-14 w-6 h-16 border-[4px] border-gray-400 rounded-full opacity-80 z-30 pointer-events-none shadow-[2px_2px_4px_rgba(0,0,0,0.2)] z-[-1] bg-transparent"></div>

        {/* Header */}
        <div className="border-b-[3px] border-[#2c241b] pb-2 flex flex-col items-start relative z-10 w-full lg:w-2/3">
          <h2 className="special-font text-2xl md:text-3xl uppercase tracking-[0.1em] font-bold mb-1 pt-4 md:pt-0">
            ARKHAM ASYLUM CASE FILE
          </h2>
          <div className="text-sm font-bold tracking-widest border-t-2 border-b-2 border-[#2c241b] py-1 inline-block px-4 mb-1 bg-[#dfd3c3]">
            NO. {caseNo}
          </div>
          <p className="font-bold uppercase tracking-widest opacity-80 text-xs">SUBJECT: {character.characterName}</p>
        </div>

        {/* Top Section: Avatar + Bio + Vitals */}
        <div className="flex flex-col lg:flex-row gap-6 relative z-10">
          
          {/* Avatar Area */}
          <div className="flex flex-col gap-2 items-center">
            <div className="w-36 h-48 border-[3px] border-[#2c241b] bg-black/10 flex-shrink-0 flex flex-col items-center justify-center relative overflow-hidden filter sepia-[0.3] contrast-125 p-1 bg-white rotate-[-3deg] shadow-md hover:rotate-0 transition-transform duration-500">
              {character.avatarUrl ? (
                <img src={character.avatarUrl} alt={character.characterName} className="h-full w-full object-cover grayscale" />
              ) : (
                <div className="text-center opacity-40">
                  <span className="special-font text-lg font-bold">NO PHOTO</span>
                </div>
              )}
            </div>
            <div className="text-center font-bold text-lg special-font rotate-[-3deg]">
              {character.characterName}
            </div>
          </div>

          {/* Core Biodata & Vitals */}
          <div className="flex-1 flex flex-col lg:flex-row gap-6">
            <div className="flex-1">
              <h3 className="special-font text-sm uppercase bg-[#2c241b] text-[#ebdabd] px-2 py-0.5 inline-block shadow-sm mb-2 font-bold">1. Investigator Info</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1 text-sm">
                <DossierLine label="Imię Gracza" value={character.playerName} />
                <DossierLine label="Zawód" value={character.profession} />
                <DossierLine label="Narodowość" value={character.nationality} />
                <DossierLine label="Płeć" value={character.gender} />
                <DossierLine label="Wzrost" value={character.height} />
                <DossierLine label="Typ Bud." value={character.dickOrCupSize} />
              </div>
            </div>

            <div className="flex-1">
              <h3 className="special-font text-sm uppercase bg-[#2c241b] text-[#ebdabd] px-2 py-0.5 inline-block shadow-sm mb-2 font-bold">2. Vital Statistics</h3>
              <div className="flex justify-between gap-2 py-3 px-2 sm:px-4 border-[3px] border-double border-[#2c241b]/50 bg-black/5 shadow-[inset_0_0_10px_rgba(0,0,0,0.05)] h-24 items-center">
                 <VitalBig label="Sanity" icon={<Brain className="w-5 h-5" />} value={character.sanity} color="text-blue-900" />
                 <div className="w-px h-16 bg-[#2c241b]/20"></div>
                 <VitalBig label="Health" icon={<Heart className="w-5 h-5" />} value={character.hitPoints} color="text-red-900" />
                 <div className="w-px h-16 bg-[#2c241b]/20"></div>
                 <VitalBig label="Luck" icon={<Dices className="w-5 h-5" />} value={character.luck} color="text-emerald-900" />
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="relative z-10">
          <h3 className="special-font text-sm uppercase bg-[#2c241b] text-[#ebdabd] px-2 py-0.5 inline-flex shadow-sm mb-2 font-bold w-full justify-between items-end">
            <span>3. Primary Attributes</span>
            <span className="text-[10px] font-bold font-sans opacity-70 ml-4 hidden sm:block leading-none pb-0.5">(EVALUATION MATRIX)</span>
          </h3>
          <div className="grid grid-cols-4 md:grid-cols-7 gap-2">
            <StatDossierBox label="STR" value={character.strength} />
            <StatDossierBox label="CON" value={character.constitution} />
            <StatDossierBox label="SIZ" value={character.size} />
            <StatDossierBox label="DEX" value={character.dexterity} />
            <StatDossierBox label="INT" value={character.intelligence} />
            <StatDossierBox label="POW" value={character.power} />
            <StatDossierBox label="CHA" value={character.charisma} />
          </div>
        </div>

        {/* Background & Traits */}
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <h3 className="special-font text-sm uppercase bg-[#2c241b] text-[#ebdabd] px-2 py-0.5 inline-block shadow-sm mb-2 font-bold">4. Psychological Profile</h3>
            <div className="space-y-2">
              <div>
                <span className="block text-[10px] font-bold uppercase tracking-widest opacity-70 mb-0.5">Background / Trauma:</span>
                <p className="text-sm special-font font-bold leading-tight border-b border-[#2c241b]/40 pb-1 min-h-6 border-dashed text-black/80 truncate">
                  {character.background || "Brak zarejestrowanych incydentów."}
                </p>
              </div>
              <div>
                <span className="block text-[10px] font-bold uppercase tracking-widest opacity-70 mb-0.5">Physical Appearance:</span>
                <p className="text-sm special-font font-bold leading-tight border-b border-[#2c241b]/40 pb-1 min-h-6 border-dashed text-black/80 truncate">
                  {character.appearance || "Wygląd standardowy. Bez ubytków."}
                </p>
              </div>
              <div>
                <span className="block text-[10px] font-bold uppercase tracking-widest opacity-70 mb-0.5">Behavioral Traits:</span>
                <ul className="list-disc pl-4 space-y-0.5">
                  {character.trait1 && <li><span className="special-font text-sm font-bold">{character.trait1}</span></li>}
                  {character.trait2 && <li><span className="special-font text-sm font-bold">{character.trait2}</span></li>}
                  {character.trait3 && <li><span className="special-font text-sm font-bold">{character.trait3}</span></li>}
                  {!character.trait1 && !character.trait2 && !character.trait3 && <li className="italic opacity-60 text-xs text-black/80 mt-1">Status: Stable.</li>}
                </ul>
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="special-font text-sm uppercase bg-[#2c241b] text-[#ebdabd] px-2 py-0.5 inline-block shadow-sm mb-2 font-bold">5. Registered Skills</h3>
            <div className="flex flex-col gap-1">
                <SkillLine name={character.skill1} />
                <SkillLine name={character.skill2} />
                <SkillLine name={character.skill3} />
                <SkillLine name="" />
            </div>
            
            <div className="mt-4 p-2 border-2 border-red-800/80 rotate-[2deg] bg-[#e8decd] shadow-sm">
              <span className="block text-xs font-bold uppercase tracking-widest text-red-800 mb-1 special-font text-center bg-white/50 border border-red-800/20">DOCTOR'S NOTES</span>
              <div className="h-10 border-b border-black/20 border-dotted flex flex-col justify-between">
                 <div className="w-full border-b border-black/40 border-dashed mt-2"></div>
                 <div className="w-full border-b border-black/40 border-dashed mb-1"></div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

function DossierLine({ label, value }: { label: string, value?: string }) {
  return (
    <div className="flex border-b border-[#2c241b]/20 border-dotted items-end pb-0.5 gap-2">
      <span className="uppercase font-bold text-[10px] opacity-70 whitespace-nowrap">{label}:</span>
      <span className="special-font text-sm font-bold leading-none translate-y-[1px] truncate">{value || "UNKNOWN"}</span>
    </div>
  )
}

function VitalBig({ label, value, icon, color }: { label: string, value: string, icon: React.ReactNode, color: string }) {
  return (
    <div className={`flex flex-col items-center gap-1 ${color} group flex-1`}>
      <span className="uppercase font-bold tracking-widest text-[10px] flex items-center gap-1">
        {icon} <span className="hidden sm:inline">{label}</span>
      </span>
      <span className="special-font text-4xl font-bold filter group-hover:drop-shadow-lg transition-all">{value || "00"}</span>
    </div>
  )
}

function StatDossierBox({ label, value }: { label: string, value: string }) {
  const numValue = parseInt(value || "0");
  const showFractions = !isNaN(numValue) && numValue > 0;

  return (
    <div className="border-[3px] border-[#2c241b] p-1 sm:p-2 flex flex-col justify-between bg-[#dfd3c3] relative hover:bg-white transition-colors shadow-sm">
      <span className="font-bold uppercase text-[9px] sm:text-[10px] tracking-widest opacity-80 mb-2 block border-b-2 border-[#2c241b]/30 pb-0.5 text-center">{label}</span>
      <div className="flex items-end justify-center mt-auto">
        <span className="special-font text-3xl font-bold leading-none">{numValue || "00"}</span>
        <div className="flex flex-col border-l border-[#2c241b]/40 pl-1 sm:pl-2 ml-1 sm:ml-2 justify-center">
            <span className="special-font text-sm font-bold leading-none text-center">{showFractions ? Math.floor(numValue / 2) : "00"}</span>
            <div className="h-px bg-[#2c241b]/20 my-0.5 w-full"></div>
            <span className="special-font text-[10px] font-bold leading-none opacity-80 text-center">{showFractions ? Math.floor(numValue / 5) : "00"}</span>
        </div>
      </div>
    </div>
  )
}

function SkillLine({ name }: { name?: string }) {
  return (
    <div className="flex justify-between items-end border-b border-[#2c241b]/30 pb-0.5 border-dotted min-h-[24px]">
       <span className="special-font font-bold text-sm translate-y-[1px]">{name || ""}</span>
       <span className="opacity-40 special-font text-sm">{name ? "[     ]" : ""}</span>
    </div>
  )
}
