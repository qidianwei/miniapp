import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import 'three-platformize';

export class SceneManager {
  constructor(canvas) {
    if (!canvas || !canvas.width) {
      throw new Error('Invalid canvas element');
    }

    // 使用平台适配器
    this.platformize = new Platformize({ canvas });
    this.physics = new PlatformizePhysics(this.platformize);
    
    // 替换原有Three.js初始化
    this.scene = new this.platformize.THREE.Scene();
    this.camera = new this.platformize.THREE.PerspectiveCamera(75, canvas.width/canvas.height, 0.1, 1000);
    this.renderer = new THREE.WebGLRenderer({ 
      canvas,
      antialias: false,
      context: canvas.getContext('webgl', {
        alpha: true,
        premultipliedAlpha: false
      })
    });
    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();
    
    this.initCamera();
    this.initLighting();
  }

  initCamera() {
    this.camera.position.set(0, 5, 8);
    this.camera.lookAt(0, 0, 0);
  }

  initLighting() {
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(5, 5, 5);
    this.scene.add(ambientLight, directionalLight);
  }

  async loadModel(url) {
    const loader = new GLTFLoader();
    const gltf = await loader.loadAsync(url);
    this.scene.add(gltf.scene);
    return gltf;
  }
} 