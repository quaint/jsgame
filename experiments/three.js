var scene, camera, renderer, controls;
var geometry, materialNormal, materialSelected;
var cubes = [];
var raycaster = new THREE.Raycaster();
var mouse = new THREE.Vector2();

var objects = [];
var xSize = 4;
var ySize = 4;
var zSize = 4;

init();
animate();

/*
 * 0 - filled block
 * 1 - empty block
 * 2 - touched filled block
 * 3 - touched empty block
 */

function onMouseMove( event ) {
	mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
	mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
	raycaster.setFromCamera( mouse, camera );	
	var intersects = raycaster.intersectObjects( scene.children );
	if ( intersects.length > 0 ) {
		if (intersects[0].object.userData.type == 0) {
			intersects[0].object.userData.type = 2;
			intersects[0].object.material = materialSelected;
		} else if (intersects[0].object.userData.type == 1) {
			intersects[0].object.userData.type = 3;
			intersects[0].object.visible = false;
		}
	}	
}

function init() {
	scene = new THREE.Scene();
	
	renderer = new THREE.WebGLRenderer();
	renderer.setSize( window.innerWidth, window.innerHeight );
	renderer.setClearColor( 0xffffff );

	camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 10000 );
	camera.position.z = 6;
	
	controls = new THREE.OrbitControls( camera, renderer.domElement );
	controls.enableDamping = true;
	controls.dampingFactor = 0.25;
	controls.enableZoom = true;
	
	var loader = new THREE.TextureLoader();
	loader.load('crate.jpg', function ( texture ) {
		materialNormal = new THREE.MeshBasicMaterial( { map: texture } );
		materialSelected = new THREE.MeshBasicMaterial( { color: 0xff0000, map: texture } );
		geometry = new THREE.BoxGeometry( 1, 1, 1 );

		for (var i = 0; i < xSize; i++) {
			if (!objects[i]) {
				objects[i] = [];
			}
			for (var j = 0; j < ySize; j++) {
				if (!objects[i][j]) {
					objects[i][j] = [];
				}
				for (var k = 0; k < zSize; k++) {
					var mesh = new THREE.Mesh( geometry, materialNormal );
					mesh.position.x = i - 1.5;
					mesh.position.y = j - 1.5;
					mesh.position.z = k - 1.5;
					mesh.userData = { type : Math.random() > 0.5 ? 0 : 1 };
					objects[i][j][k] = mesh;
					scene.add( mesh );
				}
			}
		}
		
		document.body.appendChild( renderer.domElement );
		window.addEventListener( 'mousedown', onMouseMove, false );
	});
}
	
function hideX(index) {
	if (index <= xSize) {
		for (var i = 0; i < index; i++) {
			for (var j = 0; j < ySize; j++) {
				for (var k = 0; k < zSize; k++) {
					objects[i][j][k].visible = false;
				}
			}
		}
		for (var ii = index; ii < xSize; ii++) {
				for (var jj = 0; jj < ySize; jj++) {
					for (var kk = 0; kk < zSize; kk++) {
						objects[ii][jj][kk].visible = true;
					}
				}
		}
	}
}	

function hideY(index) {
	if (index <= ySize) {
		for (var i = 0; i < xSize; i++) {
			for (var j = 0; j < index; j++) {
				for (var k = 0; k < zSize; k++) {
					objects[i][j][k].visible = false;
				}
			}
		}
		for (var ii = 0; ii < xSize; ii++) {
				for (var jj = index; jj < ySize; jj++) {
					for (var kk = 0; kk < zSize; kk++) {
						objects[ii][jj][kk].visible = true;
					}
				}
		}
	}
}	

function hideZ(index) {
	if (index <= zSize) {
		for (var i = 0; i < xSize; i++) {
			for (var j = 0; j < ySize; j++) {
				for (var k = 0; k < index; k++) {
					objects[i][j][k].visible = false;
				}
			}
		}
		for (var ii = 0; ii < xSize; ii++) {
				for (var jj = 0; jj < ySize; jj++) {
					for (var kk = index; kk < zSize; kk++) {
						objects[ii][jj][kk].visible = true;
					}
				}
		}
	}
}	

	
function animate() {
	requestAnimationFrame( animate );
	// mesh.rotation.x += 0.01;
	// mesh.rotation.y += 0.02;
	renderer.render( scene, camera );
}
