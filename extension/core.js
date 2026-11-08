/* Pure parsing helpers; no page scripts are executed. */
(function (root) {
  function initialJSON(html, name) {
    const pattern = new RegExp('(?:var\\s+' + name + '|window\\["' + name + '"\\]|' + name + ')\\s*=\\s*', 'g');
    for (const match of html.matchAll(pattern)) {
      const start = match.index + match[0].length;
      if (html[start] !== '{') continue;
      let depth = 0, quoted = false, escaped = false;
      for (let i = start; i < html.length; i++) {
        const c = html[i];
        if (quoted) {
          if (escaped) escaped = false;
          else if (c === '\\') escaped = true;
          else if (c === '"') quoted = false;
        } else if (c === '"') quoted = true;
        else if (c === '{') depth++;
        else if (c === '}' && --depth === 0) {
          try { return JSON.parse(html.slice(start, i + 1)); } catch { break; }
        }
      }
    }
    throw new Error(chrome.i18n.getMessage('parseError'));
  }
  function videos(data) {
    const result = [], seen = new Set();
    function visit(value) {
      if (!value || typeof value !== 'object') return;
      const lockup = value.lockupViewModel;
      const v = value.videoRenderer || value.gridVideoRenderer || value.playlistVideoRenderer ||
        (lockup?.contentType === 'LOCKUP_CONTENT_TYPE_VIDEO' ? {
          videoId: lockup.contentId,
          title: {simpleText: lockup.metadata?.lockupMetadataViewModel?.title?.content},
          badges: lockup.contentImage
        } : null);
      if (v && /^[\w-]{11}$/.test(v.videoId) && !seen.has(v.videoId)) {
        const badges = JSON.stringify(v.badges || []);
        if (!v.upcomingEventData && !/LIVE_NOW/.test(badges)) {
          seen.add(v.videoId);
          result.push({id: v.videoId, title: v.title?.runs?.map(r => r.text).join('') || v.title?.simpleText || 'Video'});
        }
      }
      for (const child of Object.values(value)) visit(child);
    }
    visit(data);
    return result;
  }
  const api = {initialJSON, videos};
  root.SameChannelCore = api;
  if (typeof module !== 'undefined') module.exports = api;
})(globalThis);
