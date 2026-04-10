import { professions, quirksAndDiseases, backgrounds, appearances } from "../data/generators"

export function ReferenceTab() {
  return (
    <div className="bg-[#f3ecd9] border border-[#2c241b] p-6 md:p-8 rounded-sm shadow-[inset_0_0_40px_rgba(0,0,0,0.05)] text-[#2c241b]">
      <div className="text-center border-b-2 border-[#2c241b] pb-4 mb-8">
        <h2 className="special-font text-3xl uppercase tracking-widest font-bold mb-2">Tabele Losowe Badaczy</h2>
        <p className="text-sm font-bold tracking-widest border-t border-b border-[#2c241b] py-1 inline-block px-4">
          MATERIAŁY POMOCNICZE DLA TWOJEJ STAREJ
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Kolumna 1: Zawody i Przeszłość */}
        <div className="col-span-1 lg:border-r border-[#2c241b]/20 lg:pr-8 flex flex-col gap-12">
          {/* Professions Table */}
          <div>
            <h3 className="special-font text-xl uppercase font-bold border-b-2 border-[#2c241b] mb-4">Zawody w wyciąganiu chuja z wody( ~1920)</h3>
            <p className="text-[10px] uppercase opacity-80 mb-4 font-bold">Rzuć K200 (lub połącz rzuty by odzwierciedlić 200)</p>
            <div className="max-h-[400px] overflow-y-auto border border-[#2c241b]/30 p-2 pr-4 scrollbar-thin bg-black/5">
              <table className="w-full text-sm">
                <tbody>
                  {professions.map((prof, index) => (
                    <tr key={index} className="border-b border-[#2c241b]/20 border-dotted hover:bg-black/10 transition-colors">
                      <td className="w-12 py-1.5 font-bold opacity-70 border-r border-[#2c241b]/20 pr-2">
                        {String(index + 1).padStart(3, '0')}
                      </td>
                      <td className="py-1.5 pl-3 font-medium">{prof}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Backgrounds Table */}
          <div>
            <h3 className="special-font text-xl uppercase font-bold border-b-2 border-indigo-900/50 mb-4 text-indigo-900 border-dotted">Pochodzenie / Przeszłość</h3>
            <p className="text-[10px] uppercase opacity-80 mb-4 font-bold text-indigo-900/80">Rzuć K100 (Środowisko startowe detektywa)</p>
            <div className="max-h-[400px] overflow-y-auto border border-indigo-900/20 p-2 pr-4 scrollbar-thin bg-indigo-900/5">
              <table className="w-full text-sm">
                <tbody>
                  {backgrounds.map((bg, index) => (
                    <tr key={index} className="border-b border-indigo-900/10 border-dotted hover:bg-indigo-900/10 transition-colors">
                      <td className="w-12 py-1.5 font-bold opacity-70 border-r border-indigo-900/20 pr-2 text-indigo-900">
                        [{String(index + 1).padStart(2, '0')}]
                      </td>
                      <td className="py-1.5 pl-3 font-medium text-indigo-900">{bg}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Kolumna 2: Quirks, Choroby i Wygląd */}
        <div className="col-span-1 flex flex-col gap-12">
          {/* Quirks Table */}
          <div>
            <h3 className="special-font text-xl uppercase font-bold border-b-2 border-red-900/50 mb-4 text-red-900 border-dotted">Nawyki, Sekrety i Choroby</h3>
            <p className="text-[10px] uppercase opacity-80 mb-4 font-bold text-red-900/80">Rzuć K200 (Wady, fobie i fizyczne ciężary)</p>
            <div className="max-h-[400px] overflow-y-auto border border-red-900/20 p-2 pr-4 scrollbar-thin bg-red-900/5">
              <table className="w-full text-sm">
                <tbody>
                  {quirksAndDiseases.map((quirk, index) => (
                    <tr key={index} className="border-b border-red-900/10 border-dotted hover:bg-red-900/10 transition-colors">
                      <td className="w-12 py-1.5 font-bold opacity-70 border-r border-red-900/20 pr-2 text-red-900">[{String(index + 1).padStart(3, '0')}]</td>
                      <td className="py-1.5 pl-3 font-medium text-red-900">{quirk}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Appearance Table */}
          <div>
            <h3 className="special-font text-xl uppercase font-bold border-b-2 border-green-900/50 mb-4 text-green-900 border-dotted">Cechy Wyglądu i Aparycja</h3>
            <p className="text-[10px] uppercase opacity-80 mb-4 font-bold text-green-900/80">Rzuć K50 (Wizualny znak szczególny)</p>
            <div className="max-h-[400px] overflow-y-auto border border-green-900/20 p-2 pr-4 scrollbar-thin bg-green-900/5">
              <table className="w-full text-sm">
                <tbody>
                  {appearances.map((app, index) => (
                    <tr key={index} className="border-b border-green-900/10 border-dotted hover:bg-green-900/10 transition-colors">
                      <td className="w-12 py-1.5 font-bold opacity-70 border-r border-green-900/20 pr-2 text-green-900">[{String(index + 1).padStart(2, '0')}]</td>
                      <td className="py-1.5 pl-3 font-medium text-green-900">{app}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
