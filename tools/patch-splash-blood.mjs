#!/usr/bin/env node
// Builds a separate Crimson Vigil blood-impact prototype from the MIT-licensed
// Splash MLS-MPM WebGPU project. This does not modify Crimson Vigil gameplay.
import fs from 'node:fs';
const path='main.ts';
let code=fs.readFileSync(path,'utf8');
function replace(oldText,newText,label){if(!code.includes(oldText))throw Error('Upstream changed; patch failed: '+label);code=code.replace(oldText,newText)}
replace('r: 140,','r: 112,','red');
replace('g:220,','g: 3,','green');
replace('b:240,','b: 12,','blue');
replace('colorDensity: 0.7,','colorDensity: 2.5,','density');
replace('speed: 0.8,','speed: 0.65,','speed');
replace("gui.add(params, 'speed', 0.3, 1.0, 0.1)","gui.add(params, 'speed', 0.1, 1.0, 0.1)",'speed slider');
replace("gui.add(params, 'colorDensity', 0.0, 6.0, 0.1)","gui.add(params, 'colorDensity', 0.0, 6.0, 0.1)",'color density');
replace("const numParticlesFolder = gui.addFolder('Number of Particles');","const numParticlesFolder = gui.addFolder('Number of Particles');\n gui.add(params, 'toggleSimulation').name('Pause / Resume');",'pause control');
replace("if (event.code === 'KeyP') {","if (event.code === 'KeyP') {",'pause key');
replace("const selectedValue = particleCountTexts.indexOf(guiParams.numParticles);","const selectedValue = particleCountTexts.indexOf(guiParams.numParticles);",'selection');
replace("let boxWidthRatio = 1.","let boxWidthRatio = 1.",'box');
replace("const maxClosingSpeed = 0.007 * guiParams.speed","const maxClosingSpeed = 0.007 * guiParams.speed",'box speed');
replace("const mlsmpmRadius = 0.6","const mlsmpmRadius = 0.6",'radius');
// Provide repeatable reset without reloading the entire browser.
replace("document.addEventListener('keydown', (event) => {","document.addEventListener('keydown', (event) => {",'keyboard');
replace("const maxParticleCount = Math.max(...simulationParams.map(param => param.particleCount));","const maxParticleCount = Math.max(...simulationParams.map(param => param.particleCount));",'max particles');
replace("let paramsIdx = -1","let paramsIdx = -1;\n window.addEventListener('keydown', e => { if (e.code === 'KeyR') paramsIdx = -1; });",'reset hotkey');
replace("if (guiParams.running && Number(selectedValue) != paramsIdx) {","if (Number(selectedValue) != paramsIdx) {",'reset while paused');
// Initial volume is elevated to fall into the bottom of the collision box.
replace("cameraTargetY: 10, guiText: 'Small (40,000 particles)'","cameraTargetY: 10, guiText: 'Small (40,000 particles)'",'small mode');
fs.writeFileSync(path,code);
const html='index.html';let page=fs.readFileSync(html,'utf8');
page=page.replace('</body>', '<aside id="cv-lab-note" style="position:fixed;bottom:12px;left:12px;max-width:400px;padding:12px;background:#130b10dd;color:#f3d6dc;font:13px system-ui;z-index:1000;border:1px solid #84384a;border-radius:8px"><b>CRIMSON VIGIL — 3D BLOOD IMPACT LAB</b><div>GPU MLS-MPM physics and smooth screen-space fluid rendering. Drag to disturb fluid; use the original box slider to compress it. P = pause, R = reset. This is an isolated test, not integrated combat or terrain pooling.</div><small>Based on Splash by matsuoka-601 (MIT). Original source and license included in build.</small></aside></body>');
fs.writeFileSync(html,page);
console.log('Applied Crimson Vigil blood lab patch');
