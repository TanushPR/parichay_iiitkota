const url = 'https://tvewzubgcnmukgnpawty.supabase.co/rest/v1/?apikey=sb_publishable_ns6v1ZVDfxWqn7HZUSmP7g_vyaI7A-q';
fetch(url)
  .then(res => res.json())
  .then(data => {
    console.log("CLUBS:", Object.keys(data.definitions.clubs.properties));
    console.log("STUDENTS:", Object.keys(data.definitions.students.properties));
  })
  .catch(err => console.error(err));
