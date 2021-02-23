// UNDER CONSTRUCTION
import * as THREE from '../apps/threejs/build/three.module.js';
import { OrbitControls } from '../apps/threejs/modules/jsm/controls/OrbitControls.js';
import { ARButton } from '../apps/threejs/modules/jsm/webxr/ARButton.js';
import { GLTFLoader } from '../apps/threejs/modules/jsm/loaders/GLTFLoader.js';

class Nmlp3
{
    constructor() {
        this.camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 2000 );
        //this.camera.position.z = 180;
        //this.camera.position.y = 50;

        this.scene = new THREE.Scene();

        this.renderer = new THREE.WebGLRenderer({
            antialias: true,
            alpha: true
        });
        //this.renderer.setClearColor(0x000000, 0);
        this.renderer.setPixelRatio( window.devicePixelRatio );
        this.renderer.setSize( window.innerWidth, window.innerHeight );
        //this.renderer.xr.enabled = true;

        //this.effect = new OutlineEffect( renderer );
        this.effect = this.renderer;

        this.directionalLight = new THREE.DirectionalLight( 0x887766 );
        this.directionalLight.position.set( - 1, 1, 1 ).normalize();
        this.scene.add( this.directionalLight );

        this.controls = new OrbitControls(this.camera, this.renderer.domElement );
        this.controls.minDistance = 10;
        this.controls.maxDistance = 1000;

        this.container = document.getElementById("three");
        this.container.appendChild(this.renderer.domElement);

        window.addEventListener("resize", () => {
            this.camera.aspect = window.innerWidth / window.innerHeight;
            this.camera.updateProjectionMatrix();
            this.effect.setSize(window.innerWidth, window.innerHeight);
        });
    }

    load(fileName, position, target) {
        let loader, getMesh;
        console.log(fileName);
        switch (fileName.replace(/(.+)\.([^\.]+)/, '$2')) {
            case "gltf":
                loader = new GLTFLoader();
                getMesh = (mesh) => {
                    return mesh.scene;
                };
                break;
            default:
        }

        loader.load(
            fileName,
            (mesh) => {
                mesh = getMesh(mesh);
                mesh.position.x = position[0];
                mesh.position.y = position[1];
                mesh.position.z = position[2];
                this.scene.add(mesh);
                target.cursor++;
                target.main()
            },
            (xhr) => {
                console.log(xhr.loaded + " loaded");
            },
            (error) => {
                console.log(error);
            }
        );
    }

    start() {
        this.renderer.setAnimationLoop(() => {this.effect.render(this.scene, this.camera)});
    }

    render(target) {
        target.render(this.scene, this.camera);
    }

}

nmlp3 = new Nmlp3();
nmlp3.start();
