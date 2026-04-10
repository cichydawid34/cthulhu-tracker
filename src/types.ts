export interface Character {
  id: string;
  user_id?: string;
  playerName: string;
  characterName: string;
  avatarUrl: string;
  height: string;
  gender: string;
  dickOrCupSize: string;
  profession: string;
  nationality: string;
  appearance?: string;
  background?: string;
  
  strength: string;
  dexterity: string;
  size: string;
  intelligence: string;
  constitution: string;
  power: string;
  charisma: string;
  
  hitPoints: string;
  sanity: string;
  luck: string;

  skill1: string;
  skill2: string;
  skill3: string;

  trait1?: string;
  trait2?: string;
  trait3?: string;
}
