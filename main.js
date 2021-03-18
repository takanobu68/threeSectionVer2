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

// 動画が流れるオブジェクトの初期配置設定
const initialSettingMovie = document.getElementById("initial-setting-movie");
// srcはjs側で設定しないと不具合が出る
initialSettingMovie.src = "./assets/video01.mp4";
const initialSettingVideoTexture = new THREE.VideoTexture(initialSettingMovie);

// geometry,materialは変更の可能性があるので、詳細な命名はしない
const geometry = new THREE.PlaneGeometry(30, 25);
const material = new THREE.MeshBasicMaterial({
  map: initialSettingVideoTexture,
  side: THREE.DoubleSide,
});

// Plane作成を関数化
createPlane("left");
createPlane("right");

function createPlane(position) {
  const planePos = position === "left" ? true : false;
  const plane = new THREE.Mesh(geometry, material);
  plane.rotation.y = planePos ? Math.PI / 4 : -Math.PI / 4;
  planePos ? plane.position.set(-20, 2, 0) : plane.position.set(20, 2, 0);
  scene.add(plane);
}

// 中央に配置するsphereの設定
// sphereGeometryは他のsphereにも使用
const sphereGeometry = new THREE.SphereGeometry(3, 32, 32);
const centerSpheremovieMaterial = new THREE.MeshBasicMaterial({
  map: initialSettingVideoTexture,
});
const centerSphere = new THREE.Mesh(sphereGeometry, centerSpheremovieMaterial);
centerSphere.position.set(0, 0, 10);
scene.add(centerSphere);

// 手前に配置する5つのsphereの設定
// forEachによる一括配置
const frontSpheres = document.querySelectorAll(".front");

const frontSpherePos = [-20, -10, 0, 10, 20];
frontSpheres.forEach((el, i) => {
  el.src = `./assets/video0${i + 1}.mp4`;
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
  // videoTexture5.needsUpdate = true;
  renderer.render(scene, camera);
  requestAnimationFrame(draw);
}

draw();
