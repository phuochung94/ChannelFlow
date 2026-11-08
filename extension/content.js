(() => {
  let enabled = true, busy = false, generation = 0;
  let current = new URL(location.href).searchParams.get('v'), status = chrome.i18n.getMessage('ready');
  let endedId = null;
  const historyKey = 'yt-same-channel-history-v1';
  let history;
  try { history = JSON.parse(sessionStorage.getItem(historyKey) || '[]'); } catch { history = []; }
  if (!Array.isArray(history)) history = [];
  const videoId = () => location.pathname === '/watch' ? new URL(location.href).searchParams.get('v') : null;
  function remember(id) {
    if (!history.includes(id)) history.push(id);
    history = history.slice(-1000);
    try { sessionStorage.setItem(historyKey, JSON.stringify(history)); } catch { /* Storage can be disabled. */ }
  }
  function disableNativeAutoplay() {
    if (!enabled || !videoId()) return;
    const toggle = document.querySelector('.ytp-autonav-toggle-button[aria-checked="true"]');
    if (toggle) toggle.click();
  }
  async function pageData(url, name) {
    const response = await fetch(url, {credentials: 'same-origin', signal: AbortSignal.timeout(15000)});
    if (!response.ok) throw new Error(chrome.i18n.getMessage('fetchError'));
    return SameChannelCore.initialJSON(await response.text(), name);
  }
  async function details(id) {
    const data = await pageData('/watch?v=' + encodeURIComponent(id), 'ytInitialPlayerResponse');
    if (data.videoDetails?.videoId !== id || !/^UC[\w-]{22}$/.test(data.videoDetails?.channelId || '')) {
      throw new Error(chrome.i18n.getMessage('channelError'));
    }
    return { ...data.videoDetails, playable: data.playabilityStatus?.status === 'OK' };
  }
  async function next(manual = false) {
    const id = videoId();
    if (!id || busy || (!enabled && !manual)) return;
    const token = generation;
    const valid = () => generation === token && videoId() === id && (manual || enabled);
    busy = true;
    status = chrome.i18n.getMessage('searching');
    try {
      remember(id);
      const owner = await details(id);
      if (!valid()) return;
      if (owner.isLiveContent) throw new Error(chrome.i18n.getMessage('liveError'));
      const data = await pageData('/channel/' + owner.channelId + '/videos', 'ytInitialData');
      if (!valid()) return;
      // Only read the selected Videos tab, never recommended/sidebar content.
      const tabs = data.contents?.twoColumnBrowseResultsRenderer?.tabs || [];
      const tab = tabs.map(t => t.tabRenderer).find(t => t?.selected);
      if (!tab?.content) throw new Error(chrome.i18n.getMessage('tabError'));
      const loaded = SameChannelCore.videos(tab.content);
      if (!loaded.length) throw new Error(chrome.i18n.getMessage('listError'));
      const candidates = loaded.filter(v => !history.includes(v.id));
      if (!candidates.length) throw new Error(chrome.i18n.getMessage('exhausted'));
      for (const candidate of candidates.slice(0, 8)) {
        let target;
        try { target = await details(candidate.id); } catch { continue; }
        if (!valid()) return;
        if (target.channelId !== owner.channelId || !target.playable || target.isLiveContent) continue;
        status = chrome.i18n.getMessage('switching', candidate.title);
        location.assign('/watch?v=' + encodeURIComponent(candidate.id) + '&autoplay=1');
        return;
      }
      throw new Error(chrome.i18n.getMessage('unplayable'));
    } catch (error) {
      if (valid()) status = error.name === 'TimeoutError' ? chrome.i18n.getMessage('timeout') : (error.message || chrome.i18n.getMessage('unexpectedError'));
    } finally { busy = false; }
  }
  document.addEventListener('ended', event => {
    if (!enabled || !videoId() || !event.target.matches?.('video.html5-main-video')) return;
    if (document.querySelector('#movie_player.ad-showing, #movie_player.ad-interrupting')) return;
    // Prevent the player's native ended handler from taking us to another channel.
    event.stopImmediatePropagation();
    if (endedId === videoId()) return;
    endedId = videoId();
    void next();
  }, true);
  chrome.storage.local.get({enabled: true}).then(settings => { enabled = settings.enabled; disableNativeAutoplay(); });
  chrome.storage.onChanged.addListener((changes, area) => {
    if (area === 'local' && changes.enabled) {
      enabled = changes.enabled.newValue;
      generation++;
      status = enabled ? chrome.i18n.getMessage('enabledStatus') : chrome.i18n.getMessage('disabledStatus');
      disableNativeAutoplay();
    }
  });
  chrome.runtime.onMessage.addListener((message, sender, respond) => {
    if (message.type === 'status') respond({enabled, busy, status, supported: !!videoId()});
    else if (message.type === 'next') { void next(true); respond({ok: true}); }
    else if (message.type === 'reset') {
      history = []; try { sessionStorage.removeItem(historyKey); } catch {}
      status = chrome.i18n.getMessage('cleared'); respond({ok: true});
    }
  });
  // YouTube reuses the same document across navigations and may replace its player.
  setInterval(() => {
    const id = videoId();
    if (id !== current) {
      current = id; generation++;
      endedId = null;
      if (id) remember(id);
      status = id ? chrome.i18n.getMessage('ready') : chrome.i18n.getMessage('unsupported');
    }
    disableNativeAutoplay();
    const video = document.querySelector('video.html5-main-video');
    const ad = document.querySelector('#movie_player.ad-showing, #movie_player.ad-interrupting');
    if (enabled && id && video && !ad) {
      if (!video.ended && video.currentTime < video.duration - 2) endedId = null;
      if (video.ended && endedId !== id && !busy) {
        endedId = id;
        void next();
      }
    }
  }, 1000);
})();
