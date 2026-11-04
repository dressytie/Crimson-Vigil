const {app,BrowserWindow,dialog,shell}=require('electron');
const {autoUpdater}=require('electron-updater');
const path=require('node:path');
let win;
const trusted='https://github.com/dressytie/Crimson-Vigil';
function createWindow(){
 win=new BrowserWindow({width:1280,height:800,minWidth:960,minHeight:600,backgroundColor:'#050204',show:false,webPreferences:{preload:path.join(__dirname,'preload.cjs'),nodeIntegration:false,contextIsolation:true,sandbox:true,webSecurity:true}});
 win.removeMenu();
 win.webContents.setWindowOpenHandler(({url})=>{if(url.startsWith(trusted))shell.openExternal(url);return {action:'deny'}});
 win.webContents.on('will-navigate',(e,url)=>{if(!url.startsWith('file://'))e.preventDefault()});
 win.once('ready-to-show',()=>win.show());
 win.loadFile(path.join(__dirname,'game','index.html'));
}
app.whenReady().then(()=>{
 createWindow();
 if(app.isPackaged){
  autoUpdater.autoDownload=false;
  autoUpdater.autoInstallOnAppQuit=true;
  autoUpdater.on('update-available',async info=>{
   const {response}=await dialog.showMessageBox(win,{type:'info',title:'Crimson Vigil update',message:'Version '+info.version+' is available.',detail:'Download the verified update now?',buttons:['Download update','Later'],defaultId:0,cancelId:1});
   if(response===0)autoUpdater.downloadUpdate().catch(e=>dialog.showErrorBox('Update download failed',String(e)));
  });
  autoUpdater.on('update-downloaded',async()=>{
   const {response}=await dialog.showMessageBox(win,{type:'info',message:'Update ready to install',buttons:['Restart and install','On next exit'],defaultId:0});
   if(response===0)autoUpdater.quitAndInstall();
  });
  autoUpdater.on('error',e=>console.error('Update check:',e.message));
  setTimeout(()=>autoUpdater.checkForUpdates().catch(e=>console.error('Update unavailable:',e.message)),5000);
 }
});
app.on('window-all-closed',()=>{if(process.platform!=='darwin')app.quit()});
