(() => {
  let enabled = false, mode = 'queue', busy = false, generation = 0;
  let current = null, lastSnapshot = null, endedAt = 0, handled = false;
  let status = chrome.i18n.getMessage('musicOpen');
  const pending = new Map(), cache = new Map();
  let sequence = 0;
  const historyKey = 'channelflow-music-history-v1';
  let history;
  try { history = JSON.parse(sessionStorage.getItem(historyKey) || '[]'); } catch { history = []; }
  if (!Array.isArray(history)) history = [];
  function remember(id) {
    if (!id || history.includes(id)) return;
    history.push(id); history = history.slice(-1000);
    try { sessionStorage.setItem(historyKey, JSON.stringify(history)); } catch {}
  }
  function request(command, id) {
    return new Promise((resolve, reject) => {
      const requestId = 'music-' + (++sequence);
      const timeout = setTimeout(() => { pending.delete(requestId); reject(new Error(chrome.i18n.getMessage('musicUnavailable'))); }, 2500);
      pending.set(requestId, result => { clearTimeout(timeout); resolve(result); });
      window.postMessage({source:'channelflow-music-request', requestId, command, id}, location.origin);
    });
  }
  window.addEventListener('message', event => {
    if (event.source !== window || event.origin !== location.origin || event.data?.source !== 'channelflow-music-response') return;
    const resolve = pending.get(event.data.requestId);
    if (resolve) { pending.delete(event.data.requestId); resolve(event.data); }
  });
  async function channel(id) {
    if (cache.has(id)) return cache.get(id);
    const result = await chrome.runtime.sendMessage({type:'musicChannel', id});
    if (!result?.channelId) throw new Error(chrome.i18n.getMessage('channelError'));
    if (cache.size >= 200) cache.clear();
    cache.set(id, result); return result;
  }
  async function next(manual = false) {
    if (busy || (!enabled && !manual)) return;
    busy = true;
    const token = generation;
    let snapshot;
    const valid = () => token === generation && (manual || enabled);
    try {
      status = chrome.i18n.getMessage('musicSearching');
      snapshot = (await request('snapshot')).snapshot;
      if (!snapshot?.id || !valid()) return;
      const queue = Array.isArray(snapshot.queue) ? snapshot.queue : [];
      const at = queue.findIndex(row => row.id === snapshot.id);
      let ordered = [...queue.slice(at + 1), ...queue.slice(0, at + 1)];
      // Prefer an unvisited match, then wrap through previously played tracks.
      if (mode !== 'queue') ordered = [...ordered.filter(row=>!history.includes(row.id)), ...ordered.filter(row=>history.includes(row.id))];
      if (mode === 'queue' && snapshot.canNext) {
        if (!valid()) return;
        const result = await request('next');
        if (!result.ok) throw new Error(chrome.i18n.getMessage('musicUnavailable'));
        status = chrome.i18n.getMessage('musicReady'); return;
      }
      if (mode === 'artist') {
        const artists = new Set(snapshot.artists || []);
        if (!artists.size) throw new Error(chrome.i18n.getMessage('musicArtistUnknown'));
        ordered = ordered.filter(row => row.artists?.some(id => artists.has(id)));
      }
      if (mode === 'channel') {
        const owner = await channel(snapshot.id);
        const matches = [];
        for (const row of ordered.slice(0,30)) {
          if (!valid()) return;
          try {
            const target = await channel(row.id);
            if (target.channelId === owner.channelId && target.playable) { matches.push(row); break; }
          } catch { /* Try another queued track; never guess uploader identity. */ }
        }
        ordered = matches;
      }
      if (!valid()) return;
      const target = ordered.find(row=>row.id !== snapshot.id) || ordered.find(row=>row.id === snapshot.id);
      if (!target) throw new Error(chrome.i18n.getMessage('musicNoMatch'));
      const latest = (await request('snapshot')).snapshot;
      if (!valid() || latest?.id !== snapshot.id) return;
      const result = await request('select', target.id);
      if (!result.ok) throw new Error(chrome.i18n.getMessage('musicUnavailable'));
      status = chrome.i18n.getMessage('musicReady');
    } catch(error) { if (valid()) status = error.message || chrome.i18n.getMessage('musicUnavailable'); }
    finally { busy = false; }
  }
  chrome.storage.local.get({musicEnabled:true,musicMode:'queue'}).then(settings => {
    enabled = settings.musicEnabled; mode = ['queue','artist','channel'].includes(settings.musicMode) ? settings.musicMode : 'queue';
  });
  chrome.storage.onChanged.addListener((changes, area) => {
    if (area !== 'local') return;
    if (changes.musicEnabled) { enabled = changes.musicEnabled.newValue; generation++; handled = false; }
    if (changes.musicMode) { mode = ['queue','artist','channel'].includes(changes.musicMode.newValue) ? changes.musicMode.newValue : 'queue'; generation++; handled = false; }
    status = chrome.i18n.getMessage(enabled ? 'musicReady' : 'musicOff');
  });
  document.addEventListener('ended', event => {
    if (!enabled || mode === 'queue' || !current || !event.target.matches?.('video.html5-main-video')) return;
    if (document.querySelector('#movie_player.ad-showing, #movie_player.ad-interrupting')) return;
    event.stopImmediatePropagation();
    if (!handled) { handled = true; void next(); }
  }, true);
  let polling = false;
  setInterval(async () => {
    if (polling) return;
    polling = true;
    try {
      const snapshot = (await request('snapshot')).snapshot;
      if (!snapshot) return;
      lastSnapshot = snapshot;
      if (snapshot.id !== current) {
        current = snapshot.id; generation++; endedAt = 0; handled = false;
        remember(current); status = chrome.i18n.getMessage(current ? (enabled ? 'musicReady' : 'musicOff') : 'musicOpen');
      }
      const video = document.querySelector('video.html5-main-video');
      const ad = document.querySelector('#movie_player.ad-showing, #movie_player.ad-interrupting');
      if (!enabled || !current || !video || ad) return;
      if (!video.ended) { endedAt = 0; if (video.currentTime < video.duration - 2) handled = false; return; }
      if (!endedAt) endedAt = Date.now();
      // Let Music advance its own queue first to prevent a double skip.
      if (!handled && !busy && (mode !== 'queue' || Date.now() - endedAt >= 2000)) {
        handled = true; void next();
      }
    } catch { /* Player may still be loading; retry on the next tick. */ }
    finally { polling = false; }
  }, 1000);
  chrome.runtime.onMessage.addListener((message, sender, respond) => {
    if (message.type === 'status') respond({platform:'music',enabled,busy,status,supported:!!lastSnapshot?.id,mode});
    else if (message.type === 'next') { void next(true); respond({ok:true}); }
    else if (message.type === 'reset') { history=[]; try{sessionStorage.removeItem(historyKey)}catch{} status=chrome.i18n.getMessage('cleared');respond({ok:true}); }
  });
})();
