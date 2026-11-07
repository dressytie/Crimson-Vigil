// Experimental Crimson Vigil WebGPU blood bridge.
// Multiple independent fluid events share one renderer and scene. Older
// events are retired to bound GPU memory; production gameplay is untouched.
import * as ModernThree from 'three';
import { Simulation, createParticleRenderer } from 'threejs-particle-fluids';
const status=document.getElementById('cv-webgpu-status')||document.createElement('div');
status.id='cv-webgpu-status';
status.style.cssText='position:fixed;bottom:12px;right:12px;z-index:2147483647;background:#16080df2;color:#f5cad2;border:1px solid #85354a;padding:8px 12px;font:12px system-ui;pointer-events:none';
status.textContent='WebGPU fluid: waiting for first blood event';
if(!status.isConnected)document.body.append(status);
const worldScale=.1, maxBursts=3, burstLifetime=4.0;
let renderer=null,scene=null,camera=null,starting=null,running=false;
const bursts=[],pending=[];
function report(err){
 console.error('[CV WebGPU]',err);
 status.textContent='WebGPU fluid ERROR: '+(err?.message||String(err));
 window.cvWebGPUFluidReady=false;
}
async function initialize(){
 if(renderer)return;
 if(starting)return starting;
 starting=(async()=>{
  if(!navigator.gpu)throw Error('WebGPU unavailable');
  renderer=await createParticleRenderer({antialias:true,alpha:true});
  renderer.setPixelRatio(Math.min(devicePixelRatio||1,1.5));
  renderer.setSize(innerWidth,innerHeight);
  renderer.domElement.id='cv-webgpu-fluid';
  renderer.domElement.style.cssText='position:fixed;inset:0;width:100%;height:100%;pointer-events:none;z-index:1';
  document.body.append(renderer.domElement);
  scene=new ModernThree.Scene();
  camera=new ModernThree.PerspectiveCamera(60,innerWidth/innerHeight,.1,950);
  scene.add(new ModernThree.DirectionalLight(0xffffff,3));
 })();
 try{await starting}finally{starting=null}
}
function addBurst(detail){
 const x=(detail.x||0)*worldScale,z=(detail.y||0)*worldScale;
 const floor=new ModernThree.Box3(new ModernThree.Vector3(x-2,0,z-2),new ModernThree.Vector3(x+2,3,z+2));
 const sim=new Simulation({renderer,scene,camera,container:floor,particles:2400});
 sim.addFluid({
  box:new ModernThree.Box3(new ModernThree.Vector3(x-.15,1.1,z-.15),new ModernThree.Vector3(x+.15,1.55,z+.15)),
  color:0x790615,viscosity:.035,surfaceTension:.055
 });
 bursts.push({sim,created:performance.now()});
 while(bursts.length>maxBursts)bursts.shift().sim.dispose();
}
async function frame(){
 try{
  const source=window.cvFluidCamera;
  if(source){
   camera.position.copy(source.position);
   camera.quaternion.copy(source.quaternion);
   camera.fov=source.fov;camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();
  }
  while(pending.length)addBurst(pending.shift());
  const now=performance.now();
  for(let i=bursts.length-1;i>=0;i--){
   if((now-bursts[i].created)/1000>burstLifetime){bursts[i].sim.dispose();bursts.splice(i,1)}
  }
  for(const b of bursts)await b.sim.step();
  if(renderer.renderAsync)await renderer.renderAsync(scene,camera);
  else renderer.render(scene,camera);
  if(!window.cvWebGPUFluidReady)window.cvWebGPUFluidReady=true;
  status.textContent='WebGPU fluid ACTIVE — '+bursts.length+' fluid events ('+pending.length+' queued)';
 }catch(err){report(err);running=false;return}
 requestAnimationFrame(frame);
}
async function onImpact(ev){
 pending.push(ev.detail||{});
 if(pending.length>8)pending.shift();
 if(running)return;
 running=true;
 try{
  status.textContent='WebGPU fluid: initializing…';
  await initialize();
  requestAnimationFrame(frame);
 }catch(err){running=false;report(err)}
}
window.addEventListener('cv-blood-impact',onImpact);
window.addEventListener('resize',()=>{
 if(renderer){renderer.setSize(innerWidth,innerHeight);camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix()}
});
