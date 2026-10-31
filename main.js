// POSTER INTERACTIVO JORGG :)
// RENDER WEB

import * as THREE from 'three';
import gsap from 'gsap';

// 1. Configuración Básica
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
// Alejar la cámara para ver todas las capas
camera.position.z = 5;

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById('app').appendChild(renderer.domElement);

// 2. Cargador de Texturas
const textureLoader = new THREE.TextureLoader();

// Función auxiliar para crear planos con texturas
function createLayer(imagePath, zDepth, scaleZ = 1) {
    const texture = textureLoader.load(imagePath);
    // Ajustar geometría al tamaño de la pantalla o proporciones de la imagen
    const geometry = new THREE.PlaneGeometry(16 * scaleZ, 9 * scaleZ); 
    const material = new THREE.MeshBasicMaterial({ 
        map: texture, 
        transparent: true 
    });
    const plane = new THREE.Mesh(geometry, material);
    plane.position.z = zDepth;
    scene.add(plane);
    return plane;
}

// 3. Creación de Capas (Ajusta las rutas a los nombres de tus archivos)
// El fondo está más lejos (Z negativa), los elementos frontales más cerca (Z positiva)
const layerBackground = createLayer('/fondo.jpg', -2, 1.2);
const layerStars = createLayer('/estrells_blanca.png', -0.5, 1);
const layerPerson = createLayer('/jorg.png', 0, 1);
const layerText = createLayer('/texto.png', 1, 0.9);

// 4. Interacción del Mouse para el Parallax
let mouseX = 0;
let mouseY = 0;
let targetX = 0;
let targetY = 0;

const windowHalfX = window.innerWidth / 2;
const windowHalfY = window.innerHeight / 2;

document.addEventListener('mousemove', (event) => {
    // Normalizar coordenadas del mouse de -1 a 1
    mouseX = (event.clientX - windowHalfX) / windowHalfX;
    mouseY = (event.clientY - windowHalfY) / windowHalfY;
});

// 5. Bucle de Renderizado y Animación Smooth (Lerp)
function animate() {
    requestAnimationFrame(animate);

    // Suavizar el movimiento hacia la posición del mouse
    targetX = mouseX * 0.5; // Ajusta el 0.5 para más o menos intensidad
    targetY = mouseY * 0.5;

    // Mover la cámara ligeramente para crear el efecto parallax de forma global
    // GSAP o Lerp manual. Aquí usamos Lerp manual simple:
    camera.position.x += (targetX - camera.position.x) * 0.05;
    camera.position.y += (-targetY - camera.position.y) * 0.05;

    // Opcional: Mover capas individuales a diferentes velocidades para exagerar el efecto
    layerText.position.x += (targetX * 0.2 - layerText.position.x) * 0.05;
    layerPerson.position.x += (targetX * 0.05 - layerPerson.position.x) * 0.05;

    // Asegurar que la cámara siempre mire al centro
    camera.lookAt(scene.position);

    renderer.render(scene, camera);
}

animate();

// 6. Responsive
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});
