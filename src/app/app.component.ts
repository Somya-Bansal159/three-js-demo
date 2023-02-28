import { Component, ViewChild, ElementRef } from '@angular/core';
import * as THREE from 'three';
import gsap from 'gsap';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'threejs';
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  renderer: THREE.WebGLRenderer;
  sizes = {
    width: window.innerWidth,
    height: window.innerHeight
  }
  geometry: THREE.SphereGeometry;
  material: THREE.MeshStandardMaterial;
  mesh: THREE.Mesh;
  @ViewChild('myCanvas', {static: true}) myCanvas: ElementRef;
  
  constructor()
  {
    // Create sphere
    this.scene = new THREE.Scene()
    this. geometry = new THREE.SphereGeometry(3, 64, 64);
    this. material = new THREE.MeshStandardMaterial({
      color: "#00ff83",
      roughness: 0.5
    });
    this. mesh = new THREE.Mesh(this.geometry, this.material);
    this.scene.add(this.mesh);

    // Light
    const light = new THREE.PointLight(0xffffff, 1.25, 100);
    light.position.set(10, 0, 10);
    this.scene.add(light);

    // Camera
    this.camera = new THREE.PerspectiveCamera(45, this.sizes.width/this.sizes.height);
    this.camera.position.z = 10
    this.scene.add(this.camera);

    
    window.addEventListener('resize', () => {
      // console.log("window size changed");
      this.sizes.width = window.innerWidth;
      this.sizes.height = window.innerHeight;
      this.camera.aspect = this.sizes.width/this.sizes.height;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(this.sizes.width, this.sizes.height);
    });

  }

  ngAfterViewInit() {
    // console.log(this.myCanvas.nativeElement);
    const canvas = this.myCanvas.nativeElement;
    this.renderer = new THREE.WebGLRenderer({canvas});
    this.renderer.setSize(this.sizes.width, this.sizes.height);
    this.renderer.setPixelRatio(2);
    this.renderer.render(this.scene, this.camera);


    const controls = new OrbitControls(this.camera, canvas);
    controls.enableDamping = true;
    controls.enablePan = false;
    controls.enableZoom = false;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 5;

    const loop = () => {
      // this.mesh.position.x += 0.01;
      controls.update();
      this.renderer.render(this.scene, this.camera);
      window.requestAnimationFrame(loop);
    }
    loop();

    //tiemline
    const t1 = gsap.timeline({defaults: {duration: 1}});
    t1.fromTo(this.mesh.scale, {z:0, x:0, y:0}, {z:1, y:1, x:1});
    t1.fromTo('nav', {y: '-100%'}, {y: '0%'});
    t1.fromTo('.title', {opacity: 0}, {opacity: 1});

    let mousedown = false;
    let rgb = [];
    window.addEventListener("mousedown", () => (mousedown=true));
    window.addEventListener("mouseup", () => (mousedown=false));
    window.addEventListener("mousemove", (e) => {
      if(mousedown) {
        console.log("mousedown");
        rgb = [
          Math.round((e.pageX / this.sizes.width) * 255),
          Math.round((e.pageY / this.sizes.height) * 255),
          150
        ];
        let rgbstring = "rgb(" + rgb.join(",") + ")"
        let newcolor = new THREE.Color(rgbstring);
        gsap.to((<any>this.mesh.material).color, {r: newcolor.r, g: newcolor.g, b: newcolor.b});
      }
    })
  }

}
