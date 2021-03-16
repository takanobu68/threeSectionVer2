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
camera.position.set(0, 0, 30);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(container.clientWidth, container.clientHeight);
container.appendChild(renderer.domElement);

const geometry = new THREE.PlaneGeometry(20, 15);
const material = new THREE.MeshBasicMaterial({
  color: 0xffff00,
  side: THREE.DoubleSide,
});
const plane = new THREE.Mesh(geometry, material);
const plane2 = new THREE.Mesh(geometry, material);

plane.rotation.y = 10;
plane.position.set(-12, 2, 0);
scene.add(plane);

plane2.rotation.y = -10;
plane2.position.set(12, 2, 0);
scene.add(plane2);

const controls = new OrbitControls(camera, renderer.domElement);

renderer.render(scene, camera);

function draw() {
  renderer.render(scene, camera);
  requestAnimationFrame(draw);
}

draw();
