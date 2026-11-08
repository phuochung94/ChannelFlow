const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const core=require('../extension/core.js');
const source=fs.readFileSync('extension/background.js','utf8');
let listener,calls=[];
const channel='UC'+'x'.repeat(22);
vm.runInNewContext(source,{importScripts(){},SameChannelCore:core,AbortSignal,
 chrome:{runtime:{onMessage:{addListener:fn=>listener=fn}}},
 fetch:async(url,options)=>{calls.push({url,options});return {ok:true,text:async()=>`var ytInitialPlayerResponse = ${JSON.stringify({videoDetails:{videoId:'aaaaaaaaaaa',channelId:channel},playabilityStatus:{status:'OK'}})};`}}
});
(async()=>{
 let rejected;listener({type:'musicChannel',id:'aaaaaaaaaaa'},{url:'https://example.org/'},r=>rejected=r);assert.ok(rejected.error);assert.equal(calls.length,0);
 listener({type:'musicChannel',id:'../invalid'},{url:'https://music.youtube.com/watch'},r=>rejected=r);assert.equal(calls.length,0);
 const result=await new Promise(resolve=>listener({type:'musicChannel',id:'aaaaaaaaaaa'},{url:'https://music.youtube.com/watch?v=aaaaaaaaaaa'},resolve));
 assert.equal(result.channelId,channel);assert.equal(result.playable,true);assert.equal(calls[0].options.credentials,'omit');
 console.log('PASS: worker limits uploader lookups to Music sender and valid IDs, fixed YouTube origin, no account credentials, verified public video/channel IDs.');
})().catch(e=>{console.error(e);process.exitCode=1});
