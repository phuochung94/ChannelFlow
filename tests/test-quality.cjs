const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const source=fs.readFileSync('extension/quality-player.js','utf8');
function setup({levels=['highres','hd2160','hd1080'],ad=false,id='aaaaaaaaaaa',path='/watch'}={}) {
 let handler,tick,quality='medium';const calls=[];
 const window={addEventListener:(type,fn)=>handler=fn};
 const location={origin:'https://www.youtube.com',pathname:path,href:'https://www.youtube.com/watch?v=aaaaaaaaaaa'};
 const player={classList:{contains:()=>ad},getVideoData:()=>({video_id:id}),getAvailableQualityLevels:()=>levels,getPlaybackQuality:()=>quality,
 setPlaybackQualityRange:(a,b)=>calls.push([a,b]),setPlaybackQuality:q=>{quality=q;calls.push(q)}};
 vm.runInNewContext(source,{window,location,document:{getElementById:()=>player},URL,setInterval:fn=>tick=fn});
 return {tick,calls,signal:(enabled,origin=location.origin,src=window)=>handler({source:src,origin,data:{source:'channelflow-quality-v1',enabled}})};
}
let state=setup();state.tick();assert.equal(state.calls.length,0);
state.signal(true);state.tick();assert.equal(state.calls[1],'hd2160');
state.tick();assert.equal(state.calls.length,2,'Do not reapply when already selected');
state.signal(false);state.tick();assert.equal(state.calls.length,2);
for(const [levels,expected] of [[['hd1080','hd720'],'hd1080'],[['highres','hd1440'],'hd1440'],[['small','medium','tiny'],'medium']]) {
 state=setup({levels});state.signal(true);state.tick();assert.equal(state.calls[1],expected);
}
for(const options of [{levels:['highres','hd2880']},{ad:true},{id:'bbbbbbbbbbb'},{path:'/shorts/a'}]) {
 state=setup(options);state.signal(true);state.tick();assert.equal(state.calls.length,0);
}
state=setup();state.signal(true,'https://example.org');state.tick();assert.equal(state.calls.length,0);
state.signal(true,'https://www.youtube.com',{});state.tick();assert.equal(state.calls.length,0);
// Bridge reads/stores only a boolean and broadcasts settings, including changes.
(async()=>{
 let tick,change;const sent=[];
 vm.runInNewContext(fs.readFileSync('extension/quality-bridge.js','utf8'),{
 window:{postMessage:(data,origin)=>sent.push({data,origin})},location:{origin:'https://www.youtube.com'},
 chrome:{storage:{local:{get:async()=>({autoQuality:true})},onChanged:{addListener:fn=>change=fn}}},setInterval:fn=>tick=fn});
 await Promise.resolve();assert.equal(sent[0].data.enabled,true);
 change({autoQuality:{newValue:false}},'local');tick();assert.equal(sent.at(-1).data.enabled,false);
 console.log('PASS: 4K ceiling, lower-resolution fallback, off/ad/stale-video/unsupported guards, duplicate suppression, message validation, settings bridge.');
})().catch(e=>{console.error(e);process.exitCode=1});
