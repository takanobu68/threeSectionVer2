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

const movie1 = document.getElementById("three-video1");
const movie2 = document.getElementById("three-video2");
const movie3 = document.getElementById("three-video3");
const movie4 = document.getElementById("three-video4");
const movie5 = document.getElementById("three-video5");

movie1.src = "./assets/video01.mp4";
movie2.src = "./assets/video02.mp4";
movie3.src = "./assets/video03.mp4";
movie4.src = "./assets/video04.mp4";
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
  // transparent: true,
  // opacity: 0.7,
  // alphaMap: 0x00ff00,
  // opacity: 0.1,
  // transparency: true,
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
sphereA.name = "sphere-A";
scene.add(sphereA);

const sphereE = new THREE.Mesh(sphereGeometry, spheremovieMaterial4);
sphereE.position.set(20, -8, 20);
sphereE.name = "sphere-E";
scene.add(sphereE);

const sphereB = new THREE.Mesh(sphereGeometry, spheremovieMaterial1);
sphereB.position.set(-10, -8, 20);
sphereB.name = "sphere-B";
scene.add(sphereB);

const sphereC = new THREE.Mesh(sphereGeometry, spheremovieMaterial2);
sphereC.position.set(0, -8, 20);
sphereC.name = "sphere-C";
scene.add(sphereC);

const sphereD = new THREE.Mesh(sphereGeometry, spheremovieMaterial3);
sphereD.position.set(10, -8, 20);
sphereD.name = "sphere-D";
scene.add(sphereD);

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
  videoTexture5.needsUpdate = true;
  renderer.render(scene, camera);
  requestAnimationFrame(draw);
}

draw();
