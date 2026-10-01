// ESCAPARATE TANAMACHI JORGG :)
// RENDER WEB

//import
import './style.css';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import gsap from 'gsap'; 
//stats para los fps 
import Stats from 'three/examples/jsm/libs/stats.module.js';

const stats = new Stats();
document.body.appendChild(stats.dom);

// escena, cámara 
const canvas = document.getElementById("lienzo");
const escena = new THREE.Scene();
escena.background = new THREE.Color("#1f1b1a"); 

const camara = new THREE.PerspectiveCamera(40, 1, 0.1, 100); // FOV, aspect ratio, near, far
camara.position.set(15, 8, 25);
camara.lookAt(new THREE.Vector3(0, 0, 0)); 

// Renderizador
const renderizador = new THREE.WebGLRenderer({ canvas: canvas, antialias: true }); 
renderizador.shadowMap.enabled = true;

// controles para rotar la cámara 
const controls = new OrbitControls(camara, canvas);
controls.enableDamping = true;
controls.dampingFactor = 0.05;

// ajustar el tamaño del canvas y la cámara cuando se cambia el tamaño de la ventana
function ajusteCanvas() {
  renderizador.setSize(window.innerWidth, window.innerHeight, false); 
  renderizador.setPixelRatio(Math.min(2, window.devicePixelRatio));
  camara.aspect = window.innerWidth / window.innerHeight;
  camara.updateProjectionMatrix(); 
}
ajusteCanvas();
window.addEventListener("resize", ajusteCanvas);

// Iluminación: 
// luz ambiental, luz frontal, luz principal, luz de relleno y luz para el modelo

escena.add(new THREE.AmbientLight("#ffffff", 0.8)); 

// Luz frontal 
const luzFrontal = new THREE.DirectionalLight("#ffffff", 0.8);
luzFrontal.position.set(0, 10, 20); 
escena.add(luzFrontal);

// Luz principal (SpotLight) 
const luzPrincipal = new THREE.SpotLight(0xffeedd, 350);
luzPrincipal.position.set(-2, 11, -2); 
luzPrincipal.angle = Math.PI / 3;
luzPrincipal.penumbra = 0.5;
luzPrincipal.castShadow = true;
escena.add(luzPrincipal);

// Luz de relleno
const luzRelleno = new THREE.PointLight(0xf2a516, 150, 30); 
luzRelleno.position.set(-5, 2, 2);
escena.add(luzRelleno);

//Luz para modelo/maniquin al centro
const luzModelo = new THREE.SpotLight(0xffffff, 400); 
luzModelo.position.set(-2.5, 10, 4); 
luzModelo.angle = Math.PI / 8; 
luzModelo.penumbra = 0.8; 
luzModelo.castShadow = true;
luzModelo.target.position.set(-2.5, -2.5, -1);
escena.add(luzModelo);
escena.add(luzModelo.target);

// texturasss para el marco de madera, botones, logo y nuevo marco
const textureLoader = new THREE.TextureLoader();
const texturaMadera = textureLoader.load('/texturas/madera.jpg');
const texturaMatcap = textureLoader.load('/texturas/matcap.png');
const texturaCromo = textureLoader.load('/texturas/cromo.jpg');
const texturaMarco = textureLoader.load('/texturas/marco.jpg'); 

// formato de color correcto
texturaMadera.colorSpace = THREE.SRGBColorSpace; 
texturaMatcap.colorSpace = THREE.SRGBColorSpace;
texturaCromo.colorSpace = THREE.SRGBColorSpace;
texturaMarco.colorSpace = THREE.SRGBColorSpace; 
texturaMarco.wrapS = texturaMarco.wrapT = THREE.RepeatWrapping;
texturaMarco.repeat.set(0.1, 0.1);

// Cajaja principal y las paredes "TELEVISIÓN"
const grupoTV = new THREE.Group();
escena.add(grupoTV);

// Materiales para las paredes y el interior
const materialInterior = new THREE.MeshStandardMaterial({ color: "#111111", roughness: 1 });
const materialFondo = new THREE.MeshBasicMaterial({ color: "#0a0a0a" }); 

// Pared del fondo
const paredFondo = new THREE.Mesh(new THREE.PlaneGeometry(25, 15), materialFondo);
paredFondo.position.set(-2.5, 4.5, -10);
grupoTV.add(paredFondo);

