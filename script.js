// Connect to Socket.IO server
const socket = io('http://localhost:3000');

socket.on('connect', () => {
  console.log('Connected to server');
});

// Store other player positions
const otherPlayers = {};

socket.on('playerMovement', (data) => {
  // If the player doesn't exist, create a new cube for them
  if (!otherPlayers[data.playerId]) {
const geometry = new THREE.BoxGeometry();
    const material = new THREE.MeshBasicMaterial( { color: 0xff0000 } );
    otherPlayers[data.playerId] = new THREE.Mesh( geometry, material );
    scene.add( otherPlayers[data.playerId] );
  }

  // Update the player's position
  otherPlayers[data.playerId].position.x = data.position.x;
  otherPlayers[data.playerId].position.y = data.position.y;
  otherPlayers[data.playerId].position.z = data.position.z;
});

// Initialize Three.js scene, camera, and renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

// Create a cube
const geometry = new THREE.BoxGeometry();
const material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
const cube = new THREE.Mesh( geometry, material );
scene.add( cube );

camera.position.z = 5;

// Player movement
const moveSpeed = 0.1;
document.addEventListener('keydown', (event) => {
  switch (event.key) {
    case 'w':
      camera.position.z -= moveSpeed;
      break;
    case 's':
      camera.position.z += moveSpeed;
      break;
    case 'a':
      camera.position.x -= moveSpeed;
      break;
    case 'd':
      camera.position.x += moveSpeed;
      break;
  }

  // Send player position to server
  socket.emit('playerMovement', { position: camera.position });
});

// Animation loop
function animate() {
  requestAnimationFrame( animate );
	cube.rotation.x += 0.01;
	cube.rotation.y += 0.01;
  renderer.render( scene, camera );
}
animate();
