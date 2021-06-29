import { CreateThreeJSApp } from './CreateThreeJSApp.js';
import * as THREE from 'https://cdn.skypack.dev/three';
import THREEx from '../vendor/threex/laserbeam.js';

const App = () => {
    CreateThreeJSApp((
        {
            camera,
            scene,
            light,
            loadObject,
            addAnimationLoop,
            listItems,
        }
    ) => {
        const spotlight = new THREE.DirectionalLight( 0xffffee );
        spotlight.position.set( 0, 6, 0 );
        spotlight.castShadow = true;
        spotlight.shadow.camera.top = 2;
        spotlight.shadow.camera.bottom = - 2;
        spotlight.shadow.camera.right = 2;
        spotlight.shadow.camera.left = - 2;
        spotlight.shadow.mapSize.set( 4096, 4096 );
        scene.add( spotlight );

        light.castShadow = true;

        const floorGeometry = new THREE.PlaneGeometry( 1000, 1000, 2 );
        const floorMaterial = new THREE.MeshStandardMaterial( {
            color: 0xff0000,
            roughness: 5.0,
            metalness: 0.5
        });
        const floor = new THREE.Mesh( floorGeometry, floorMaterial );
        floor.rotation.x = - Math.PI / 2;
        floor.receiveShadow = true;
        scene.add( floor );

        floor.opacity = 0.5;

        floor.position.y = -5.9;
        camera.position.z = 30;

        loadObject('k9/scene.gltf', k9 => {
            k9.position.z = 20;
            k9.position.y = -5.9;
            k9.position.x = 3;
            k9.rotation.y = 0.7;
            listItems(k9);
            scene.add(k9);
        });

        loadObject('tardis/scene.gltf', tardis => {
            tardis.position.z = -20;
            tardis.rotation.y = -0.4;
            scene.add(tardis);
        });

    }, {
        useControllers: true
    });
}

export { App };
