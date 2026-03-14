const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://azvliucxtijkdoyedaxk.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF6dmxpdWN4dGlqa2RveWVkYXhrIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MzQwMzU2NiwiZXhwIjoyMDg4OTc5NTY2fQ.3LqHYpbk0FTqznWqOVflERnZre9q4ZPKRZ4_bgB7sgA';
const supabase = createClient(supabaseUrl, supabaseKey);

async function seedBusyPlatform() {
  console.log("Creating Mauritanian users...");

  const mauritanianNames = [
    "محمد ولد أحمد", "أحمد سالم", "محمود بابا", "المصطفى ولد بيا", "شيخنا ولد محمد",
    "فاطمة منت سيدي", "عائشة منت أحمد", "عبد الله ولد بونا", "سيدي محمد ولد الشيخ", "عمر ولد المختار"
  ];

  for (const name of mauritanianNames) {
    const email = `${name.replace(/\s+/g, '.')}@example.com`;
    await supabase.from('users').upsert({
      full_name: name,
      email: email,
      role: 'player',
      city: 'نواكشوط'
    }, { onConflict: 'email' });
  }

  // Reload data
  const { data: teams } = await supabase.from('teams').select('id');
  const { data: users } = await supabase.from('users').select('id');
  const { data: matches } = await supabase.from('matches').select('id');

  console.log(`Populating teams and matches with ${users.length} users...`);

  // Team members
  for (const team of teams) {
    const teamSize = 5 + Math.floor(Math.random() * 5);
    const randomUsers = users.sort(() => 0.5 - Math.random()).slice(0, teamSize);
    for (let i = 0; i < randomUsers.length; i++) {
        await supabase.from('team_members').upsert({
            team_id: team.id,
            user_id: randomUsers[i].id,
            role: i === 0 ? 'captain' : 'member'
        }, { onConflict: 'team_id,user_id' });
    }
  }

  // Match players
  for (const match of matches) {
    const playerCount = 8 + Math.floor(Math.random() * 4);
    const randomUsers = users.sort(() => 0.5 - Math.random()).slice(0, playerCount);
    for (const user of randomUsers) {
      await supabase.from('match_players').upsert({
        match_id: match.id,
        user_id: user.id,
        is_confirmed: true
      }, { onConflict: 'match_id,user_id' });
    }
  }

  console.log(" Mauritanian platform populated successfully!");
}

seedBusyPlatform();
