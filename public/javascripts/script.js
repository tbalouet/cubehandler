var MOVE_PACE   = 2;
var ROTATE_PACE = 0.02;

var stats, scene, renderer;
var geometry, material, mesh;
var camera, cameraControls;

var keyboard;

window.onload = function(){
    if( init() )
        animate();
}

// init the scene
function init(){

    renderer    = new THREE.CanvasRenderer();//CanvasRenderer doesn't need lights to render texture
    renderer.setSize( window.innerWidth, window.innerHeight );
    document.body.appendChild(renderer.domElement);

    keyboard    = new THREEx.KeyboardState();//Init Keyboard

    // add Stats.js - https://github.com/mrdoob/stats.js
    stats = new Stats();
    stats.domElement.style.position	= 'absolute';
    stats.domElement.style.bottom	= '0px';
    document.body.appendChild( stats.domElement );

    // create a scene
    scene = new THREE.Scene();

    // put a camera in the scene
    camera      = new THREE.PerspectiveCamera( 50, window.innerWidth / window.innerHeight, 1, 10000 );//(fov, aspect, near, far)
    camera.position.set(0, 0, 1000);
    scene.add(camera);

    // create a camera contol
    cameraControls	= new THREEx.DragPanControls(camera)

    // transparently support window resize
    THREEx.WindowResize.bind(renderer, camera);
    // allow 'p' to make screenshot
    THREEx.Screenshot.bindKey(renderer);
    // allow 'f' to go fullscreen where this feature is supported
    if( THREEx.FullScreen.available() ){
        THREEx.FullScreen.bindKey();
        document.getElementById('inlineDoc').innerHTML	+= "- <i>f</i> for fullscreen";
    }

    geometry    = new THREE.CubeGeometry( 200, 200, 200 );//(width, height, depth)
    material    = new THREE.MeshLambertMaterial({
        map: THREE.ImageUtils.loadTexture('images/crate.jpg')
    });

    mesh	    = new THREE.Mesh( geometry, material );
    scene.add( mesh );
    return true;
}

// animation loop
function animate() {

    requestAnimationFrame( animate );
    inputUpdates();

    // do the render
    render();

    // update stats
    stats.update();
}

// render the scene
function render() {

    // update camera controls
    cameraControls.update();

    // actually render the scene
    renderer.render( scene, camera );
}

function inputUpdates(){
    var doRotate    = keyboard.pressed("ctrl");

    if( keyboard.pressed("left") || keyboard.pressed("q") ){
        (doRotate ? mesh.rotateY(-ROTATE_PACE) : mesh.translateX(-MOVE_PACE));
    }
    else if( keyboard.pressed("right") || keyboard.pressed("d") ){
        (doRotate ? mesh.rotateY(ROTATE_PACE) : mesh.translateX(MOVE_PACE));
    }
    if( keyboard.pressed("up") || keyboard.pressed("z") ){
        (doRotate ? mesh.rotateX(-ROTATE_PACE) : mesh.translateY(MOVE_PACE));
    }
    else if( keyboard.pressed("down") || keyboard.pressed("s") ){
        (doRotate ? mesh.rotateX(ROTATE_PACE) : mesh.translateY(-MOVE_PACE));
    }
}