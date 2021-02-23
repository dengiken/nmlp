// UNDER CONSTRUCTION
import * as THREE from '../apps/threejs/build/three.module.js';
import { OrbitControls } from '../apps/threejs/modules/jsm/controls/OrbitControls.js';
import { ARButton } from '../apps/threejs/modules/jsm/webxr/ARButton.js';
import { GLTFLoader } from '../apps/threejs/modules/jsm/loaders/GLTFLoader.js';
import { MMDLoader } from '../apps/threejs/modules/jsm/loaders/MMDLoader.js';
import { MMDAnimationHelper  } from '../apps/threejs/modules/jsm/animation/MMDAnimationHelper.js';

class Nmlp3
{
    constructor() {
        this.clock = new THREE.Clock();

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

        this.helper = new MMDAnimationHelper({
            afterglow: 2.0
        });

        window.addEventListener("resize", () => {
            this.camera.aspect = window.innerWidth / window.innerHeight;
            this.camera.updateProjectionMatrix();
            this.effect.setSize(window.innerWidth, window.innerHeight);
        });
    }

    load(fileName, position, anim, target) {
        let loader, getMesh;
        console.log(fileName);
        switch (fileName.replace(/(.+)\.([^\.]+)/, '$2')) {
            case "gltf":
                loader = new GLTFLoader();
                getMesh = (mesh) => {
                    return mesh.scene;
                };
                break;
            case "pmd":
                loader = new MMDLoader();
                getMesh = (mesh) => {
                    return mesh;
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

                if (anim) {
                    loader.loadAnimation(
                        anim,
                        mesh,
                        (vmd) => {
                            console.log(vmd);
                            this.helper.add(mesh, {animation:vmd,physics:false});
                            this.scene.add(mesh);
                            /*
                            helper.setAnimation(mesh);
                            loader.createAnimation(mesh, vmd);
                            helper.unifyAnimationDuration({afterglow: 1.0});
                            */
                        },
                        (xhr) => {
                            console.log(xhr.loaded + " loaded(animation)");
                        },
                        (error) => {
                            console.log(error);
                        }
                    );
                } else {
                    this.scene.add(mesh);
                }

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
        this.renderer.setAnimationLoop(() => {
            this.helper.update(this.clock.getDelta());
            this.effect.render(this.scene, this.camera)
        });
    }

    render(target) {
        target.render(this.scene, this.camera);
    }

    orbitTarget(x, y, z) {
        this.controls.target = new THREE.Vector3(x, y, z);
    }
}

nmlp3 = new Nmlp3();
nmlp3.start();
