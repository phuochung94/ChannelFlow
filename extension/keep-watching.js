(() => {
  let enabled = false;
  const settingKey = location.hostname === 'music.youtube.com' ? 'preventMusicAutoPause' : 'preventAutoPause';
  const attempts = new WeakMap();
  chrome.storage.local.get({[settingKey]: true}).then(settings => {
    enabled = settings[settingKey];
  });
  chrome.storage.onChanged.addListener((changes, area) => {
    if (area === 'local' && changes[settingKey]) enabled = changes[settingKey].newValue;
  });
  const visible = element => element && !element.hidden &&
    element.getAttribute('aria-hidden') !== 'true' && element.getClientRects().length > 0;
  function check() {
    const music = location.hostname === 'music.youtube.com';
    if (!enabled || (!music && location.pathname !== '/watch')) return;
    if (document.querySelector('#movie_player.ad-showing, #movie_player.ad-interrupting')) return;
    const video = document.querySelector('video.html5-main-video');
    if (!video || !video.paused || video.ended) return;
    for (const dialog of document.querySelectorAll('yt-confirm-dialog-renderer, ytd-confirm-dialog-renderer, ytmusic-you-there-renderer')) {
      if (!visible(dialog)) { attempts.delete(dialog); continue; }
      const text = (dialog.textContent || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/\u0111/g, 'd');
      // Match only the inactivity confirmation, never unrelated confirmations.
      if (!/(?:video|music|playback)\s+(?:is\s+)?paused[\s\S]*continue\s+(?:watching|listening)/.test(text) &&
          !/(?:video|nhac|phat\s+nhac)\s+(?:da\s+)?tam\s+dung[\s\S]*tiep\s+tuc\s+(?:xem|nghe)/.test(text) &&
          !(music && dialog.tagName === 'YTMUSIC-YOU-THERE-RENDERER' && /(?:continue\s+(?:watching|listening)|are\s+you\s+still\s+(?:listening|there)|tiep\s+tuc\s+(?:xem|nghe)|ban\s+(?:co\s+)?(?:van\s+)?(?:dang\s+)?(?:nghe|o\s+do))/.test(text))) continue;
      let button = dialog.querySelector('#confirm-button button, button#confirm-button, #confirm-button[role="button"], #confirm-button yt-button-shape button, #confirm-button, #confirmButton, .confirm-button');
      if (!button && music && dialog.tagName === 'YTMUSIC-YOU-THERE-RENDERER') {
        const buttons = [...dialog.querySelectorAll('button, tp-yt-paper-button, paper-button')].filter(visible);
        button = buttons.find(item => /^(?:yes|continue|co|tiep tuc)\b/i.test((item.textContent || '').normalize('NFD').replace(/[\u0300-\u036f]/g,''))) || (buttons.length === 1 ? buttons[0] : null);
      }
      if (!visible(button) || button.disabled || button.getAttribute('aria-disabled') === 'true') continue;
      const now = Date.now();
      const previous = attempts.get(dialog);
      if (previous && now - previous.time < 10000) continue;
      if (previous && previous.count >= 3 && now - previous.time < 60000) continue;
      const count = previous && now - previous.time < 60000 ? previous.count : 0;
      attempts.set(dialog, {time: now, count: count + 1});
      button.click();
      // The confirmation's own handler resumes playback. Never force play() on a
      // generic pause, so manual pause and browser autoplay restrictions survive.
      return;
    }
  }
  setInterval(check, 1000);
})();
