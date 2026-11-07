// Crimson Vigil experimental WebGPU bridge. Separate renderer, never replaces
// the production WebGL game. Requires HTTPS, WebGPU, and bundled dependencies.
import * as ModernThree from 'three';
import { Simulation, createParticleRenderer } from 'threejs-particle-fluids';
const status=document.createElement('div');
status.id='cv-webgpu-status';status.style.cssText='position:fixed;bottom:12px;right:12px;z-index:9000;background:#16080de0;color:#f5cad2;border:1px solid #85354a;padding:8px 12px;font:12px system-ui;pointer-events:none';
status.textContent='WebGPU fluid: waiting for first blood event';document.body.append(status);
let fluid=null, renderer=null,scene=null,camera=null,busy=false,disposed=false;
const worldScale=.1;
async function startFluid(ev){
 if(fluid||busy||disposed)return;
 busy=true;
 try{
  if(!navigator.gpu)throw Error('WebGPU unavailable in this browser');
  const detail=ev.detail||{}, x=(detail.x||0)*worldScale,z=(detail.y||0)*worldScale;
  renderer=await createParticleRenderer({antialias:true,alpha:true});
  renderer.setPixelRatio(Math.min(devicePixelRatio||1,1.5));
  renderer.setSize(innerWidth,innerHeight);
  renderer.domElement.id='cv-webgpu-fluid';
  renderer.domElement.style.cssText='position:fixed;inset:0;width:100%;height:100%;pointer-events:none;z-index:1';
  document.body.append(renderer.domElement);
  scene=new ModernThree.Scene();
  camera=new ModernThree.PerspectiveCamera(60,innerWidth/innerHeight,.1,950);
  scene.add(new ModernThree.DirectionalLight(0xffffff,3));
  const floor=new ModernThree.Box3(new ModernThree.Vector3(x-2,0,z-2),new ModernThree.Vector3(x+2,3,z+2));
  fluid=new Simulation({renderer,scene,camera,container:floor,particles:5000});
  fluid.addFluid({box:new ModernThree.Box3(new ModernThree.Vector3(x-.15,1.1,z-.15),new ModernThree.Vector3(x+.15,1.55,z+.15))});
  await fluid.start();
  status.textContent='WebGPU fluid: running (first impact prototype)';
  const frame=async()=>{
   if(disposed)return;
   const source=window.cvFluidCamera;
   if(source){
    camera.position.set(source.position.x,source.position.y,source.position.z);
    camera.quaternion.set(source.quaternion.x,source.quaternion.y,source.quaternion.z,source.quaternion.w);
    camera.fov=source.fov;camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();
   }
   await fluid.step();
   renderer.render(scene,camera);
   requestAnimationFrame(frame);
  };
  requestAnimationFrame(frame);
 }catch(err){status.textContent='WebGPU fluid error: '+(err?.message||err);console.error('[CV WebGPU]',err)}
 finally{busy=false}
}
window.addEventListener('cv-blood-impact',startFluid);
window.addEventListener('resize',()=>{if(renderer){renderer.setSize(innerWidth,innerHeight);camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix()}});
