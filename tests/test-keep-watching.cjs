const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const source=fs.readFileSync('extension/keep-watching.js','utf8');
async function run({text='Video paused. Continue watching?',visible=true,enabled=true,paused=true,ad=false,ended=false,path='/watch',disable=false,music=false}={}) {
 let tick,change,clicks=0;
 const button={getAttribute:()=>null,getClientRects:()=>[{}],click(){clicks++}};
 const dialog={tagName:music?'YTMUSIC-YOU-THERE-RENDERER':'YT-CONFIRM-DIALOG-RENDERER',textContent:text,getAttribute:()=>null,getClientRects:()=>visible?[{}]:[],querySelector:()=>button};
 const video={paused,ended};
 const document={querySelector:s=>s.includes('ad-showing')?(ad?{}:null):video,querySelectorAll:()=>[dialog]};
 const chrome={storage:{local:{get:async()=>({preventAutoPause:music?true:enabled,preventMusicAutoPause:music?enabled:true})},onChanged:{addListener:fn=>change=fn}}};
 vm.runInNewContext(source,{chrome,document,location:{pathname:path,hostname:music?'music.youtube.com':'www.youtube.com'},setInterval:fn=>tick=fn,Date});
 await Promise.resolve();
 if(disable) change({[music?'preventMusicAutoPause':'preventAutoPause']:{newValue:false}},'local');
 tick();tick();return clicks;
}
(async()=>{
 assert.equal(await run(),1);
 assert.equal(await run({text:'Video đã tạm dừng. Tiếp tục xem?'}),1);
 assert.equal(await run({text:'Music paused. Continue listening?',music:true,path:'/'}),1);
 assert.equal(await run({text:'Nhạc đã tạm dừng. Tiếp tục nghe?',music:true,path:'/browse/a'}),1);
 assert.equal(await run({text:'Are you still listening?',music:true,path:'/'}),1);
 assert.equal(await run({text:'Bạn vẫn đang nghe chứ?',music:true,path:'/'}),1);
 assert.equal(await run({text:'Are you still listening?',music:true,enabled:false}),0);
 assert.equal(await run({text:'Are you still listening?',music:true,disable:true}),0);
 assert.equal(await run({text:'Delete playlist?',music:true}),0);
 for(const options of [{text:'Delete playlist? Continue?'},{text:'Sign in to continue watching'},{text:''},{visible:false},{enabled:false},{paused:false},{ad:true},{ended:true},{path:'/shorts/a'},{disable:true}]) assert.equal(await run(options),0,JSON.stringify(options));
 console.log('PASS: English/Vietnamese inactivity prompts, click throttling, no unrelated dialog/manual-pause action, hidden/off/playing/ad/ended/unsupported guards, live setting changes.');
})().catch(e=>{console.error(e);process.exitCode=1});
