import * as THREE from 'https://cdn.skypack.dev/three';

const InteractiveLaser = function(laserBeam, scene, onBreak){
    // for update loop
    const baseURL = 'https://sticklebits.github.io/laser-harp/';
    const updateFcts = []
    this.update	= function(){
        updateFcts.forEach(function(updateFct){
            updateFct()
        })
    }

    // build THREE.Sprite for impact
    var textureUrl	= `${baseURL}images/green_particle.jpg`
    var texture	= new THREE.TextureLoader().load(textureUrl)
    var material	= new THREE.SpriteMaterial({
        map		: texture,
        blending	: THREE.AdditiveBlending,
    })
    var sprite	= new THREE.Sprite(material)
    sprite.scale.x = 0.01
    sprite.scale.y = 0.05;
    sprite.rotation.x = 0.5;
    sprite.position.x	= 1;
    laserBeam.add(sprite)

    // add a point light
    var light	= new THREE.PointLight( 0x00ff00 );
    light.intensity	= 0.1;
    light.distance	= 4;
    light.position.x= -0.05;
    this.light	= light
    sprite.add(light)

    // to exports last intersects
    this.lastIntersects	= []

    var raycaster	= new THREE.Raycaster()
    // TODO assume laserBeam.position are worldPosition. works IFF attached to scene
    raycaster.ray.origin.copy(laserBeam.position)

    var isBroken = false;

    updateFcts.push(function(){
        // get laserBeam matrixWorld
        laserBeam.updateMatrixWorld();
        var matrixWorld	= laserBeam.matrixWorld.clone()
        // set the origin
        raycaster.ray.origin.setFromMatrixPosition(matrixWorld)
        // keep only the rotation
        matrixWorld.setPosition(new THREE.Vector3(0,0,0))
        // set the direction
        raycaster.ray.direction.set(1,0,0)
            .applyMatrix4( matrixWorld )
            .normalize()

        var intersects		= raycaster.intersectObjects( scene.children );
        if( intersects.length > 0 ){
            var position	= intersects[0].point
            var distance	= position.distanceTo(raycaster.ray.origin)
            laserBeam.scale.x	= distance
            if (!isBroken) {
                onBreak?.(true)
                isBroken = true
            }
        }else{
            if (isBroken) {
                onBreak?.(false)
                isBroken = false
            }
            laserBeam.scale.x	= 10
        }
        // backup last intersects
        this.lastIntersects	= intersects
    }.bind(this));
}

export {  InteractiveLaser };
