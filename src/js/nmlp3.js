import * as THREE from '../apps/threejs/build/three.module.js';
import { OrbitControls } from '../apps/threejs/modules/jsm/controls/OrbitControls.js';
import { VRButton } from '../apps/threejs/modules/jsm/webxr/VRButton.js';
import { GLTFLoader } from '../apps/threejs/modules/jsm/loaders/GLTFLoader.js';
import { MMDLoader } from '../apps/threejs/modules/jsm/loaders/MMDLoader.js';
import { MMDAnimationHelper  } from '../apps/threejs/modules/jsm/animation/MMDAnimationHelper.js';
import { VRM } from '../apps/threejs/modules/jsm/libs/three-vrm.module.js';

export class Nmlp3
{
    constructor() {
        this.clock = new THREE.Clock();

        this.camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 2000 );

        this.scene = new THREE.Scene();

        this.cameraContainer = new THREE.Object3D();
        this.cameraContainer.add(this.camera);
        this.scene.add(this.cameraContainer);

        this.renderer = new THREE.WebGLRenderer({
            antialias: true,
            alpha: true
        });
        //this.renderer.setClearColor(0x000000, 0);
        this.renderer.setPixelRatio( window.devicePixelRatio );
        this.renderer.setSize( window.innerWidth, window.innerHeight );

        //this.renderer.xr.enabled = true;
        //this.renderer.xr.setReferenceSpaceType("local");

        //this.effect = new OutlineEffect( renderer );
        this.effect = this.renderer;

        this.directionalLight = new THREE.DirectionalLight( 0x887766 );
        this.directionalLight.position.set( - 1, 1, 1 ).normalize();
        this.scene.add( this.directionalLight );

        this.controls = new OrbitControls(this.camera, this.renderer.domElement );
        this.controls.minDistance = 1;
        this.controls.maxDistance = 1000;

        this.container = document.getElementById("three");
        this.container.appendChild(this.renderer.domElement);

        //document.body.appendChild( VRButton.createButton( this.renderer ) );

        this.helper = new MMDAnimationHelper({
            afterglow: 2.0
        });

        window.addEventListener("resize", () => {
            this.camera.aspect = window.innerWidth / window.innerHeight;
            this.camera.updateProjectionMatrix();
            this.effect.setSize(window.innerWidth, window.innerHeight);
        });

        this.start();
    }

    load(fileName, position, anim, target) {
        let loader;
        console.log(fileName);
        switch (fileName.replace(/(.+)\.([^\.]+)/, '$2')) {
            case "gltf":
                loader = new GLTFLoader();
                loader.load(
                    fileName,
                    (gltf) => {
                        let mesh = gltf.scene;
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
                break;
            case "pmd":
                loader = new MMDLoader();
                loader.load(
                    fileName,
                    (mesh) => {
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
                                    target.cursor++;
                                    target.main();
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
                            target.cursor++;
                            target.main();
                        }
                    },
                    (xhr) => {
                        console.log(xhr.loaded + " loaded");
                    },
                    (error) => {
                        console.log(error);
                    }
                );
                break;
            case "vrm":
                loader = new GLTFLoader();
                loader.load(
                    fileName,
                    (mesh) => {
                        VRM.from(mesh).then((vrm) => {
                            console.log("vrm");
                            mesh = vrm.scene;
                            mesh.position.x = position[0];
                            mesh.position.y = position[1];
                            mesh.position.z = position[2];

                            this.scene.add(mesh);
                            target.cursor++;
                            target.main()
                        });
                    },
                    (xhr) => {
                        console.log(xhr.loaded + " loaded");
                    },
                    (error) => {
                        console.log(error);
                    }
                );
                break;
            default:
        }

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

