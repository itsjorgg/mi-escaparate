// POSTER INTERACTIVO JORGG :)
// RENDER WEB

import * as THREE from 'three';
import gsap from 'gsap';

// 1. CONFIGURACIÓN DE ESCENA, CÁMARA
const scene = new THREE.Scene();

const baseFov = 45; 
const camera = new THREE.PerspectiveCamera(baseFov, window.innerWidth / window.innerHeight, 0.1, 1000);
let targetZoom = 30; 
camera.position.z = targetZoom;

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); 
document.getElementById('app').appendChild(renderer.domElement);

// 2. TEXTURAS
const textureLoader = new THREE.TextureLoader();

function createLayer(imagePath, zDepth, scaleZ = 1) {
    const texture = textureLoader.load(imagePath);
    texture.minFilter = THREE.LinearFilter;

    const geometry = new THREE.PlaneGeometry(16 * scaleZ, 9 * scaleZ); 
    const material = new THREE.MeshBasicMaterial({ 
        map: texture, 
        transparent: true,
        depthWrite: false
    });
    const plane = new THREE.Mesh(geometry, material);
    plane.position.z = zDepth;
    
    plane.userData = { baseX: 0, baseY: 0, depthFactor: zDepth };
    
    scene.add(plane);
    return plane;
}

// 3. CAPAS DEL POSTER

// FONDO
const layerBackground = createLayer('/fondo1.png', -10, 1); 
layerBackground.position.set(0, 0, -10); 
layerBackground.userData = { baseX: 0, baseY: 0, depthFactor: -0.2 };

// ESTRELLA AZUL 

const layerStarblue = createLayer('/estrella_azul.png', -1, 1.5);
layerStarblue.scale.set(1.5, 1.5, 1.5); 
layerStarblue.position.set(-10, 3, -1); 
layerStarblue.rotation.z = -0.15;
layerStarblue.userData = { baseX: -10, baseY: 3, depthFactor: 1.5 };

// ESTRELLA AZUL 2

const layerStarblue2 = createLayer('/estrella_azul.png', -1, 1.5);
layerStarblue2.scale.set(1.5, 1.5, 1.5 ); 
layerStarblue2.position.set(-10, 3, -1); 
layerStarblue2.rotation.z = -0.15;
layerStarblue2.userData = { baseX: -10, baseY: 3, depthFactor: 1.5 };


// PERSONA (YO)
const layerPerson = createLayer('/jorg.png', 2, 1.5);
layerPerson.scale.set(3.3, 3.3, 3.3); 
layerPerson.position.set(1.5, 0.1, 2); 
layerPerson.userData = { baseX: 1.5, baseY: -1, depthFactor: 3.0 }; 

// TEXTO "YEAH!"
const layerText = createLayer('/texto.png', 5, 1.2);
layerText.scale.set(1.5, 1.5, 1.5); 
layerText.position.set(-10, 2, 5);
layerText.userData = { baseX: -10, baseY: 2, depthFactor: 5.0 };

// TEXTO 2 "YEAH!"
const layerText2 = createLayer('/texto.png', 6, 1.2); 
layerText2.scale.set(1.5, 1.5, 1.5 ); 
layerText2.position.set(11, -6, 6); 
layerText2.userData = { baseX: 11, baseY: -6, depthFactor: 6.0 };


// ESTRELLAS BLANCAS 

const layerStars = createLayer('/estrella_blanca.png', 4, 1.5);
layerStars.scale.set(0.3, 0.3, 1);
layerStars.position.set(-2, 3, 4);
layerStars.userData = { baseX: -2, baseY: 3, depthFactor: 3.5 };

const layerStars2 = createLayer('/estrella_blanca.png', 5, 1.5);
layerStars2.scale.set(0.25, 0.25, 1); 
layerStars2.position.set(-4, -6, 5); 
layerStars2.userData = { baseX: -4, baseY: -6, depthFactor: 4.5 };

const layerStars3 = createLayer('/estrella_blanca.png', 4, 1.5);
layerStars3.scale.set(0.2, 0.2, 1); 
layerStars3.position.set(5, 5, 4); 
layerStars3.userData = { baseX: 5, baseY: 5, depthFactor: 3.8 };

const layerStars4 = createLayer('/estrella_blanca.png', 5, 1.5);
layerStars4.scale.set(0.3, 0.3, 1); 
layerStars4.position.set(3, -6, 5); 
layerStars4.userData = { baseX: 3, baseY: -6, depthFactor: 4.2 };

// 4. Mouse y Scroll
let mouseX = 0;
let mouseY = 0;
let targetX = 0;
let targetY = 0;

const windowHalfX = window.innerWidth / 2;
const windowHalfY = window.innerHeight / 2;

document.addEventListener('mousemove', (event) => {
    mouseX = (event.clientX - windowHalfX) / windowHalfX;
    mouseY = (event.clientY - windowHalfY) / windowHalfY;
});

window.addEventListener('wheel', (event) => {
    targetZoom += event.deltaY * 0.03;
    targetZoom = THREE.MathUtils.clamp(targetZoom, 15, 45); 
});

// 5. Renderizado y Lerp
const animatedLayers = [
    layerBackground, layerStarblue, layerText, layerPerson, 
    layerText2, layerStars, layerStars2, layerStars3, layerStars4
];

function animate() {
    requestAnimationFrame(animate);

    targetX = mouseX * 4.0; 
    targetY = mouseY * 4.0;

    camera.position.x += (targetX - camera.position.x) * 0.05;
    camera.position.y += (-targetY - camera.position.y) * 0.05;
    
    camera.position.z += (targetZoom - camera.position.z) * 0.08;

    // cover "fondo" 
    const distToBackground = camera.position.z - layerBackground.position.z;
    const vFov = (camera.fov * Math.PI) / 180;
    const visibleHeight = 2 * Math.tan(vFov / 2) * distToBackground;
    const visibleWidth = visibleHeight * camera.aspect;

    const margin = 12; 
    
    const scaleX = (visibleWidth + margin) / 16;
    const scaleY = (visibleHeight + margin) / 9;

    const bgScale = Math.max(scaleX, scaleY);
    layerBackground.scale.set(bgScale, bgScale, 1);

    animatedLayers.forEach(layer => {
        const intensity = layer.userData.depthFactor * 0.5;
        const destX = layer.userData.baseX + (targetX * intensity);
        const destY = layer.userData.baseY + (targetY * intensity);
        
        layer.position.x += (destX - layer.position.x) * 0.08;
        layer.position.y += (destY - layer.position.y) * 0.08;
    });

    camera.lookAt(scene.position);
    renderer.render(scene, camera);
}

animate();

// 6. Responsive Constante/ RENDER

const COMPOSITION_ASPECT = 16 / 9;

function updateCameraAspect() {
    const windowAspect = window.innerWidth / window.innerHeight;
    camera.aspect = windowAspect;
    
    if (windowAspect < COMPOSITION_ASPECT) {
        camera.fov = baseFov * (COMPOSITION_ASPECT / windowAspect);
    } else {
        camera.fov = baseFov;
    }
    
    camera.updateProjectionMatrix();
}

window.addEventListener('resize', () => {
    updateCameraAspect();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

updateCameraAspect();