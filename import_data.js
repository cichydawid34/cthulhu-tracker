import fs from 'fs';
import { createClient } from '@supabase/supabase-js';

const envFile = fs.readFileSync('.env', 'utf8');
const envVars = {};
envFile.split('\n').forEach(line => {
  const parts = line.split('=');
  if (parts.length >= 2) {
    const key = parts[0].trim();
    envVars[key] = parts.slice(1).join('=').trim();
  }
});

// Initialize Supabase
const supabaseUrl = envVars['VITE_SUPABASE_URL'];
const supabaseKey = envVars['VITE_SUPABASE_ANON_KEY'];

if (!supabaseUrl || !supabaseKey) {
  console.error("BRAK ZMIENNYCH SUPABASE W .env!");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function importData() {
  try {
    const rawText = fs.readFileSync('backup.txt', 'utf8');
    
    // Szukamy sekcji z danymi JSON
    const marker = '=== RAW SYSTEM DATA';
    const markerIndex = rawText.indexOf(marker);
    if (markerIndex === -1) {
      console.error("Nie znaleziono sekcji RAW SYSTEM DATA w pliku backup.txt!");
      return;
    }

    const jsonStart = rawText.indexOf('\n[', markerIndex);
    if (jsonStart === -1) {
      console.error("Nie znaleziono tablicy JSON w pliku!");
      return;
    }

    const jsonString = rawText.slice(jsonStart).trim();
    const characters = JSON.parse(jsonString);

    console.log(`Znaleziono ${characters.length} badaczy w backupie. Czas na wgrańsko w chmury...`);

    for (const char of characters) {
      // Usunięcie kolizji user_id jeśli w starym backupie nie było lub było dziwne
      if (!char.user_id) char.user_id = null;
      
      const { error } = await supabase.from('characters').upsert([char]);
      
      if (error) {
        console.error(`Błąd wgrywania ${char.characterName}:`, error.message);
      } else {
        console.log(`✅ Zgrano pomyślnie: ${char.characterName} (${char.playerName})`);
      }
    }
    
    console.log("==========================================");
    console.log("Wszystko zgrane! Zesłanie Architektów udane.");
  } catch (err) {
    console.error("Krytyczny błąd skryptu:", err);
  }
}

importData();
