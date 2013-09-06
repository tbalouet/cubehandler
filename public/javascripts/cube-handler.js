var MOVE_PACE   = 2;
var ROTATE_PACE = 0.02;
var socket;

var camera, scene, renderer;
var geometry, material, mesh;

var keyboard;

window.onload = function(){
    if( init() ){
        update();

        socket  = io.connect();
        socket.on('socketMoveCube', function (datas) {
            socketMoveCube(datas);
        });
    }
    else{
        console.log("Initialization error");
        return false;
    }
}

function init() {
    keyboard    = new THREEx.KeyboardState();//Init Keyboard

    camera      = new THREE.PerspectiveCamera( 50, window.innerWidth / window.innerHeight, 1, 10000 );//(fov, aspect, near, far)
    camera.position.z   = 1000;

    scene       = new THREE.Scene();

    geometry    = new THREE.CubeGeometry( 200, 200, 200 );//(width, height, depth)
    material    = new THREE.MeshLambertMaterial({
        map: THREE.ImageUtils.loadTexture('images/crate.jpg')
    });

    mesh        = new THREE.Mesh( geometry, material );
    scene.add( mesh );

    renderer    = new THREE.CanvasRenderer();//CanvasRenderer doesn't need lights to render texture
    renderer.setSize( window.innerWidth, window.innerHeight );

    document.body.appendChild( renderer.domElement );
    return true;
}

function update() {
    requestAnimationFrame( update );//Animation loop

    var movedDatas  = inputUpdates();
    renderer.render( scene, camera );

    if(movedDatas.length > 0){
        socket.emit('cubeMoved', movedDatas);
    }
}

function inputUpdates(){
    var doRotate    = keyboard.pressed("ctrl");
    var movedDatas  = [];

    if( keyboard.pressed("left") || keyboard.pressed("q") ){
        (doRotate ? mesh.rotateY(-ROTATE_PACE) : mesh.translateX(-MOVE_PACE));
        movedDatas.push(doRotate ? { 'mesh.rotateY' : -ROTATE_PACE } : { 'mesh.translateX' : -MOVE_PACE });
    }
    else if( keyboard.pressed("right") || keyboard.pressed("d") ){
        (doRotate ? mesh.rotateY(ROTATE_PACE) : mesh.translateX(MOVE_PACE));
        movedDatas.push(doRotate ? { 'mesh.rotateY' : ROTATE_PACE } : { 'mesh.translateX' : MOVE_PACE });
    }
    if( keyboard.pressed("up") || keyboard.pressed("z") ){
        (doRotate ? mesh.rotateX(-ROTATE_PACE) : mesh.translateY(MOVE_PACE));
        movedDatas.push(doRotate ? { 'mesh.rotateX' : -ROTATE_PACE } : { 'mesh.translateY' : MOVE_PACE });
    }
    else if( keyboard.pressed("down") || keyboard.pressed("s") ){
        (doRotate ? mesh.rotateX(ROTATE_PACE) : mesh.translateY(-MOVE_PACE));
        movedDatas.push(doRotate ? { 'mesh.rotateX' : ROTATE_PACE } : { 'mesh.translateY' : -MOVE_PACE });
    }
    return movedDatas;
}

/*
Socket.io emitted function
 */
function socketMoveCube(datas){
    for(var i=0; i < datas.length; ++i){
        for(var key in datas[i]){
            eval(key + "(" + datas[i][key] + ")");
        }
    }
}