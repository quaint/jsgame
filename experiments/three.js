var scene, camera, renderer, controls;
var geomtry, materialNormal, materialSelected;
var cubes = [];
var raycaster = new THREE.Raycaster();
var mouse = new THREE.Vector2();

var objects = [];
var xSize = 4;
var ySize = 4;
var zSize = 4;
var materials = [];

var normalMaterial;
var markedMaterial;
var damagedMaterial;

init();
animate();

var hideXPosition = 0;
var hideYPosition = 0;
var hideZPosition = 0;

var actionMode = 0;

/*
 * 0 - filled block
 * 1 - empty block
 * 2 - destroyed filled block
 * 3 - destroyed empty block
 * 4 - marked filled block
 * 5 - marked empty block
 * 
 * action 1 - mark
 * action 2 - destroy
 */

document.onkeydown = function (e) {
    var key = e.keyCode;
    if (key == 49) actionMode = 1;
	else if (key == 50) actionMode = 2;
    else return true;
    return false;
  };

document.onkeyup = function (e) {
    var key = e.keyCode;
    if (key == 81) {
		if (hideXPosition < xSize) {
			hideXPosition++;
			hideX(hideXPosition);
		}
	} else if (key == 87) {
		if (hideXPosition > 0) {
			hideXPosition--;
			hideX(hideXPosition);
		}
	} else if (key == 65) {
		if (hideYPosition < ySize) {
			hideYPosition++;
			hideY(hideYPosition);
		}
	} else if (key == 83) {
		if (hideYPosition > 0) {
			hideYPosition--;
			hideY(hideYPosition);
		}
	} else if (key == 49 || key == 50) {
		actionMode = 0;
	} else {
		return true
	};
    return false;
};

function onMouseDown( event ) {
	mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
	mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
	raycaster.setFromCamera( mouse, camera );	
	var intersects = raycaster.intersectObjects( scene.children );
	if ( intersects.length > 0 ) {
		if (actionMode == 2) {
			if (intersects[0].object.userData.type == 0) {
				intersects[0].object.userData.type = 2;
				intersects[0].object.material = damagedMaterial;
			} else if (intersects[0].object.userData.type == 1) {
				intersects[0].object.userData.type = 3;
				intersects[0].object.visible = false;
			}
		} else if (actionMode == 1) {
			if (intersects[0].object.userData.type == 0) {
				intersects[0].object.userData.type = 4;
				intersects[0].object.material = markedMaterial;
			} else if (intersects[0].object.userData.type == 1) {
				intersects[0].object.userData.type = 5;
				intersects[0].object.material = markedMaterial;
			} else if (intersects[0].object.userData.type == 4) {
				intersects[0].object.userData.type = 0;
				intersects[0].object.material = normalMaterial;
			} else if (intersects[0].object.userData.type == 5) {
				intersects[0].object.userData.type = 1;
				intersects[0].object.material = normalMaterial;
			}
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
	loader.load('crate1.jpg', function ( texture ) {
		materials[0] = new THREE.MeshBasicMaterial( { map: texture } );
		configureMaterials();
	});
	loader.load('crate2.jpg', function ( texture ) {
		materials[1] = new THREE.MeshBasicMaterial( { map: texture } );
		configureMaterials();
	});
	loader.load('crate3.jpg', function ( texture ) {
		materials[2] = new THREE.MeshBasicMaterial( { map: texture } );
		configureMaterials();
	});
	loader.load('crate4.jpg', function ( texture ) {
		materials[3] = new THREE.MeshBasicMaterial( { map: texture } );
		configureMaterials();
	});
	loader.load('crate5.jpg', function ( texture ) {
		materials[4] = new THREE.MeshBasicMaterial( { map: texture } );
		configureMaterials();
	});
	loader.load('crate6.jpg', function ( texture ) {
		materials[5] = new THREE.MeshBasicMaterial( { map: texture } );
		configureMaterials();
	});
}
	
function configureMaterials() {
	if (materials.length < 6) {
		return;
	}
	
	normalMaterial = new THREE.MeshFaceMaterial( materials );
	markedMaterial = normalMaterial.clone();
	damagedMaterial = normalMaterial.clone();
	for (var i = 0; i < markedMaterial.materials.length; i++) {
		markedMaterial.materials[i].color.setHex(0x00ff00);
	}
	for (var i = 0; i < damagedMaterial.materials.length; i++) {
		damagedMaterial.materials[i].color.setHex(0xff0000);
	}
	
	for (var i = 0; i < xSize; i++) {
		if (!objects[i]) {
			objects[i] = [];
		}
		for (var j = 0; j < ySize; j++) {
			if (!objects[i][j]) {
				objects[i][j] = [];
			}
			for (var k = 0; k < zSize; k++) {
				var geometry = new THREE.BoxGeometry( 1, 1, 1 );
				geometry.faces[0].materialIndex = 0;
				geometry.faces[1].materialIndex = 0;
				geometry.faces[2].materialIndex = 2;
				geometry.faces[3].materialIndex = 2;
				geometry.faces[4].materialIndex = 3;
				geometry.faces[5].materialIndex = 3;
				var mesh = new THREE.Mesh( geometry, normalMaterial );
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
	window.addEventListener( 'mousedown', onMouseDown, false );
}	
	
function hideX(index) {
	if (index <= xSize && index >= 0) {
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
					if (objects[ii][jj][kk].userData.type != 3) {
						objects[ii][jj][kk].visible = true;
					}
				}
			}
		}
	}
}	

function hideY(index) {
	if (index <= ySize && index >= 0) {
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
					if (objects[ii][jj][kk].userData.type != 3) {
						objects[ii][jj][kk].visible = true;
					}
				}
			}
		}
	}
}	

function hideZ(index) {
	if (index <= zSize && index >= 0) {
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
					if (objects[ii][jj][kk].userData.type != 3) {
						objects[ii][jj][kk].visible = true;
					}
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
