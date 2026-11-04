const {app,BrowserWindow,dialog,shell}=require('electron');
const {autoUpdater}=require('electron-updater');
const path=require('node:path');
const fs=require('node:fs/promises');
const https=require('node:https');
const crypto=require('node:crypto');
let win;
const repo='dressytie/Crimson-Vigil';
const trusted='https://github.com/'+repo;
const gameName='Crimson_Vigil_Game.html';
const shaName='Crimson_Vigil_Game.sha256';
function fetchBuffer(url,redirects=0){
 return new Promise((resolve,reject)=>{
  if(redirects>5)return reject(new Error('Too many redirects'));
  const req=https.get(url,{headers:{'User-Agent':'CrimsonVigilUpdater/1.0','Accept':'application/vnd.github+json'},timeout:30000},res=>{
   if([301,302,303,307,308].includes(res.statusCode)){
    const target=new URL(res.headers.location,url);
    res.resume();
    if(target.protocol!=='https:')return reject(new Error('Insecure redirect'));
    return fetchBuffer(target.href,redirects+1).then(resolve,reject);
   }
   if(res.statusCode!==200){res.resume();return reject(new Error('Update server HTTP '+res.statusCode))}
   const chunks=[];let size=0;
   res.on('data',b=>{size+=b.length;if(size>30*1024*1024){req.destroy(new Error('Patch too large'));return}chunks.push(b)});
   res.on('end',()=>resolve(Buffer.concat(chunks)));
   res.on('error',reject);
  });
  req.on('timeout',()=>req.destroy(new Error('Update request timed out')));
  req.on('error',reject);
 });
}
const patchDir=()=>path.join(app.getPath('userData'),'patches');
const patchFile=()=>path.join(patchDir(),gameName);
const versionFile=()=>path.join(patchDir(),'installed.json');
async function getGamePath(){
 try{const file=patchFile(),buf=await fs.readFile(file);if(buf.length>100000&&buf.includes(Buffer.from('<html')))return file}catch{}
 return path.join(__dirname,'game','index.html');
}
async function checkGamePatches(){
 const releases=JSON.parse((await fetchBuffer('https://api.github.com/repos/'+repo+'/releases?per_page=30')).toString());
 if(!Array.isArray(releases))throw Error('Invalid GitHub release list');
 const releasesWithPatches=releases.filter(r=>!r.draft&&!r.prerelease&&/^game-v[0-9]+\.[0-9]+\.[0-9]+$/.test(r.tag_name)&&r.assets.some(a=>a.name===gameName)&&r.assets.some(a=>a.name===shaName));
 if(!releasesWithPatches.length)return;
 releasesWithPatches.sort((a,b)=>b.published_at.localeCompare(a.published_at));
 const latest=releasesWithPatches[0],assets=latest.assets;
 let installed={};
 try{installed=JSON.parse(await fs.readFile(versionFile(),'utf8'))}catch{}
 if(installed.tag===latest.tag_name)return;
 const {response}=await dialog.showMessageBox(win,{type:'question',title:'Crimson Vigil launcher',message:'Game patch '+latest.tag_name+' is available',detail:'Download the verified game patch now? No Windows reinstall required.',buttons:['Download patch','Later'],defaultId:0,cancelId:1});
 if(response!==0)return;
 const getAsset=n=>assets.find(a=>a.name===n).browser_download_url;
 const expected=(await fetchBuffer(getAsset(shaName))).toString().trim().split(/\s+/)[0].toLowerCase();
 if(!/^[a-f0-9]{64}$/.test(expected))throw Error('Invalid patch checksum');
 const data=await fetchBuffer(getAsset(gameName));
 const actual=crypto.createHash('sha256').update(data).digest('hex');
 if(actual!==expected)throw Error('Patch checksum mismatch: download rejected');
 if(data.length<100000||!data.includes(Buffer.from('<html')))throw Error('Invalid game file');
 await fs.mkdir(patchDir(),{recursive:true});
 const tmp=patchFile()+'.tmp';
 await fs.writeFile(tmp,data);
 await fs.rename(tmp,patchFile());
 await fs.writeFile(versionFile(),JSON.stringify({tag:latest.tag_name,sha256:actual}));
 const {response:restart}=await dialog.showMessageBox(win,{message:'Game patch installed',detail:'Restart Crimson Vigil to play the updated version.',buttons:['Restart now','Later'],defaultId:0});
 if(restart===0){app.relaunch();app.quit()}
}
async function createWindow(){
 win=new BrowserWindow({width:1280,height:800,minWidth:960,minHeight:600,backgroundColor:'#050204',show:false,webPreferences:{preload:path.join(__dirname,'preload.cjs'),nodeIntegration:false,contextIsolation:true,sandbox:true,webSecurity:true}});
 win.removeMenu();
 win.webContents.setWindowOpenHandler(({url})=>{if(url.startsWith(trusted))shell.openExternal(url);return {action:'deny'}});
 win.webContents.on('will-navigate',(e,url)=>{if(!url.startsWith('file://'))e.preventDefault()});
 win.once('ready-to-show',()=>win.show());
 await win.loadFile(await getGamePath());
}
app.whenReady().then(async()=>{
 await createWindow();
 if(app.isPackaged){
  setTimeout(()=>checkGamePatches().catch(e=>dialog.showMessageBox(win,{type:'warning',message:'Game update check failed',detail:String(e.message||e),buttons:['OK']})),3000);
  // Desktop runtime updates are separate from lightweight gameplay patches.
  autoUpdater.autoDownload=false;
  autoUpdater.autoInstallOnAppQuit=true;
  autoUpdater.on('update-available',async info=>{
   const {response}=await dialog.showMessageBox(win,{type:'info',message:'Launcher update '+info.version+' available',buttons:['Download launcher update','Later'],defaultId:0,cancelId:1});
   if(response===0)autoUpdater.downloadUpdate().catch(e=>console.error(e));
  });
  autoUpdater.on('update-downloaded',async()=>{
   const {response}=await dialog.showMessageBox(win,{message:'Launcher update ready',buttons:['Restart and install','Later'],defaultId:0});
   if(response===0)autoUpdater.quitAndInstall();
  });
  autoUpdater.on('error',e=>console.error('Launcher update:',e.message));
  setTimeout(()=>autoUpdater.checkForUpdates().catch(e=>console.error('Launcher update unavailable:',e.message)),6000);
 }
});
app.on('window-all-closed',()=>{if(process.platform!=='darwin')app.quit()});
