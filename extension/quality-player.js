// Runs in the page's MAIN world to use the existing YouTube player methods.
// No extension APIs, account data, or remotely hosted code are exposed here.
(() => {
  let enabled = false;
  const heights = {hd2160:2160, hd1440:1440, hd1080:1080, hd720:720, large:480, medium:360, small:240, tiny:144};
  let lastPlayer = null, lastVideo = '', lastTarget = '';
  window.addEventListener('message', event => {
    if (event.source !== window || event.origin !== location.origin ||
        event.data?.source !== 'channelflow-quality-v1' || typeof event.data.enabled !== 'boolean') return;
    enabled = event.data.enabled;
    if (!enabled) { lastTarget = ''; lastPlayer = null; }
  });
  setInterval(() => {
    if (!enabled || location.pathname !== '/watch') return;
    const player = document.getElementById('movie_player');
    if (!player || player.classList.contains('ad-showing') || player.classList.contains('ad-interrupting')) return;
    try {
      const id = new URL(location.href).searchParams.get('v');
      const data = player.getVideoData?.();
      if (!id || data?.video_id !== id) return;
      const available = player.getAvailableQualityLevels?.();
      if (!Array.isArray(available)) return;
      const target = available.filter(level => heights[level] && heights[level] <= 2160)
        .sort((a,b) => heights[b] - heights[a])[0];
      if (!target) return;
      if (lastPlayer === player && lastVideo === id && lastTarget === target && player.getPlaybackQuality?.() === target) return;
      let applied = false;
      if (typeof player.setPlaybackQualityRange === 'function') {
        player.setPlaybackQualityRange(target, target);
        applied = true;
      }
      if (typeof player.setPlaybackQuality === 'function') {
        player.setPlaybackQuality(target);
        applied = true;
      }
      if (applied) { lastPlayer = player; lastVideo = id; lastTarget = target; }
    } catch { /* Retry when the player finishes reloading. */ }
  }, 2000);
})();
