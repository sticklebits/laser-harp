import * as THREE from 'https://cdn.skypack.dev/three';
import { GLTFLoader } from 'https://cdn.skypack.dev/three/examples/jsm/loaders/GLTFLoader.js';
import { VRButton } from 'https://cdn.skypack.dev/three/examples/jsm/webxr/VRButton.js';

function createController( controllerId, cameraFixture, renderer ) {
    // RENDER CONTROLLER
    const controller = renderer.xr.getController( controllerId );
    const cylinderGeometry = new THREE.CylinderGeometry( 0.025, 0.025, 1, 32 );
    const cylinderMaterial = new THREE.MeshPhongMaterial( {color: 0xffff00} );
    const cylinder = new THREE.Mesh( cylinderGeometry, cylinderMaterial );
    cylinder.geometry.translate( 0, 0.5, 0 );
    cylinder.rotateX( - 0.25 * Math.PI );
    controller.add( cylinder );
    cameraFixture.add( controller );

    // TRIGGER
    controller.addEventListener( 'selectstart', () => { cylinderMaterial.color.set( 0xff0000 ) } );
    controller.addEventListener( 'selectend', () => { cylinderMaterial.color.set( 0xffff00 ) } );
}

const OldApp = () => {
    const cameraFixture = new THREE.Group();
    const loader = new GLTFLoader();
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
    cameraFixture.add( camera );
    scene.add(cameraFixture);
    const renderer = new THREE.WebGLRenderer();



    const light = new THREE.PointLight( 0xffffff, 10, 100, 1);
    light.position.set( 50, 50, 50 );
    scene.add( light );

    renderer.setSize( window.innerWidth, window.innerHeight );
    renderer.outputEncoding = THREE.sRGBEncoding;
    document.body.appendChild( VRButton.createButton( renderer ) );
    renderer.xr.enabled = true;

    document.body.appendChild( renderer.domElement );

    let skull;

    const geometry = new THREE.BoxGeometry(4, 4, 4);
    const material = new THREE.MeshBasicMaterial( { color: 0xff0000 } );
    const cube = new THREE.Mesh( geometry, material );
    cube.position.z = -10;
    // scene.add( cube );

    const points = [];
    const getRnd = range => (Math.random() * range) - (range / 2)
    for (let x = 0; x < 10; x += 1) {
        points.push(new THREE.Vector3( getRnd(4), getRnd(2), getRnd(1) ))
    }
    points.push(points[0])
    // points.push( new THREE.Vector3( - 2, 0, 0 ) );
    // points.push( new THREE.Vector3( 0, 5, 0 ) );
    // points.push( new THREE.Vector3( 5, 0, 0 ) );
    // points.push( new THREE.Vector3( 0, -5, 0 ) );
    // points.push( new THREE.Vector3( -5, 0, 0 ) );

    const lineMaterial = new THREE.LineBasicMaterial( { color: 0x0000ff } );
    const lineGeometry = new THREE.BufferGeometry().setFromPoints( points );
    const line = new THREE.Line( lineGeometry, lineMaterial );

    scene.add( line );

    camera.position.z = 5;

    loader.load( 'k9/scene.gltf', function ( gltf ) {
        skull = gltf.scene;
        skull.position.z = -5;
        skull.position.y = -2;

        // skull.scale.x = 0.2;
        // skull.scale.y = 0.2;
        // skull.scale.z = 0.2;
        // skull.add(line);
        scene.add( skull );

    }, undefined, function ( error ) {

        console.error( error );

    } );

    createController( 0, cameraFixture, renderer );
    createController( 1, cameraFixture, renderer );

    renderer.setAnimationLoop( function () {
        // cube.rotation.x += 0.01;
        // cube.rotation.y += 0.01;
        // line.rotation.x -= 0.01;
        // line.rotation.y += 0.02;
        // line.rotation.z += 0.03;
        if (skull) {
            // skull.rotation.y += 0.01;
            skull.traverse( child => {
                if ( child instanceof THREE.Mesh) {
                    // child.geometry.center();
                }
            });
        }
        renderer.render( scene, camera );

    } );
}

export { OldApp };
