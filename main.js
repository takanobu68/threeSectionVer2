import * as THREE from "./node_modules/three/build/three.module.js";
import { OrbitControls } from "./node_modules/three/examples/jsm/controls/OrbitControls.js";
import { gsap } from "./node_modules/gsap/all.js";

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

const movies = document.querySelectorAll(".video");
const initMovie = document.getElementById("initMovie");
const initVideoTexture = new THREE.VideoTexture(initMovie);

const geometry = new THREE.PlaneGeometry(30, 25);
const material = new THREE.MeshBasicMaterial({
  map: initVideoTexture,
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
const spheremovieMaterial = new THREE.MeshBasicMaterial({
  map: initVideoTexture,
});
const sphere = new THREE.Mesh(sphereGeometry, spheremovieMaterial);
sphere.position.set(0, 0, 10);
scene.add(sphere);

const frontSpherePos = [-20, -10, 0, 10, 20];
movies.forEach((el, i) => {
  const videoTexture = new THREE.VideoTexture(el);

  const videoMaterial = new THREE.MeshBasicMaterial({
    map: videoTexture,
  });
  const sphere = new THREE.Mesh(sphereGeometry, videoMaterial);
  sphere.position.set(frontSpherePos[i], -8, 20);
  sphere.name = `sphere-${i + 1}`;
  scene.add(sphere);
});

const rayCast = new THREE.Raycaster();
const mouse = new THREE.Vector2();
let items = [];
const arrow = new THREE.ArrowHelper(
  rayCast.ray.direction,
  camera.position,
  10,
  0xff0000
);
scene.add(arrow);

container.addEventListener("click", startMovingImage);

function startMovingImage(e) {
  if (items.length) {
    items[0].object.material.opacity = 1;
    items[0].object.material.transparent = false;
  }

  mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
  mouse.y = (e.clientY / window.innerHeight) * -2 + 1;

  useRaycast();
}

function useRaycast() {
  rayCast.setFromCamera(mouse, camera);
  arrow.setDirection(rayCast.ray.direction);
  items = rayCast.intersectObjects(scene.children);
  console.log(items[0].object.name);
  if (items[0].object.name) {
    items.forEach((target) => moveSphere(target));
  }
}

let saveTargetOriginalPos = [];

function moveSphere(target) {
  const targetPos = target.object.position;
  const targetMaterial = target.object.material;

  saveTargetOriginalPos = new THREE.Vector3(
    targetPos.x,
    targetPos.y,
    targetPos.z
  );

  moveOn(targetPos, targetMaterial);
}

function moveOn(targetPos, targetMaterial) {
  gsap.to(targetPos, {
    x: sphere.position.x,
    y: sphere.position.y,
    z: sphere.position.z,
    duration: 3,
    onStart: () => {
      container.removeEventListener("click", startMovingImage);
    },
    onComplete: () => {
      moveOnComplete(targetPos, targetMaterial);
    },
  });
}

function moveOnComplete(targetPos, targetMaterial) {
  sphere.material.map.image.setAttribute("src", targetMaterial.map.image.src);
  sphere.material.map.image.setAttribute("loop", true);
  sphere.material.map.image.play();

  goBack(targetPos);

  targetMaterial.opacity = 0.5;
  targetMaterial.transparent = true;
  container.addEventListener("click", startMovingImage);
}

function goBack(targetPos) {
  gsap.to(targetPos, {
    x: saveTargetOriginalPos.x,
    y: saveTargetOriginalPos.y,
    z: saveTargetOriginalPos.z,
    delay: 0.5,
  });
}

const controls = new OrbitControls(camera, renderer.domElement);

renderer.render(scene, camera);

function draw() {
  initVideoTexture.needsUpdate = true;
  renderer.render(scene, camera);
  requestAnimationFrame(draw);
}

draw();
