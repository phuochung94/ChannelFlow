require('node:fs').mkdirSync('work',{recursive:true});
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const {chromium}=require('playwright');
const base=path.resolve('extension');
const X='UC'+'x'.repeat(22),Y='UC'+'y'.repeat(22);
(async()=>{
 const browser=await chromium.launch({headless:true});
 try{
  async function fixture({mode='queue',canNext=true,index=0,single=false}={}) {
   const page=await browser.newPage();
   await page.route('https://music.youtube.com/**',route=>route.fulfill({contentType:'text/html',body:'<!doctype html><html><body><div id="movie_player"></div><video class="html5-main-video"></video><ytmusic-player-bar><button class="next-button">Next</button></ytmusic-player-bar><ytmusic-player-queue></ytmusic-player-queue></body></html>'}));
   await page.goto('https://music.youtube.com/watch?v=aaaaaaaaaaa');
   await page.evaluate(({mode,canNext,index,single,X,Y})=>{
    window.test={index,ended:false,nextClicks:0,selected:[],seeks:0,plays:0,settings:{musicEnabled:true,musicMode:mode},listeners:[],channels:[]};
    const tracks=[{id:'aaaaaaaaaaa',artist:X,channel:X},{id:'bbbbbbbbbbb',artist:Y,channel:Y},{id:'ccccccccccc',artist:X,channel:X}];
    window.tracks=single?tracks.slice(0,1):tracks;
    const video=document.querySelector('video');
    for(const [key,get] of Object.entries({ended:()=>test.ended,paused:()=>test.ended,currentTime:()=>test.ended?100:10,duration:()=>100})) Object.defineProperty(video,key,{get,configurable:true});
    const player=document.getElementById('movie_player');
    player.getVideoData=()=>({video_id:window.tracks[test.index].id});
    player.getPlaylist=()=>window.tracks.map(t=>t.id);
    player.playVideoAt=i=>{test.selected.push(i);test.index=i;test.ended=false};
    player.seekTo=()=>{test.seeks++;test.ended=false};player.playVideo=()=>test.plays++;
    const next=document.querySelector('.next-button');next.disabled=!canNext;
    next.addEventListener('click',()=>{test.nextClicks++;test.index=(test.index+1)%window.tracks.length;test.ended=false});
    const queue=document.querySelector('ytmusic-player-queue');
    for(const track of window.tracks){
     const row=document.createElement('ytmusic-player-queue-item');
     row.data={videoId:track.id,title:{runs:[{text:track.id}]},longBylineText:{runs:[{text:track.artist,navigationEndpoint:{browseEndpoint:{browseId:track.artist,browseEndpointContextSupportedConfigs:{browseEndpointContextMusicConfig:{pageType:'MUSIC_PAGE_TYPE_ARTIST'}}}}}]}};
     const info=document.createElement('div');info.className='song-info';row.append(info);queue.append(row);
    }
    window.chrome={i18n:{getMessage:key=>key},storage:{local:{get:async defaults=>({...defaults,...test.settings})},onChanged:{addListener:fn=>test.listeners.push(fn)}},runtime:{onMessage:{addListener:fn=>test.message=fn},sendMessage:async message=>{test.channels.push(message.id);return {channelId:window.tracks.find(t=>t.id===message.id)?.channel,playable:true}}}};
   },{mode,canNext,index,single,X,Y});
   await page.addScriptTag({path:path.join(base,'music-page.js')});
   await page.addScriptTag({path:path.join(base,'music.js')});
   await page.waitForFunction(()=>{let state;test.message({type:'status'},null,s=>state=s);return state.supported});
   return page;
  }
  const next=page=>page.evaluate(()=>test.message({type:'next'},null,()=>{}));
  let page=await fixture();await next(page);await page.waitForFunction(()=>test.nextClicks===1);assert.equal(await page.evaluate(()=>test.index),1);await page.close();
  page=await fixture({mode:'artist'});await next(page);await page.waitForFunction(()=>test.selected.length===1);assert.equal(await page.evaluate(()=>test.index),2);await page.close();
  page=await fixture({mode:'channel'});await next(page);await page.waitForFunction(()=>test.selected.length===1);assert.equal(await page.evaluate(()=>test.index),2);assert.ok((await page.evaluate(()=>test.channels)).includes('bbbbbbbbbbb'));await page.close();
  page=await fixture({index:2,canNext:false});await next(page);await page.waitForFunction(()=>test.selected.length===1);assert.equal(await page.evaluate(()=>test.index),0);await page.close();
  page=await fixture({single:true,canNext:false});await page.evaluate(()=>test.ended=true);await next(page);await page.waitForFunction(()=>test.plays===1);assert.equal(await page.evaluate(()=>test.seeks),1);await page.close();
  page=await fixture({mode:'artist'});await page.evaluate(()=>{test.ended=true;document.querySelector('video').dispatchEvent(new Event('ended'))});await page.waitForFunction(()=>test.selected.length===1);assert.equal(await page.evaluate(()=>test.index),2);await page.close();
  page=await fixture({mode:'artist'});await page.evaluate(()=>{
   for(const row of document.querySelectorAll('ytmusic-player-queue-item')) row.data.longBylineText={runs:[]};
   test.message({type:'next'},null,()=>{});
  });await page.waitForFunction(()=>{let state;test.message({type:'status'},null,s=>state=s);return state.status==='musicArtistUnknown'});assert.equal(await page.evaluate(()=>test.selected.length),0);await page.close();
  page=await fixture();await page.waitForTimeout(2200);assert.equal(await page.evaluate(()=>test.plays+test.nextClicks+test.selected.length),0,'Normal playback is not interrupted');await page.close();
  page=await fixture();await page.evaluate(()=>test.ended=true);await page.waitForFunction(()=>test.nextClicks===1,{},{timeout:7000});assert.equal(await page.evaluate(()=>test.index),1);await page.close();
  page=await fixture();await page.evaluate(()=>{test.index=1;test.ended=false});await page.waitForTimeout(3200);assert.equal(await page.evaluate(()=>test.nextClicks),0);await page.close();
  page=await fixture();await page.evaluate(()=>{test.listeners.forEach(fn=>fn({musicEnabled:{newValue:false}},'local'));test.ended=true;document.querySelector('video').dispatchEvent(new Event('ended'))});await page.waitForTimeout(3200);assert.equal(await page.evaluate(()=>test.nextClicks),0);await page.close();
  console.log('PASS: Music queue/manual-next, same-artist and same-uploader filtering, queue wrap, single-track replay, filtered ended event, native fallback without double-skip, disabled mode. Browser fixtures, not live Music.');
 }finally{await browser.close()}
})().catch(error=>{console.error(error);process.exitCode=1});
