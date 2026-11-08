const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const base='extension/';
const en=JSON.parse(fs.readFileSync(base+'_locales/en/messages.json'));
const vi=JSON.parse(fs.readFileSync(base+'_locales/vi/messages.json'));
assert.deepEqual(Object.keys(en).sort(),Object.keys(vi).sort());
const files=['content.js','core.js','popup.js','music.js','music-page.js','background.js'];
for(const file of files) {
 const text=fs.readFileSync(base+file,'utf8');
 for(const match of text.matchAll(/getMessage\('([^']+)'/g)) assert.ok(en[match[1]]&&vi[match[1]],match[1]);
 assert.ok(!/[\u00c0-\u024f\u1e00-\u1eff]/.test(text),'Untranslated text in '+file);
}
const html=fs.readFileSync(base+'popup.html','utf8');
for(const locale of ['en-US','vi','vi-VN','fr']) {
 const catalog=locale.startsWith('vi')?vi:en;
 const nodes=[...html.matchAll(/data-i18n="([^"]+)"/g)].map(m=>({dataset:{i18n:m[1]}}));
 const aria={dataset:{i18nAria:'enableLabel'},setAttribute(k,v){this[k]=v}};
 const controls=Object.fromEntries(['enabled','preventAutoPause','autoQuality','musicEnabled','preventMusicAutoPause','musicMode','qualityRow','musicModeRow','musicHintText','status','next','reset'].map(id=>[id,{addEventListener(){},setAttribute(){}}]));
 const document={documentElement:{},querySelectorAll:s=>s==='[data-i18n]'?nodes:s==='[data-i18n-aria]'?[aria]:[],getElementById:id=>controls[id],querySelector:s=>nodes.find(node=>s.includes('"'+node.dataset.i18n+'"'))};
 const chrome={i18n:{getUILanguage:()=>locale,getMessage:(key,value)=>{assert.ok(catalog[key],key);return catalog[key].message.replace('$1',value||'')}},storage:{local:{get:async defaults=>defaults},onChanged:{addListener(){}}},tabs:{query:async()=>[{id:1}],sendMessage:async()=>({status:catalog.ready.message,supported:true})}};
 vm.runInNewContext(fs.readFileSync(base+'popup.js','utf8'),{document,chrome,setInterval(){}});
 assert.equal(nodes[0].textContent,catalog.heading.message);
 assert.equal(aria['aria-label'],catalog.enableLabel.message);
 assert.equal(document.documentElement.lang,locale);
 assert.equal(chrome.i18n.getMessage('switching','Test'),catalog.switching.message.replace('$1','Test'));
}
const manifest=JSON.parse(fs.readFileSync(base+'manifest.json'));
assert.equal(manifest.default_locale,'en');
assert.equal(manifest.version,'1.3.2');
assert.deepEqual(manifest.permissions,['storage']);
for(const catalog of [en,vi]) assert.ok(catalog.extensionDescription.message.length<=132);
console.log('PASS: EN/VI catalogs, referenced messages, popup translation and accessible labels for en-US/vi/vi-VN/fr fallback, manifest localization.');