// Techo
const paredTecho = new THREE.Mesh(new THREE.PlaneGeometry(25, 15), materialInterior);
paredTecho.rotation.x = Math.PI / 2; 
paredTecho.position.set(-2.5, 12, -2.5);
grupoTV.add(paredTecho);

// Piso de madera con textura de madera
const texturaMaderaPiso = texturaMadera.clone();
texturaMaderaPiso.wrapS = texturaMaderaPiso.wrapT = THREE.RepeatWrapping;
texturaMaderaPiso.repeat.set(4, 3); 

const paredPiso = new THREE.Mesh(new THREE.PlaneGeometry(25, 15), new THREE.MeshStandardMaterial({ map: texturaMaderaPiso, roughness: 0.8, color: "#aaaaaa" }));
paredPiso.rotation.x = -Math.PI / 2; 
paredPiso.position.set(-2.5, -3, -2.5);
paredPiso.receiveShadow = true; 
grupoTV.add(paredPiso);

// Paredes laterales
const paredIzq = new THREE.Mesh(new THREE.PlaneGeometry(15, 15), materialInterior);
paredIzq.rotation.y = Math.PI / 2; 
paredIzq.position.set(-15, 4.5, -2.5);
grupoTV.add(paredIzq);

const paredDer = new THREE.Mesh(new THREE.PlaneGeometry(15, 15), materialInterior);
paredDer.rotation.y = -Math.PI / 2;
paredDer.position.set(10, 4.5, -2.5);
grupoTV.add(paredDer);

// Marco frontal con un hueco en medio
const formaMarco = new THREE.Shape();
formaMarco.moveTo(-18, -6).lineTo(18, -6).lineTo(18, 15).lineTo(-18, 15).lineTo(-18, -6);

// Hueco para la pantalla
const huecoPantalla = new THREE.Path();
huecoPantalla.moveTo(-15, -3).lineTo(10, -3).lineTo(10, 12).lineTo(-15, 12).lineTo(-15, -3);
formaMarco.holes.push(huecoPantalla);

//textura marco usando MeshBasicMaterial para mostrar la imagen exacta sin interactuar con luces
const marcoTV = new THREE.Mesh(
  new THREE.ExtrudeGeometry(formaMarco, { depth: 1, bevelEnabled: true, bevelSegments: 2, steps: 1, bevelSize: 0.2, bevelThickness: 0.2 }), 
  new THREE.MeshBasicMaterial({ map: texturaMarco }) // <--- MeshBasicMaterial ignora sombras/luces
);
//posición del marco y sombra
marcoTV.position.set(0, 0, 5);
marcoTV.castShadow = true;
grupoTV.add(marcoTV);

// Panel lateral rectangular lado derecho
const panelControl = new THREE.Mesh(new THREE.BoxGeometry(5, 15, 1.1), new THREE.MeshStandardMaterial({ color: "#3f4ea7", roughness: 0.5 }));
panelControl.position.set(14, 4.5, 6.2); 
grupoTV.add(panelControl);

//Botones redondos, material matcap como metal brillante.
const materialPerillas = new THREE.MeshMatcapMaterial({ matcap: texturaMatcap, color: "#ffffff" });
// botones en el panel
for(let i = 0; i < 3; i++) {
  const perilla = new THREE.Mesh(new THREE.CylinderGeometry(1.2, 1.2, 0.5, 32), materialPerillas);
  perilla.rotation.x = Math.PI / 2;
  perilla.position.set(14, 9 - (i * 3.5), 6.8); 
  grupoTV.add(perilla);
}

// botones inferiores, parte inferior del marco
const geometriaBoton = new THREE.CylinderGeometry(0.6, 0.6, 0.4, 32);
const materialBotonesRetro = new THREE.MeshPhongMaterial({ color: "#a8da20", shininess: 100 });
const objetosInteractivos = []; 

//5 botones
for(let i = 0; i < 5; i++) {
    // material
    const boton = new THREE.Mesh(geometriaBoton, materialBotonesRetro.clone()); 
    boton.rotation.x = Math.PI / 2;
    boton.position.set(8 - (i * 2.5), -4.5, 6.4); 
    grupoTV.add(boton);
    objetosInteractivos.push(boton); 
}

