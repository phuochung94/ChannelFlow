const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');
const dir = path.resolve('extension');
global.chrome = {i18n:{getMessage:key=>key}};
const core = require(path.join(dir, 'core.js'));
assert.deepEqual(core.initialJSON('var ytInitialData = {"x":"brace } and \\\" quote", "a":{"n":1}};tail', 'ytInitialData').a, {n:1});
assert.throws(() => core.initialJSON('var ytInitialData = broken;', 'ytInitialData'));
assert.deepEqual(core.videos({items:[{videoRenderer:{videoId:'aaaaaaaaaaa'}},{videoRenderer:{videoId:'aaaaaaaaaaa'}},{videoRenderer:{videoId:'bbbbbbbbbbb',upcomingEventData:{}}},{videoRenderer:{videoId:'ccccccccccc',badges:[{style:'LIVE_NOW'}]}}]}).map(v=>v.id), ['aaaaaaaaaaa']);
const channel = 'UC' + 'x'.repeat(22);
const other = 'UC' + 'y'.repeat(22);
assert.deepEqual(core.videos({lockupViewModel:{contentType:'LOCKUP_CONTENT_TYPE_VIDEO',contentId:'ddddddddddd',metadata:{lockupMetadataViewModel:{title:{content:'Modern video'}}}}}),[{id:'ddddddddddd',title:'Modern video'}]);
assert.equal(core.videos({lockupViewModel:{contentType:'LOCKUP_CONTENT_TYPE_PLAYLIST',contentId:'ddddddddddd'}}).length,0);
async function scenario({wrongChannel=false,cancel=false,ad=false,enabled=true,modern=false,poll=false,manual=false}={}) {
  const listeners = {}, memory = new Map(), assigned=[];
  let message, change, tick, calls=0;
  const location={pathname:'/watch',href:'https://www.youtube.com/watch?v=aaaaaaaaaaa',assign:url=>assigned.push(url)};
  const context={console,URL,AbortSignal,SameChannelCore:core,location,
    sessionStorage:{getItem:k=>memory.get(k),setItem:(k,v)=>memory.set(k,v),removeItem:k=>memory.delete(k)},
    document:{addEventListener:(type,fn)=>listeners[type]=fn,querySelector:s=>s.includes('ad-showing')&&ad?{}:s==='video.html5-main-video'&&poll?{ended:true,currentTime:100,duration:100}:null},
    chrome:{i18n:global.chrome.i18n,storage:{local:{get:async()=>({enabled})},onChanged:{addListener:fn=>change=fn}},runtime:{onMessage:{addListener:fn=>message=fn}}},
    setInterval:fn=>tick=fn,
    fetch:async url=>{
      calls++;
      if(cancel && calls===2) { location.href='https://www.youtube.com/watch?v=zzzzzzzzzzz'; tick(); }
      let name, data;
      if(url.includes('/channel/')) {
        name='ytInitialData'; data={contents:{twoColumnBrowseResultsRenderer:{tabs:[{tabRenderer:{selected:true,content:{items:[{videoRenderer:{videoId:'bbbbbbbbbbb'}}]}}}]}}};
        if(modern) data.contents.twoColumnBrowseResultsRenderer.tabs[0].tabRenderer.content.items=[{lockupViewModel:{contentType:'LOCKUP_CONTENT_TYPE_VIDEO',contentId:'bbbbbbbbbbb'}}];
      } else {
        const id=new URL(url,'https://www.youtube.com').searchParams.get('v');
        name='ytInitialPlayerResponse'; data={videoDetails:{videoId:id,channelId:wrongChannel&&id==='bbbbbbbbbbb'?other:channel},playabilityStatus:{status:'OK'}};
      }
      return {ok:true,text:async()=>`var ${name} = ${JSON.stringify(data)};`};
    }
  };
  vm.runInNewContext(fs.readFileSync(path.join(dir,'content.js'),'utf8'),context);
  await Promise.resolve();
  if(manual) message({type:'next'},null,()=>{});
  else if(poll) tick();
  else listeners.ended({target:{matches:()=>true},stopImmediatePropagation(){}});
  await new Promise(resolve=>setTimeout(resolve,20));
  return {assigned,calls};
}
(async()=>{
  assert.equal((await scenario()).assigned[0],'/watch?v=bbbbbbbbbbb&autoplay=1');
  assert.equal((await scenario({wrongChannel:true})).assigned.length,0);
  assert.equal((await scenario({cancel:true})).assigned.length,0);
  assert.equal((await scenario({ad:true})).calls,0);
  assert.equal((await scenario({enabled:false})).calls,0);
  assert.equal((await scenario({modern:true,manual:true})).assigned.length,1);
  assert.equal((await scenario({modern:true,poll:true})).assigned.length,1);
  const manifest=JSON.parse(fs.readFileSync(path.join(dir,'manifest.json')));
  assert.equal(manifest.manifest_version,3);
  for(const file of [...manifest.content_scripts[0].js,manifest.action.default_popup]) assert.ok(fs.existsSync(path.join(dir,file)));
  for(const [size,file] of Object.entries(manifest.icons)) {
    const png=fs.readFileSync(path.join(dir,file));
    assert.equal(png.readUInt32BE(16),Number(size)); assert.equal(png.readUInt32BE(20),Number(size));
  }
  console.log('PASS: JSON parsing, deduplication/live exclusions, correct channel navigation, foreign channel rejection, stale navigation cancellation, ad exclusion, disabled mode, manifest files.');
})().catch(error=>{console.error(error);process.exitCode=1});
