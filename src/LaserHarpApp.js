import { CreateThreeJSApp } from './CreateThreeJSApp.js';
import * as THREE from 'https://cdn.skypack.dev/three';
import { LaserBeam } from '../vendor/threex/laserbeam.js';
import { InteractiveLaser } from '../vendor/threex/lasercooked.js';
import * as SimpleSynth from '../vendor/simple-js-synth/simple-js-synth.js';

const createNode = context => SimpleJSSynth(
    context.destination,  // the destination
    {
        "osc1type": "triangle",
        "osc1vol": 0.5,
        "osc1tune": 0,
        "osc2type": "sawtooth",
        "osc2vol": 0.5,
        "osc2tune": 12,
        "osc3type": "square",
        "osc3vol": 0.5,
        "osc3tune": -12,
        "attack": 0,
        "decay": 0.5,
        "sustain": 0.54,
        "susdecay": 1.4,
        "cutoff": 48
    });

const App = () => {
    CreateThreeJSApp((
        {
            camera,
            scene,
            light,
            loadObject,
            addAnimationLoop,
            listItems,
            controllers,
        }
    ) => {

        // Camera follows mouse
        const mouse	= {x : 0, y : 0}
        document.addEventListener('mousemove', (event) => {
            mouse.x	= (event.clientX / window.innerWidth ) - 0.5
            mouse.y	= (event.clientY / window.innerHeight) - 0.5
        }, false)
        addAnimationLoop(({ delta, now }) => {
            camera.position.x += (mouse.x*20 - camera.position.x) * 0.01
            camera.position.y += (mouse.y*20 - camera.position.y) * 0.01
            camera.lookAt( scene.position )
        })

        // A familiar object in the background ;)
        loadObject('tardis/scene.gltf', tardis => {
            tardis.position.z = -20;
            tardis.rotation.y = -0.4;
            scene.add(tardis);
        });

        camera.position.z = 10;

        const mainLight	= new THREE.HemisphereLight( 0x00ff00, 0x101020, 0.2 )
        mainLight.position.set( 0.75, 1, 0.25 )
        scene.add(mainLight)

        // Bounding Box

        const geometry	= new THREE.BoxGeometry(1, 1, 1);
        const material	= new THREE.MeshPhongMaterial({
            color	: 0xaaa888,
            specular: 0xffffff,
            shininess: 100,
            side	: THREE.BackSide,
        });
        const boundingBox	= new THREE.Mesh( geometry, material )
        boundingBox.scale.set(10,8,10)
        // scene.add(boundingBox)

        // Swinging Taurus

        const torusGeometry	= new THREE.TorusGeometry(0.1, 0.1, 32, 32);
        const torusMaterial	= new THREE.MeshPhongMaterial({
            color	: 0xffffff,
            specular: 0xffffff,
            shininess: 200,
        });
        const torus	= new THREE.Mesh( torusGeometry, torusMaterial )
        torus.scale.set(0.2,0.2,0.2).multiplyScalar(5)
        scene.add(torus)

        addAnimationLoop(({ now }) => {
            if (controllers.right) {
                torus.position.x = controllers.right.position.x;
                torus.position.y = controllers.right.position.y;
                torus.position.z = controllers.right.position.z;
                torus.rotation.x = controllers.right.rotation.x;
                torus.rotation.y = controllers.right.rotation.y;
                torus.rotation.z = controllers.right.rotation.z;
            } else {
                const gAngle	= 0.1 * Math.PI * 2 * now
                const angle = Math.cos(gAngle)*Math.PI/15 + 3*Math.PI/2
                const radius	= 30
                torus.position.x	= Math.cos(angle)*radius
                torus.position.y	= (radius) + Math.sin(angle)*radius
                torus.position.z	= -5.1
            }
        })

        // Audio Context
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        const context = new AudioContext();

        const notes = {
            0: { freq: 261.626, node: createNode(context) },
            1: { freq: 277.183, node: createNode(context) },
            2: { freq: 293.665, node: createNode(context) },
            3: {freq: 311.127, node: createNode(context) },
            4: {freq: 329.628, node: createNode(context) },
            5: {freq: 349.228, node: createNode(context) },
            6: {freq: 369.994, node: createNode(context) },
            7: {freq: 391.995, node: createNode(context) },
            8: {freq: 415.305, node: createNode(context) },
            9: {freq: 440.000, node: createNode(context) },
            10: {freq: 466.164, node: createNode(context) },
            11: {freq: 493.883, node: createNode(context) },
        }

        const notePlay = (index, isOff) => {
            if (isOff) {
                notes[index]?.node.noteOff()
            } else {
                notes[index]?.node.noteOn(notes[index]?.freq, 1)
            }
        }

        const numberOfLasers = 12
        for(let i = 0; i < numberOfLasers; i++){
            (() => {
                const laserBeam	= LaserBeam()
                scene.add(laserBeam)
                const iLaser = new InteractiveLaser(laserBeam, scene, (isBroken) => {
                    notePlay(i, !isBroken)
                })
                addAnimationLoop(({ delta, now}) => iLaser.update(delta, now))
                addAnimationLoop(() => {
                    laserBeam.children[2].material.color.r = Math.min(1, Math.max(0.2, Math.random()))
                    laserBeam.children[1].material.color.g = Math.min(1, Math.max(0.2, Math.random()))
                    laserBeam.children[0].material.color.g = Math.min(1, Math.max(0.2, Math.random()))
                })
                laserBeam.position.x	= (i-numberOfLasers/2)/6
                laserBeam.position.y	= -4
                laserBeam.position.z    = -1;
                laserBeam.rotation.z	= Math.PI/2 + ((i - (numberOfLasers / 2)) * -0.04);
            })()
        }

        // const laserBeam = LaserBeam()
        // scene.add(laserBeam)

    }, {
        useControllers: true
    });
}

export { App };
