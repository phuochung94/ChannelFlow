importScripts('core.js');
// Same-channel mode verifies uploader IDs using public YouTube watch pages.
chrome.runtime.onMessage.addListener((message, sender, respond) => {
  if (message.type !== 'musicChannel') return;
  if (!sender.url?.startsWith('https://music.youtube.com/') || !/^[\w-]{11}$/.test(message.id || '')) {
    respond({error:'channelError'}); return;
  }
  (async () => {
    try {
      const response = await fetch('https://www.youtube.com/watch?v=' + encodeURIComponent(message.id), {credentials:'omit', signal:AbortSignal.timeout(10000)});
      if (!response.ok) throw new Error();
      const data = SameChannelCore.initialJSON(await response.text(), 'ytInitialPlayerResponse');
      if (data.videoDetails?.videoId !== message.id || !/^UC[\w-]{22}$/.test(data.videoDetails?.channelId || '')) throw new Error();
      respond({channelId:data.videoDetails.channelId, playable:data.playabilityStatus?.status === 'OK'});
    } catch { respond({error:'channelError'}); }
  })();
  return true;
});
