import * as THREE from "./node_modules/three/build/three.module.js";
import { OrbitControls } from "./node_modules/three/examples/jsm/controls/OrbitControls.js";

const container = document.getElementById("scene-container");

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
  45,
  container.clientWidth / container.clientHeight,
  1,
  1000
);
camera.position.set(0, 0, 50);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(container.clientWidth, container.clientHeight);
container.appendChild(renderer.domElement);

const movie1 = document.getElementById("three-video1");
const movie2 = document.getElementById("three-video2");
const movie3 = document.getElementById("three-video3");
const movie4 = document.getElementById("three-video4");
const movie5 = document.getElementById("three-video5");

movie1.src = "./assets/video06.mp4";
movie2.src = "./assets/video02.mp4";
movie3.src = "./assets/video03.mp4";
movie4.src = "./assets/video07.mp4";
movie5.src = "./assets/video05.mp4";

const videoTexture1 = new THREE.VideoTexture(movie1);
const videoTexture2 = new THREE.VideoTexture(movie2);
const videoTexture3 = new THREE.VideoTexture(movie3);
const videoTexture4 = new THREE.VideoTexture(movie4);
const videoTexture5 = new THREE.VideoTexture(movie5);

const geometry = new THREE.PlaneGeometry(30, 25);
const material = new THREE.MeshBasicMaterial({
  map: videoTexture5,
  side: THREE.DoubleSide,
});
const plane = new THREE.Mesh(geometry, material);
const plane2 = new THREE.Mesh(geometry, material);

plane.rotation.y = Math.PI / 4;
plane.position.set(-20, 2, 0);
scene.add(plane);

plane2.rotation.y = -Math.PI / 4;
plane2.position.set(20, 2, 0);
scene.add(plane2);

const sphereGeometry = new THREE.SphereGeometry(3, 32, 32);
const sphereMaterial = new THREE.MeshBasicMaterial({ color: 0x0000ff });
const spheremovieMaterial1 = new THREE.MeshBasicMaterial({
  map: videoTexture1,
});
const spheremovieMaterial2 = new THREE.MeshBasicMaterial({
  map: videoTexture2,
});
const spheremovieMaterial3 = new THREE.MeshBasicMaterial({
  map: videoTexture3,
});
const spheremovieMaterial4 = new THREE.MeshBasicMaterial({
  map: videoTexture4,
});
const spheremovieMaterial5 = new THREE.MeshBasicMaterial({
  map: videoTexture5,
});

const sphere = new THREE.Mesh(sphereGeometry, spheremovieMaterial5);

sphere.position.set(0, 0, 10);
scene.add(sphere);

const sphereA = new THREE.Mesh(sphereGeometry, spheremovieMaterial5);
sphereA.position.set(-20, -8, 20);
scene.add(sphereA);

const sphereE = new THREE.Mesh(sphereGeometry, spheremovieMaterial4);
sphereE.position.set(20, -8, 20);
scene.add(sphereE);

const sphereB = new THREE.Mesh(sphereGeometry, spheremovieMaterial1);
sphereB.position.set(-10, -8, 20);
scene.add(sphereB);

const sphereC = new THREE.Mesh(sphereGeometry, spheremovieMaterial2);
sphereC.position.set(0, -8, 20);
scene.add(sphereC);

const sphereD = new THREE.Mesh(sphereGeometry, spheremovieMaterial3);
sphereD.position.set(10, -8, 20);
scene.add(sphereD);

const controls = new OrbitControls(camera, renderer.domElement);

renderer.render(scene, camera);

function draw() {
  // videoTexture.needsUpdate = true;
  renderer.render(scene, camera);
  requestAnimationFrame(draw);
}

draw();