// rayas de colores del fondo, color y escala diferente
const datosLineas = [
    { color: "#d93829", escala: 1 }, { color: "#f2e3d5", escala: 0.9 }, { color: "#f2a516", escala: 0.8 },
    { color: "#2b5f8c", escala: 0.9 }, { color: "#f2e3d5", escala: 1 }, { color: "#597332", escala: 0.8 },
    { color: "#f2e3d5", escala: 0.9 }, { color: "#d93829", escala: 1 }, { color: "#f2a516", escala: 0.9 }
];
//ancho de las rayas
const anchoRaya = 25 / datosLineas.length;

datosLineas.forEach((dato, i) => {
  //pilar para cada raya
    const pilar = new THREE.Mesh(
      new THREE.BoxGeometry(anchoRaya - 0.3, 15 * dato.escala, 0.5), 
      new THREE.MeshStandardMaterial({ color: dato.color, roughness: 0.7 })
    );
    pilar.position.set(-15 + (i * anchoRaya) + (anchoRaya / 2), 4.5, -9.75); 
    pilar.castShadow = true;
    escena.add(pilar);
});

// importación de modelos 3d
const gltfLoader = new GLTFLoader();
let modeloProtagonista = null; 
let logoFrontal = null; 
let logoFondo = null;

// Modelo/maniquí mujer tanamachi
gltfLoader.load('/modelos/modelo_tanamachi.glb', (gltf) => {
   console.log(" Modelo Tanamachi cargado correctamente:", gltf.scene);
    modeloProtagonista = gltf.scene;
    modeloProtagonista.position.set(-2.5, -2.7, -1); 
    modeloProtagonista.scale.set(6.5, 6.5, 6.5); 
    //sombras
    modeloProtagonista.traverse((hijo) => {
      if (hijo.isMesh) { hijo.castShadow = true; hijo.receiveShadow = true; }
    });
    escena.add(modeloProtagonista);
});

// Logo del fondo, kangisss
//materail de cromo
const materialCromo = new THREE.MeshStandardMaterial({ map: texturaCromo, metalness: 1.0, roughness: 0.15, color: "#ffffff" });

gltfLoader.load('/modelos/logo_centro.glb', (gltf) => {
    console.log(" Logo del fondo cargado correctamente:", gltf.scene);
    logoFondo = gltf.scene;
    logoFondo.position.set(-2.5, 4.5, -6); 
    logoFondo.scale.set(40, 40, 40); 
    logoFondo.traverse((hijo) => { if (hijo.isMesh) hijo.material = materialCromo; });
    escena.add(logoFondo);
});

// Logo letras tanamachi
gltfLoader.load('/modelos/tana_letras.glb', (gltf) => {
    console.log(" Logo letras tanamachi cargado correctamente:", gltf.scene);
    logoFrontal = gltf.scene;
    logoFrontal.position.set(-12, 12.5, 6.5); 
    logoFrontal.scale.set(45, 45, 45); 
    //material
    logoFrontal.traverse((hijo) => { if (hijo.isMesh) hijo.material = materialPerillas; });
    escena.add(logoFrontal);
});

// pelotas que van a flotar
const grupoPelotas = new THREE.Group();
escena.add(grupoPelotas);
let pelotasActivas = false; 

//no de pelotas, color y posición aleatoria
for (let i = 0; i < 30; i++) {
    const pelota = new THREE.Mesh(
      new THREE.SphereGeometry(1, 32, 32), 
      new THREE.MeshToonMaterial({ color: datosLineas[i % datosLineas.length].color })
    );
    // Escala y posición aleatoria
    const escala = Math.random() * 0.8 + 0.2; 
    pelota.scale.set(escala, escala, escala);
    pelota.position.set((Math.random() * 20) - 12.5, (Math.random() * 12) - 1, (Math.random() * 10) - 7);
    
    // dirección y velocidad random, rebote dentro
    pelota.userData.velocidad = new THREE.Vector3((Math.random() - 0.5) * 0.15, (Math.random() - 0.5) * 0.15, (Math.random() - 0.5) * 0.15);
    pelota.castShadow = true;
    grupoPelotas.add(pelota);
}
grupoPelotas.visible = false;

