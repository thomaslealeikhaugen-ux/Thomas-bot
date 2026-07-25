import { setInterval } from 'timers';
// We importeren hier je supabase instellingen uit de utils map
import { supabase } from './utils/supabase.js';


const TARGET_GUILD_ID = '1509144230621351966';
const TARGET_USER_ID = '1472237148324233361';

console.log('[KeepAlive] Database Keep-Alive script succesvol ingeladen!');

// Deze timer start direct op de achtergrond en heeft de rest van de bot niet nodig
setInterval(async () => {
    try {
        console.log('[KeepAlive] Start automatische database-activiteit...');

        if (!supabase) {
            console.log('[KeepAlive] ❌ Kan supabase client niet vinden. Controleer of het bestand in src/utils/supabase.js staat.');
            return;
        }

        // 1. Zoek heel voorzichtig of je al in de tabel staat
        const { data, error } = await supabase
            .from('user_levels')
            .select('*')
            .eq('guild_id', TARGET_GUILD_ID)
            .eq('user_id', TARGET_USER_ID);

        if (error) {
            console.error('[KeepAlive] ❌ Database waarschuwing bij zoeken:', error.message);
            return; 
        }

        let currentXp = 0;
        let currentLevel = 1;
        const dataExists = data && data.length > 0;

        if (dataExists) {
            const row = data[0]; // We pakken de eerste rij uit de database
            currentXp = row.xp !== undefined ? row.xp : 0;
            currentLevel = row.level !== undefined ? row.level : 1;
        }

        // 2. Voeg elke 60 minuten 5 XP toe
        currentXp += 5;
        let xpNeeded = currentLevel * 100;

        if (currentXp >= xpNeeded) {
            currentLevel += 1;
            currentXp = currentXp - xpNeeded;
            console.log(`[KeepAlive] 🎉 Level up! Nieuw level: ${currentLevel}`);
        }

        // 3. Gegevens veilig opslaan of updaten
        if (dataExists) {
            const { error: updateError } = await supabase
                .from('user_levels')
                .update({ xp: currentXp, level: currentLevel })
                .eq('guild_id', TARGET_GUILD_ID)
                .eq('user_id', TARGET_USER_ID);
            
            if (updateError) console.error('[KeepAlive] Update mislukt:', updateError.message);
        } else {
            const { error: insertError } = await supabase
                .from('user_levels')
                .insert({
                    guild_id: TARGET_GUILD_ID,
                    user_id: TARGET_USER_ID,
                    xp: currentXp,
                    level: currentLevel
                });
            
            if (insertError) console.error('[KeepAlive] Insert mislukt:', insertError.message);
        }

        console.log(`[KeepAlive] ✅ Database succesvol aangeroepen! Level: ${currentLevel}, XP: ${currentXp}`);

    } catch (err) {
        console.error('[KeepAlive] Onverwachte fout, database is NIET aangetast:', err);
    }
}, 60 * 60 * 1000); // Slaapt telkens exact 60 minuten
