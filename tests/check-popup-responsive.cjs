require('node:fs').mkdirSync('work',{recursive:true});
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const {chromium}=require('playwright');
const base=path.resolve('extension');
(async()=>{
 const browser=await chromium.launch({headless:true});
 try{
  for(const lang of ['en','vi'])for(const platform of ['youtube','music'])for(const [width,height] of [[1920,1080],[800,600],[640,480],[320,480]]){
   const page=await browser.newPage({viewport:{width:380,height:530}});
   const messages=JSON.parse(fs.readFileSync(path.join(base,'_locales',lang,'messages.json'),'utf8'));
   const html=fs.readFileSync(path.join(base,'popup.html'),'utf8').replace(/<script[\s\S]*?<\/script>/g,'').replace(/<link[^>]+>/,'<style>'+fs.readFileSync(path.join(base,'popup.css'),'utf8')+'</style>');
   await page.setContent(html);
   await page.evaluate(({width,height,messages,lang,platform})=>{
    Object.defineProperty(screen,'availWidth',{get:()=>width});Object.defineProperty(screen,'availHeight',{get:()=>height});
    window.changes=[];window.chrome={i18n:{getUILanguage:()=>lang,getMessage:key=>messages[key]?.message||''},storage:{local:{get:async defaults=>defaults,set:async value=>changes.push(value)},onChanged:{addListener(){}}},tabs:{query:async()=>[{id:1}],sendMessage:async()=>({platform,supported:true,enabled:true,busy:false,mode:'artist',status:messages[platform==='music'?'musicReady':'ready'].message})}};
   },{width,height,messages,lang,platform});
   await page.addScriptTag({path:path.join(base,'popup-size.js')});
   await page.addScriptTag({path:path.join(base,'popup.js')});
   await page.waitForFunction(()=>document.querySelector('#enabled').checked);
   const size=await page.evaluate(()=>({width:document.documentElement.clientWidth,height:document.documentElement.clientHeight}));
   await page.setViewportSize(size);
   for(const status of platform==='music'?['musicReady','musicNoMatch','musicArtistUnknown','musicOff']:['ready','tabError','listError','exhausted','connectionError']) {
    await page.locator('#status').evaluate((el,text)=>el.textContent=text,messages[status].message);
    await page.evaluate(()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve))));
    const resized=await page.evaluate(()=>({width:document.documentElement.clientWidth,height:document.documentElement.clientHeight}));
    await page.setViewportSize(resized);
    const layout=await page.evaluate(()=>{
     const root=document.documentElement.getBoundingClientRect();
     const visible=[...document.body.children].filter(el=>el.tagName!=='SCRIPT'&&!el.hidden);
     const errors=visible.filter(el=>{
      const box=el.getBoundingClientRect();return box.bottom>root.bottom+1||box.right>root.right+1||box.top<-.5||box.left<-.5||el.scrollHeight>el.clientHeight+1||el.scrollWidth>el.clientWidth+1;
     }).map(el=>({id:el.id||el.tagName,scroll:[el.scrollWidth,el.scrollHeight],client:[el.clientWidth,el.clientHeight],box:JSON.stringify(el.getBoundingClientRect()),root:JSON.stringify(root)}));
     const next=document.getElementById('next').getBoundingClientRect(),reset=document.getElementById('reset').getBoundingClientRect();
     return {errors,aligned:Math.abs(next.top-reset.top)<1,overflow:getComputedStyle(document.documentElement).overflow};
    });
    assert.deepEqual(layout.errors,[],`${lang} ${platform} ${width}x${height} ${status}`);assert.ok(layout.aligned);assert.equal(layout.overflow,'hidden');
   }
   assert.equal(await page.locator('#qualityRow').isVisible(),true);
   assert.equal(await page.locator('#musicModeRow').isVisible(),true);
   const panels=await page.locator('section h2').allTextContents();assert.deepEqual(panels,['YouTube','YouTube Music']);
   {
    await page.selectOption('#musicMode','channel');
    assert.ok((await page.evaluate(()=>changes)).some(change=>change.musicMode==='channel'));
    await page.locator('#enabled').uncheck();
    await page.locator('#musicEnabled').uncheck();
    await page.locator('#preventMusicAutoPause').uncheck();
    await page.locator('#preventAutoPause').uncheck();
    const writes=await page.evaluate(()=>changes);
    for(const key of ['enabled','musicEnabled','preventAutoPause','preventMusicAutoPause']) assert.ok(writes.some(change=>change[key]===false));
   }
   if(width===1920){
    await page.locator('#status').evaluate((el,text)=>el.textContent=text,messages[platform==='music'?'musicReady':'ready'].message);
    await page.evaluate(()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve))));
    await page.setViewportSize(await page.evaluate(()=>({width:document.documentElement.clientWidth,height:document.documentElement.clientHeight})));
    await page.screenshot({path:path.resolve(`work/popup-${platform}-${lang}.png`)});
   }
   await page.close();
  }
  console.log('PASS: EN/VI x active YouTube/Music x 4 display sizes; separate sections in correct order, independent settings writes, full content fits without scrollbar, side-by-side actions.');
 }finally{await browser.close()}
})().catch(e=>{console.error(e);process.exitCode=1});
