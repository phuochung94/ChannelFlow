// Bundled page-world adapter: reads public player/queue metadata and activates
// existing playback controls. No extension APIs or account data are exposed.
(() => {
  const idPattern = /^[\w-]{11}$/;
  function artistIds(root) {
    const ids = new Set();
    function walk(value) {
      if (!value || typeof value !== 'object') return;
      const endpoint = value.navigationEndpoint?.browseEndpoint;
      const type = endpoint?.browseEndpointContextSupportedConfigs?.browseEndpointContextMusicConfig?.pageType;
      if (endpoint?.browseId?.startsWith('UC') && (!type || type === 'MUSIC_PAGE_TYPE_ARTIST')) ids.add(endpoint.browseId);
      for (const child of Object.values(value)) walk(child);
    }
    walk(root);
    return [...ids];
  }
  function rows() {
    return [...document.querySelectorAll('ytmusic-player-queue ytmusic-player-queue-item')].map(row => {
      const raw = row.data || row.__data?.data || {};
      const data = raw.playlistPanelVideoRenderer || raw;
      let id = data.videoId || data.playlistItemData?.videoId || row.getAttribute('video-id');
      if (!idPattern.test(id || '')) {
        for (const image of row.querySelectorAll('img')) {
          const match = (image.src || image.getAttribute('data-src') || '').match(/\/(?:vi|vi_webp)\/([\w-]{11})\//);
          if (match) { id = match[1]; break; }
        }
      }
      const artists = artistIds(data.longBylineText || data.shortBylineText || {});
      for (const link of row.querySelectorAll('.byline a[href]')) {
        const match = link.getAttribute('href')?.match(/\/(?:channel|browse)\/(UC[\w-]{22})/);
        if (match) artists.push(match[1]);
      }
      return {element: row, id, artists: [...new Set(artists)], title: row.querySelector('.song-title')?.textContent?.trim() || data.title?.runs?.map(r=>r.text).join('') || ''};
    }).filter(row => idPattern.test(row.id || ''));
  }
  function snapshot() {
    const player = document.getElementById('movie_player');
    const data = player?.getVideoData?.() || {};
    const queue = rows();
    const id = idPattern.test(data.video_id || '') ? data.video_id : null;
    const artists = queue.find(row => row.id === id)?.artists || [];
    for (const link of document.querySelectorAll('ytmusic-player-bar .byline a[href]')) {
      const match = link.getAttribute('href')?.match(/\/(?:channel|browse)\/(UC[\w-]{22})/);
      if (match) artists.push(match[1]);
    }
    const next = document.querySelector('ytmusic-player-bar .next-button');
    return {id, artists:[...new Set(artists)], queue:queue.map(({element,...row})=>row), canNext:!!next && !next.disabled && next.getAttribute('aria-disabled') !== 'true'};
  }
  window.addEventListener('message', event => {
    const message = event.data;
    if (event.source !== window || event.origin !== location.origin || message?.source !== 'channelflow-music-request' || typeof message.requestId !== 'string') return;
    try {
      if (message.command === 'snapshot') {
        window.postMessage({source:'channelflow-music-response', requestId:message.requestId, snapshot:snapshot()}, location.origin);
        return;
      }
      let ok = false;
      if (message.command === 'next') {
        const button = document.querySelector('ytmusic-player-bar .next-button');
        if (button && !button.disabled && button.getAttribute('aria-disabled') !== 'true') { button.click(); ok = true; }
      } else if (message.command === 'select' && idPattern.test(message.id || '')) {
        const row = rows().find(row => row.id === message.id);
        if (row) {
          const player = document.getElementById('movie_player');
          const video = document.querySelector('video.html5-main-video');
          if (player?.getVideoData?.()?.video_id === row.id && video?.ended) {
            player.seekTo?.(0, true); player.playVideo?.(); ok = true;
          } else {
            const playlist = player?.getPlaylist?.();
            const at = Array.isArray(playlist) ? playlist.indexOf(row.id) : -1;
            if (at >= 0 && typeof player.playVideoAt === 'function') player.playVideoAt(at);
            else (row.element.querySelector('ytmusic-play-button-renderer, .song-info') || row.element).click();
            ok = true;
          }
        }
      }
      window.postMessage({source:'channelflow-music-response', requestId:message.requestId, ok}, location.origin);
    } catch {
      window.postMessage({source:'channelflow-music-response', requestId:message.requestId, ok:false}, location.origin);
    }
  });
})();
