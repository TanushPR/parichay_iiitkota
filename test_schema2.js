const url = 'https://tvewzubgcnmukgnpawty.supabase.co/rest/v1/clubs';
fetch(url, {
  method: 'OPTIONS',
  headers: {
    'apikey': 'sb_publishable_ns6v1ZVDfxWqn7HZUSmP7g_vyaI7A-q'
  }
})
  .then(res => res.text())
  .then(data => console.log(data))
  .catch(err => console.error(err));
