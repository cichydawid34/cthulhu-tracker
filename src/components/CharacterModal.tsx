import * as React from "react"
import { Character } from "../types"
import { Modal } from "./ui/Modal"
import { Input } from "./ui/Input"
import { Label } from "./ui/Label"
import { Button } from "./ui/Button"

interface CharacterModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (char: Character) => void
  initialData?: Character | null
}

export function CharacterModal({ isOpen, onClose, onSave, initialData }: CharacterModalProps) {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const generateId = () => {
      try { return crypto.randomUUID() } 
      catch (e) { return Math.random().toString(36).substring(2, 15) }
    }
    const char: Character = {
      id: initialData?.id || generateId(),
      user_id: formData.get("user_id") as string,
      playerName: formData.get("playerName") as string,
      characterName: formData.get("characterName") as string,
      avatarUrl: formData.get("avatarUrl") as string,
      height: formData.get("height") as string,
      gender: formData.get("gender") as string,
      dickOrCupSize: formData.get("dickOrCupSize") as string,
      profession: formData.get("profession") as string,
      nationality: formData.get("nationality") as string,
      appearance: formData.get("appearance") as string,
      background: formData.get("background") as string,

      strength: formData.get("strength") as string,
      dexterity: formData.get("dexterity") as string,
      size: formData.get("size") as string,
      intelligence: formData.get("intelligence") as string,
      constitution: formData.get("constitution") as string,
      power: formData.get("power") as string,
      charisma: formData.get("charisma") as string,

      hitPoints: formData.get("hitPoints") as string,
      sanity: formData.get("sanity") as string,
      luck: formData.get("luck") as string,

      skill1: formData.get("skill1") as string,
      skill2: formData.get("skill2") as string,
      skill3: formData.get("skill3") as string,

      trait1: formData.get("trait1") as string,
      trait2: formData.get("trait2") as string,
      trait3: formData.get("trait3") as string,
    }
    onSave(char)
    onClose()
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={initialData ? "Edytuj Postać" : "Dodaj Nową Postać (Badacza)"}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1"><Label>Imię Gracza</Label><Input name="playerName" defaultValue={initialData?.playerName} required /></div>
          <div className="space-y-1"><Label>Imię Postaci</Label><Input name="characterName" defaultValue={initialData?.characterName} required /></div>
          <div className="space-y-1 col-span-2">
            <Label>Zdjęcie Postaci (Z dysku)</Label>
            <Input type="file" accept="image/*" onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                const reader = new FileReader();
                reader.onloadend = () => {
                  const form = e.target.closest('form');
                  if (form) {
                    const hiddenInput = form.querySelector('input[name="avatarUrl"]') as HTMLInputElement;
                    if (hiddenInput) hiddenInput.value = reader.result as string;
                  }
                };
                reader.readAsDataURL(file);
              }
            }} />
            <input type="hidden" name="avatarUrl" defaultValue={initialData?.avatarUrl} />
          </div>

          <div className="space-y-1"><Label>Płeć</Label><Input name="gender" defaultValue={initialData?.gender} /></div>
          <div className="space-y-1"><Label>Wzrost</Label><Input name="height" defaultValue={initialData?.height} /></div>
          <div className="space-y-1"><Label>Zawód</Label><Input name="profession" defaultValue={initialData?.profession} /></div>
          <div className="space-y-1"><Label>Narodowość</Label><Input name="nationality" defaultValue={initialData?.nationality} /></div>

          <div className="space-y-1"><Label>Pochodzenie / Przeszłość</Label><Input name="background" defaultValue={initialData?.background} /></div>
          <div className="space-y-1"><Label>Wygląd / Aparycja</Label><Input name="appearance" defaultValue={initialData?.appearance} /></div>

          <div className="space-y-1 col-span-2"><Label className="text-primary">Długość siura / Miseczka (Cecha specjalna)</Label><Input name="dickOrCupSize" defaultValue={initialData?.dickOrCupSize} placeholder="Np. 20cm / Miseczka D" /></div>
        </div>

        <div className="border-t pt-4 grid grid-cols-4 gap-2">
          <div className="space-y-1"><Label className="text-xs">Siła (STR)</Label><Input name="strength" defaultValue={initialData?.strength} type="number" /></div>
          <div className="space-y-1"><Label className="text-xs">Budowa (SIZ)</Label><Input name="size" defaultValue={initialData?.size} type="number" /></div>
          <div className="space-y-1"><Label className="text-xs">Zręcz. (DEX)</Label><Input name="dexterity" defaultValue={initialData?.dexterity} type="number" /></div>
          <div className="space-y-1"><Label className="text-xs">Kond. (CON)</Label><Input name="constitution" defaultValue={initialData?.constitution} type="number" /></div>
          
          <div className="space-y-1"><Label className="text-xs">Charyzma (CHA)</Label><Input name="charisma" defaultValue={initialData?.charisma} type="number" /></div>
          <div className="space-y-1"><Label className="text-xs">Moc (POW)</Label><Input name="power" defaultValue={initialData?.power} type="number" /></div>
          <div className="space-y-1"><Label className="text-xs">Umysł (INT)</Label><Input name="intelligence" defaultValue={initialData?.intelligence} type="number" /></div>
        </div>

        <div className="grid grid-cols-3 gap-2">
          <div className="space-y-1"><Label>Zdrowie</Label><Input name="hitPoints" defaultValue={initialData?.hitPoints} type="number" /></div>
          <div className="space-y-1"><Label>Szaleństwo</Label><Input name="sanity" defaultValue={initialData?.sanity} type="number" /></div>
          <div className="space-y-1"><Label>Szczęście</Label><Input name="luck" defaultValue={initialData?.luck} type="number" /></div>
        </div>

        <div className="border-t pt-4 grid grid-cols-3 gap-2">
          <div className="space-y-1"><Label className="text-xs">Cechy 1</Label><Input name="trait1" defaultValue={initialData?.trait1} placeholder="Np. Odważny" /></div>
          <div className="space-y-1"><Label className="text-xs">Cechy 2</Label><Input name="trait2" defaultValue={initialData?.trait2} placeholder="Np. Blizna na twarzy" /></div>
          <div className="space-y-1"><Label className="text-xs">Cechy 3</Label><Input name="trait3" defaultValue={initialData?.trait3} placeholder="Np. Mrukliwy" /></div>
        </div>

        <div className="pt-2 grid grid-cols-3 gap-2">
          <div className="space-y-1"><Label className="text-xs">Skill 1</Label><Input name="skill1" defaultValue={initialData?.skill1} placeholder="Np. Broń Palna 60%" /></div>
          <div className="space-y-1"><Label className="text-xs">Skill 2</Label><Input name="skill2" defaultValue={initialData?.skill2} placeholder="Np. Unik 50%" /></div>
          <div className="space-y-1"><Label className="text-xs">Skill 3</Label><Input name="skill3" defaultValue={initialData?.skill3} placeholder="Np. Perswazja 70%" /></div>
        </div>

        <div className="border-t-4 border-red-800/10 pt-4 mt-6">
          <div className="space-y-1">
            <Label className="text-red-900 font-bold uppercase tracking-widest text-xs">Ustawienia Sieciowe Mistrza Gry (Dostęp Gracza)</Label>
            <p className="text-[10px] opacity-70 mb-2">Jeśli wpiszesz w to pole unikalne User ID należące do konkretnego konta Gracza, uzyska on wyłączny podgląd tej karty z poziomu swojego własnego telefonu. Zostaw puste, jeśli tylko Ty (Admin) masz to widzieć.</p>
            <Input name="user_id" defaultValue={initialData?.user_id} placeholder="Wklej UUID gracza wyciągnięte z bazy danych" className="border-red-900/30 bg-red-900/5 focus:border-red-900" />
          </div>
        </div>

        <div className="pt-4 flex justify-end gap-2">
          <Button type="button" onClick={onClose} className="bg-transparent border text-foreground hover:bg-muted">Anuluj</Button>
          <Button type="submit">{initialData ? "Zapisz Zmiany" : "Dodaj Kartę"}</Button>
        </div>
      </form>
    </Modal>
  )
}
