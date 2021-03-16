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

const geometry = new THREE.PlaneGeometry(30, 25);
const material = new THREE.MeshBasicMaterial({
  color: 0xffff00,
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
const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);

sphere.position.set(0, 0, 10);
scene.add(sphere);

const sphereA = new THREE.Mesh(sphereGeometry, sphereMaterial);
sphereA.position.set(-20, -8, 20);
scene.add(sphereA);

const sphereE = new THREE.Mesh(sphereGeometry, sphereMaterial);
sphereE.position.set(20, -8, 20);
scene.add(sphereE);

const sphereB = new THREE.Mesh(sphereGeometry, sphereMaterial);
sphereB.position.set(-10, -8, 20);
scene.add(sphereB);

const sphereC = new THREE.Mesh(sphereGeometry, sphereMaterial);
sphereC.position.set(0, -8, 20);
scene.add(sphereC);

const sphereD = new THREE.Mesh(sphereGeometry, sphereMaterial);
sphereD.position.set(10, -8, 20);
scene.add(sphereD);

const controls = new OrbitControls(camera, renderer.domElement);

renderer.render(scene, camera);

function draw() {
  renderer.render(scene, camera);
  requestAnimationFrame(draw);
}

draw();