// Evento para activar las pelotas con tecla de espacio
window.addEventListener('keydown', (evento) => {
    if (evento.code === 'Space') {
        pelotasActivas = !pelotasActivas; 
        grupoPelotas.visible = pelotasActivas; 
    }
});

//detectar mouse hover y click en los botones interactivos
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
let objetoHovereado = null;


window.addEventListener('mousemove', (event) => {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
});

// click en los botones interactivos y el logo del fondo
window.addEventListener('click', () => {
  console.log("Click detectado");

    raycaster.setFromCamera(mouse, camara);

    // click en el logo del fondo, recorrido de lado a lado
    if (logoFondo && raycaster.intersectObject(logoFondo, true).length > 0) {
        gsap.timeline({ overwrite: true })
          .to(logoFondo.position, { x: 5, duration: 0.6, ease: "power1.inOut" }) 
          .to(logoFondo.position, { x: -9, duration: 1.2, ease: "power1.inOut" }) 
          .to(logoFondo.position, { x: -2.5, duration: 0.6, ease: "power1.inOut" }); 
    }

    // click botonees inferiores; saltan, crecen un poco y dan una vuelta completa
    if (objetoHovereado) {
        gsap.to(objetoHovereado.position, { z: 8.5, duration: 0.4, yoyo: true, repeat: 1, ease: "back.out(3)", overwrite: true });
        gsap.to(objetoHovereado.scale, { x: 2, y: 2, z: 2, duration: 0.4, yoyo: true, repeat: 1, ease: "back.out(3)", overwrite: true });
        gsap.to(objetoHovereado.rotation, { x: objetoHovereado.rotation.x + (Math.PI * 2), z: objetoHovereado.rotation.z + (Math.PI * 2), duration: 0.8, ease: "elastic.out(1, 0.3)", overwrite: true });
    }
});

// Animación y renderizado
const reloj = new THREE.Clock(); 

renderizador.setAnimationLoop(() => {
    const tiempo = reloj.getElapsedTime();

    // Rootación de maniqui
    if (modeloProtagonista) modeloProtagonista.rotation.y += 0.005;

    // Movimiento del logo frontal, sube y baja suavemente
    if (logoFrontal) logoFrontal.position.y = 12.5 + Math.sin(tiempo * 4) * 0.3;
    
    // Movimiento de las pelotas, rebotan dentro de los límites imaginarios
    if (pelotasActivas) {
        grupoPelotas.children.forEach(pelota => {
            pelota.position.add(pelota.userData.velocidad);
            // Si chocan con los límites imaginarios que le pusimos, invertimos su velocidad para que reboten
            if (pelota.position.x > 9 || pelota.position.x < -14) pelota.userData.velocidad.x *= -1;
            if (pelota.position.y > 11 || pelota.position.y < -2) pelota.userData.velocidad.y *= -1;
            if (pelota.position.z > 4 || pelota.position.z < -9) pelota.userData.velocidad.z *= -1;
        });
    }

    // Raycaster para detectar hover sobre los botones interactivos
    raycaster.setFromCamera(mouse, camara);
    const intersecciones = raycaster.intersectObjects(objetosInteractivos);

    if (intersecciones.length > 0) {
        if (objetoHovereado !== intersecciones[0].object) {
            // Si hay un objeto previamente hovereado, apagamos su luz de "hover"
            if (objetoHovereado) objetoHovereado.material.emissive.setHex(0x000000);
            
            // luz de "hover" y cambio de cursor
            objetoHovereado = intersecciones[0].object;
            
            // Como cambiamos algunos materiales, checamos si tienen propiedad emissive antes de prenderla
            if(objetoHovereado.material.emissive) {
                objetoHovereado.material.emissive.setHex(0x444444); 
            }
            document.body.style.cursor = 'pointer'; 
        }
    } else {
        // Si no hay intersecciones, se apaga la luz de "hover" y cambia el cursor a default
        if (objetoHovereado) {
            if(objetoHovereado.material.emissive) {
                objetoHovereado.material.emissive.setHex(0x000000);
            }
            objetoHovereado = null;
            document.body.style.cursor = 'default';
        }
    }
    
    //fps stats
    stats.update();

    // Actualización de controles y renderizado de la escena
    controls.update(); 
    renderizador.render(escena, camara);
});