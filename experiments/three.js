var scene, camera, renderer, controls;
var geometry, materialNormal, materialSelected;
var cubes = [];
var raycaster = new THREE.Raycaster();
var mouse = new THREE.Vector2();

var objects = [];

init();
animate();

function onMouseMove( event ) {
	mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
	mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
	raycaster.setFromCamera( mouse, camera );	
	var intersects = raycaster.intersectObjects( scene.children );
	if ( intersects.length > 0 ) {
		if (intersects[0].object.userData.type == 0) {
			intersects[0].object.userData.type = 2;
			intersects[0].object.material = materialSelected;
		} else {
			intersects[0].object.userData.type = 3;
			intersects[0].object.visible = false;
		}
	}	
}

function init() {
	scene = new THREE.Scene();

	renderer = new THREE.WebGLRenderer();
	renderer.setSize( window.innerWidth, window.innerHeight );

	camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 10000 );
	camera.position.z = 5;
	
	controls = new THREE.OrbitControls( camera, renderer.domElement );
	controls.enableDamping = true;
	controls.dampingFactor = 0.25;
	controls.enableZoom = true;

	geometry = new THREE.BoxGeometry( 1, 1, 1 );
	materialNormal = new THREE.MeshBasicMaterial( { color: 0xffffff, wireframe: true } );
	materialSelected = new THREE.MeshBasicMaterial( { color: 0xff0000, wireframe: true } );

	for (var i = 0; i < 4; i++) {
		if (!objects[i]) {
			objects[i] = [];
		}
		for (var j = 0; j < 4; j++) {
			if (!objects[i][j]) {
				objects[i][j] = [];
			}
			for (var k = 0; k < 4; k++) {
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
}
	
function hideX(index) {
	if (index <= objects.length) {
		for (var i = 0; i < index; i++) {
			for (var j = 0; j < 4; j++) {
				for (var k = 0; k < 4; k++) {
					objects[i][j][k].visible = false;
				}
			}
		}
		for (var ii = index; ii < 4; ii++) {
				for (var jj = 0; jj < 4; jj++) {
					for (var kk = 0; kk < 4; kk++) {
						objects[ii][jj][kk].visible = true;
					}
				}
		}
	}
}	

function hideY(index) {
	if (index <= objects.length) {
		for (var i = 0; i < 4; i++) {
			for (var j = 0; j < index; j++) {
				for (var k = 0; k < 4; k++) {
					objects[i][j][k].visible = false;
				}
			}
		}
		for (var ii = 0; ii < 4; ii++) {
				for (var jj = index; jj < 4; jj++) {
					for (var kk = 0; kk < 4; kk++) {
						objects[ii][jj][kk].visible = true;
					}
				}
		}
	}
}	

function hideZ(index) {
	if (index <= objects.length) {
		for (var i = 0; i < 4; i++) {
			for (var j = 0; j < 4; j++) {
				for (var k = 0; k < index; k++) {
					objects[i][j][k].visible = false;
				}
			}
		}
		for (var ii = 0; ii < 4; ii++) {
				for (var jj = 0; jj < 4; jj++) {
					for (var kk = index; kk < 4; kk++) {
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
