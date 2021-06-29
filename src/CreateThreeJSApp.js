import * as THREE from 'https://cdn.skypack.dev/three';
import { GLTFLoader } from 'https://cdn.skypack.dev/three/examples/jsm/loaders/GLTFLoader.js';
import { VRButton } from 'https://cdn.skypack.dev/three/examples/jsm/webxr/VRButton.js';

const uuidv4 = () => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

const createController = ( controllerId, cameraGroup, renderer ) => {
    const controller = renderer.xr.getController( controllerId );
    const cylinderGeometry = new THREE.CylinderGeometry( 0.025, 0.025, 1, 32 );
    const cylinderMaterial = new THREE.MeshPhongMaterial( {color: 0xffff00} );
    const cylinder = new THREE.Mesh( cylinderGeometry, cylinderMaterial );
    cylinder.geometry.translate( 0, 0.5, 0 );
    cylinder.rotateX( - 0.25 * Math.PI );
    controller.add( cylinder );
    cameraGroup.add( controller );

    // TRIGGER
    controller.addEventListener( 'selectstart', () => { cylinderMaterial.color.set( 0xff0000 ) } );
    controller.addEventListener( 'selectend', () => { cylinderMaterial.color.set( 0xffff00 ) } );
    return controller;
}

const createRenderer = () => {
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize( window.innerWidth, window.innerHeight );
    renderer.outputEncoding = THREE.sRGBEncoding;
    document.body.appendChild( VRButton.createButton( renderer ) );
    renderer.xr.enabled = true;
    document.body.appendChild( renderer.domElement );
    return renderer;
}

const createCanvas = (
    {
        useControllers,
    }
) => {
    const cameraGroup = new THREE.Group();
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
    cameraGroup.add( camera );
    scene.add(cameraGroup);

    const light = new THREE.PointLight( 0xffffff, 10, 100, 1);
    light.position.set( 50, 50, 50 );
    scene.add( light );

    const renderer = createRenderer();

    const controllers = {
        left: null,
        right: null,
    }

    if (useControllers) {
        controllers.left = createController(0, cameraGroup, renderer);
        controllers.right = createController(1, cameraGroup, renderer);
    }

    let lastTimeMsec = null
    const animationLoops = {};
    renderer.setAnimationLoop((nowMsec) => {
        lastTimeMsec	= lastTimeMsec || nowMsec-1000/60
        const deltaMsec	= Math.min(200, nowMsec - lastTimeMsec)
        lastTimeMsec	= nowMsec
        Object.keys(animationLoops).forEach(key => {
            const loop = animationLoops[key];
            loop({ delta: deltaMsec / 1000, now: nowMsec / 1000});
        });
        renderer.render(scene, camera);
    });

    const listItems = (child, level = 0) => {
        console.log(`${' '.repeat(level)}${level ? '- ' : ''}${child.name}`)
        if (child.children.length) {
            child.children.forEach(subChild => listItems(subChild, level + 1))
        }
    }

    return {
        scene,
        camera,
        light,
        loadObject: (path, callback) => {
            const loader = new GLTFLoader();
            loader.load(
                path,
                gltf => callback(gltf.scene),
                undefined,
                error => console.error(error)
            );
        },
        addAnimationLoop: loop => {
            const uuid = uuidv4();
            animationLoops[uuid] = loop;
            return () => {
                delete animationLoops[uuid];
            }
        },
        controllers,
        listItems,
    };
}

const CreateThreeJSApp = (callback, options = {}) => {
    callback(createCanvas({
        useControllers: false,
        ...options,
    }));
}

export { CreateThreeJSApp }
