import { Character } from "../types"
import { Card } from "./ui/Card"
import { User, Pencil, Trash, Brain, Heart, Dices, Eye } from "lucide-react"

export function CharacterCard({ character, onEdit, onDelete, isAdmin = true }: { character: Character, onEdit: (char: Character) => void, onDelete: (id: string) => void, isAdmin?: boolean }) {
  // Generate a random case number based on character ID to keep it consistent per character
  const hash = character.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const caseNo = `1924-${1000 + (hash % 8999)}`;

  return (
    <Card className="flex flex-col relative overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-black/20 text-[#2c241b] border-2 border-[#2c241b] rounded-sm p-1 group bg-[#e8decd]">
      {/* Inner border to look like a printed document */}
      <div className="flex flex-col flex-1 border border-[#2c241b] p-5 relative shadow-[inset_0_0_40px_rgba(0,0,0,0.05)] bg-[#f3ecd9]">

        {/* Vintage Stamp */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -rotate-[15deg] opacity-20 pointer-events-none select-none z-0 mix-blend-multiply">
          <span className="special-font text-5xl text-red-800/80 border-4 border-red-800/80 p-2 rounded-sm uppercase tracking-widest whitespace-nowrap">
            CONFIDENTIAL
          </span>
        </div>

        {/* Action Buttons */}
        {isAdmin && (
        <div className="absolute right-2 top-2 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity flex gap-1 z-30">
          <button
            onClick={() => window.open(`/?charId=${character.id}`, '_blank')}
            className="text-[#2c241b] hover:text-blue-800 transition-colors hover:bg-black/5 rounded-full p-1.5 border border-transparent hover:border-[#2c241b]"
            title="Otwórz pełne akta w nowej karcie"
          >
            <Eye className="w-4 h-4" />
          </button>
          <button
            onClick={() => onEdit(character)}
            className="text-[#2c241b] hover:text-primary transition-colors hover:bg-black/5 rounded-full p-1.5 border border-transparent hover:border-[#2c241b]"
            title="Edytuj akta"
          >
            <Pencil className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(character.id)}
            className="text-[#2c241b] hover:text-red-800 transition-colors hover:bg-black/5 rounded-full p-1.5 border border-transparent hover:border-[#2c241b]"
            title="Zamknij sprawę (Usuń)"
          >
            <Trash className="w-4 h-4" />
          </button>
        </div>
        )}

        {/* DOSSIER HEADER */}
        <div className="border-b-2 border-[#2c241b] pb-3 mb-5 text-center relative z-10 flex flex-col items-center">
          <h2 className="special-font text-2xl uppercase tracking-[0.15em] font-bold mb-2">
            Investigator
          </h2>
          <div className="text-xs font-bold tracking-widest border-t border-b border-[#2c241b] py-1 inline-block px-4">
            ARKHAM SANITARIUM {caseNo}
          </div>
        </div>

        {/* Profile Section */}
        <div className="flex gap-5 mb-5 relative z-10">
          <div className="w-28 h-36 border-2 border-[#2c241b] bg-black/5 flex-shrink-0 flex flex-col items-center justify-center relative overflow-hidden filter sepia-[0.4] contrast-125 opacity-90 p-1">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=\'100\' height=\'100\' viewBox=\'0 0 100 100\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.8\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100\' height=\'100\' filter=\'url(%23noise)\' opacity=\'0.2\'/%3E%3C/svg%3E')] mix-blend-multiply pointer-events-none z-10"></div>
            {character.avatarUrl ? (
              <img src={character.avatarUrl} alt={character.characterName} className="h-full w-full object-cover grayscale" />
            ) : (
              <User className="h-12 w-12 text-[#2c241b]/40" />
            )}
          </div>

          <div className="flex flex-col flex-1 text-sm justify-between">
            <div>
              <div className="uppercase text-[10px] font-bold tracking-widest mb-1 opacity-70">Imię Postaci:</div>
              <h3 className="special-font text-xl uppercase font-bold leading-none mb-3 border-b border-[#2c241b]/50 pb-1">
                {character.characterName || "UNKNOWN SUBJECT"}
              </h3>
            </div>

            <div className="grid grid-cols-1 gap-1.5 leading-snug">
              <div className="flex justify-between border-b border-black/10 border-dotted"><span className="uppercase font-bold text-xs opacity-80">Imię Gracza:</span> <span className="font-medium">{character.playerName || "None"}</span></div>
              <div className="flex justify-between border-b border-black/10 border-dotted"><span className="uppercase font-bold text-xs opacity-80">Zawód:</span> <span className="font-medium">{character.profession || "Unemployed"}</span></div>
              <div className="flex justify-between border-b border-black/10 border-dotted"><span className="uppercase font-bold text-xs opacity-80">Narodowość:</span> <span className="font-medium">{character.nationality || "Unknown"}</span></div>
              <div className="flex justify-between border-b border-black/10 border-dotted"><span className="uppercase font-bold text-xs opacity-80">Płeć / Wzrost:</span> <span className="font-medium">{character.gender?.[0]?.toUpperCase() || "-"} / {character.height || "-"}</span></div>
              <div className="flex justify-between border-b border-black/10 border-dotted"><span className="uppercase font-bold text-xs opacity-80">Siur / Cyce:</span> <span className="font-medium">{character.dickOrCupSize || "N/A"}</span></div>
            </div>
          </div>
        </div>

        {/* Primary Attributes */}
        <div className="mb-4 relative z-10">
          <h4 className="special-font uppercase font-bold text-sm border-b-2 border-[#2c241b] mb-2 px-1 flex justify-between items-end">
            <span>1. Cechy Podstawowe</span>
            <span className="text-[9px] opacity-60 font-medium normal-case tracking-normal">(Half / Fifth value calc)</span>
          </h4>
          <div className="grid grid-cols-4 gap-x-4 gap-y-3 text-sm px-1">
            <StatRowBox label="STR" value={character.strength} />
            <StatRowBox label="CON" value={character.constitution} />
            <StatRowBox label="SIZ" value={character.size} />
            <StatRowBox label="DEX" value={character.dexterity} />
            <StatRowBox label="INT" value={character.intelligence} />
            <StatRowBox label="POW" value={character.power} />
            <StatRowBox label="CHA" value={character.charisma} />
          </div>
        </div>

        {/* Vitals */}
        <div className="flex justify-between gap-4 mb-5 relative z-10 border-t-2 border-b-2 border-[#2c241b] py-3 bg-black/5 px-4 shadow-[inset_0_0_10px_rgba(0,0,0,0.05)]">
          <div className="flex flex-col items-center flex-1 text-blue-900 group">
            <span className="text-[10px] uppercase font-bold tracking-widest mb-1 opacity-80 flex items-center gap-1 group-hover:scale-110 transition-transform origin-bottom"><Brain className="w-3 h-3" /> Sanity</span>
            <span className="special-font text-2xl font-bold">{character.sanity}</span>
          </div>
          <div className="w-px bg-[#2c241b]/30"></div>
          <div className="flex flex-col items-center flex-1 text-red-900 group">
            <span className="text-[10px] uppercase font-bold tracking-widest mb-1 opacity-80 flex items-center gap-1 group-hover:scale-110 transition-transform origin-bottom"><Heart className="w-3 h-3" /> Health</span>
            <span className="special-font text-2xl font-bold">{character.hitPoints}</span>
          </div>
          <div className="w-px bg-[#2c241b]/30"></div>
          <div className="flex flex-col items-center flex-1 text-emerald-900 group">
            <span className="text-[10px] uppercase font-bold tracking-widest mb-1 opacity-80 flex items-center gap-1 group-hover:scale-110 transition-transform origin-bottom"><Dices className="w-3 h-3" /> Luck</span>
            <span className="special-font text-2xl font-bold">{character.luck}</span>
          </div>
        </div>

        {/* Skills & Traits */}
        <div className="mt-auto relative z-10">
          <h4 className="special-font uppercase font-bold text-sm border-b-2 border-[#2c241b] mb-2 px-1">2. Cechy i Umiejętności</h4>

          <div className="px-1 text-sm leading-relaxed">
            {character.background && (
              <div className="mb-2 flex items-start gap-2">
                <span className="text-[10px] font-bold uppercase opacity-80 mt-1 flex-shrink-0 w-16">Poch:</span>
                <span className="border-b border-[#2c241b]/30 border-dotted flex-1 pb-1">
                  {character.background}
                </span>
              </div>
            )}

            {character.appearance && (
              <div className="mb-2 flex items-start gap-2">
                <span className="text-[10px] font-bold uppercase opacity-80 mt-1 flex-shrink-0 w-16">Wygląd:</span>
                <span className="border-b border-[#2c241b]/30 border-dotted flex-1 pb-1">
                  {character.appearance}
                </span>
              </div>
            )}

            {(character.trait1 || character.trait2 || character.trait3) && (
              <div className="mb-2 flex items-start gap-2">
                <span className="text-xs font-bold uppercase opacity-80 mt-1 flex-shrink-0 w-16">Cechy:</span>
                <span className="border-b border-[#2c241b]/30 border-dotted flex-1 pb-1">
                  {[character.trait1, character.trait2, character.trait3].filter(Boolean).join(", ")}
                </span>
              </div>
            )}

            <div className="flex items-start gap-2">
              <span className="text-xs font-bold uppercase opacity-80 mt-1 flex-shrink-0 w-16">Um:</span>
              <span className="border-b border-[#2c241b]/30 border-dotted flex-1 pb-1">
                {[character.skill1, character.skill2, character.skill3].filter(Boolean).join(", ")}
              </span>
            </div>
          </div>
        </div>

      </div>
    </Card>
  )
}

function StatRowBox({ label, value }: { label: string, value: string }) {
  const numValue = parseInt(value || "0");
  const showFractions = !isNaN(numValue) && numValue > 0;

  return (
    <div className="flex items-end border-b border-[#2c241b]/40 border-dotted group justify-between">
      <span className="text-[11px] font-bold opacity-80">{label}</span>
      <div className="flex items-baseline gap-1.5">
        <span className="special-font text-xl leading-none">{value || "00"}</span>
        <div className="flex flex-col text-[8px] font-bold opacity-60 leading-none -mb-[1px] items-center">
          <span>{showFractions ? Math.floor(numValue / 2) : "00"}</span>
          <span className="border-t border-[#2c241b]/40 pt-[1px] mt-[1px] w-full text-center">{showFractions ? Math.floor(numValue / 5) : "00"}</span>
        </div>
      </div>
    </div>
  )
}
