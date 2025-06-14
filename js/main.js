body {
  background: #000;
  margin: 0;
  overflow: hidden;
}

.hudLabel {
  position: absolute;
  top: 0;
  left: 0;
  color: #000;
  font-family: 'Trebuchet MS', sans-serif;
  font-size: 15px;
  font-weight: normal;
  line-height: 24px;
  text-align: left;
  padding: 3px;
  -webkit-box-shadow: 0px 4px 8px -3px rgba(0, 0, 0, 0.75);
  -moz-box-shadow: 0px 4px 8px -3px rgba(0, 0, 0, 0.75);
  box-shadow: 0px 4px 8px -5px rgba(0, 0, 0, 0.75);
  background: rgba( 255, 255, 255, 0.8);
  display: none;
}



<script src="https://code.jquery.com/jquery-1.11.2.min.js"></script>
<script src="https://threejs.org/build/three.js">


</script>
<script src="https://threejs.org/examples/js/controls/OrbitControls.js"></script>
<script src="https://s3-eu-west-2.amazonaws.com/bckld/lab/loading.js"></script>

<script src="http://stemkoski.github.io/Three.js/js/Detector.js"></script>
<script src="http://stemkoski.github.io/Three.js/js/THREEx.KeyboardState.js"></script>
<script src="https://raw.githubusercontent.com/mrdoob/three.js/master/src/core/Raycaster.js"></script>
<script src="http://stemkoski.github.io/Three.js/js/THREEx.WindowResize.js"></script>


function _convertLatLonToVec3(lat, lon) {
  lat = lat * Math.PI / 180.0;
  lon = -lon * Math.PI / 180.0;
  return new THREE.Vector3(
    Math.cos(lat) * Math.cos(lon),
    Math.sin(lat),
    Math.cos(lat) * Math.sin(lon));
}

function InfoBox(city, radius, domElement) {
  this._screenVector = new THREE.Vector3(0, 0, 0);

  this.position = _convertLatLonToVec3(city.lat, city.lng).multiplyScalar(radius);

  // create html overlay box
  this.box = document.createElement('div');
  this.box.innerHTML = city.name;
  this.box.className = "hudLabel";

  this.domElement = domElement;
  this.domElement.appendChild(this.box);

}

InfoBox.prototype.update = function() {
  this._screenVector.copy(this.position);
  this._screenVector.project(camera);

  var posx = Math.round((this._screenVector.x + 1) * this.domElement.offsetWidth / 2);
  var posy = Math.round((1 - this._screenVector.y) * this.domElement.offsetHeight / 2);

  var boundingRect = this.box.getBoundingClientRect();

  // update the box overlays position
  this.box.style.left = (posx - boundingRect.width) + 'px';
  this.box.style.top = posy + 'px';
};

//--------------------------------
function Marker() {
  THREE.Object3D.call(this);

  var radius = 0.005;
  var sphereRadius = 0.02;
  var height = 0.05;

  var material = new THREE.MeshPhongMaterial({
    color: 0xDC143C
  });

  var cone = new THREE.Mesh(new THREE.ConeBufferGeometry(radius, height, 8, 1, true), material);
  cone.position.y = height * 0.5;
  cone.rotation.x = Math.PI;

  var sphere = new THREE.Mesh(new THREE.SphereBufferGeometry(sphereRadius, 16, 8), material);
  sphere.position.y = height * 0.95 + sphereRadius;


  this.add(cone, sphere);
}

Marker.prototype = Object.create(THREE.Object3D.prototype);

// ------ Earth object -------------------------------------------------

function Earth(radius, texture) {
  THREE.Object3D.call(this);

  this.userData.radius = radius;

  var earth = new THREE.Mesh(
    new THREE.SphereBufferGeometry(radius, 64.0, 48.0),
    new THREE.MeshPhongMaterial({
      map: texture
    })
  );

  this.add(earth);
}
var markerarry= [];
Earth.prototype = Object.create(THREE.Object3D.prototype);

Earth.prototype.createMarker = function(lat, lon) {
  var marker = new Marker();

  var latRad = lat * (Math.PI / 180);
  var lonRad = -lon * (Math.PI / 180);
  var r = this.userData.radius;

  marker.position.set(Math.cos(latRad) * Math.cos(lonRad) * r, Math.sin(latRad) * r, Math.cos(latRad) * Math.sin(lonRad) * r);
  marker.rotation.set(0.0, -lonRad, latRad - Math.PI * 0.5);

  this.add(marker);
};

// ------ Three.js code ------------------------------------------------

var scene, camera, renderer, label;
var controls;

init();

function init() {
  scene = new THREE.Scene();

  camera = new THREE.PerspectiveCamera(45, 4 / 3, 0.1, 100);
  camera.position.set(0.0, 1.5, 3.0);

  renderer = new THREE.WebGLRenderer({
    antialias: true
  });

  controls = new THREE.OrbitControls(camera, renderer.domElement);
  controls.autoRotate = true;
  controls.autoRotateSpeed = -1.0;
  controls.enablePan = false;

  var ambient = new THREE.AmbientLight(0xffffff, 0.5);
  scene.add(ambient);

  var direcitonal = new THREE.DirectionalLight(0xffffff, 0.5);
  direcitonal.position.set(5.0, 2.0, 5.0).normalize();
  scene.add(direcitonal);

  // just some code for the loading
  var manager = createLoader(renderer.domElement, animate);

  var texLoader = new THREE.TextureLoader(manager).setCrossOrigin(true);

  var texture = texLoader.load('https://s3-eu-west-2.amazonaws.com/bckld/lab/textures/earth_latlon.jpg');
  texture.anisotropy = renderer.capabilities.getMaxAnisotropy();

  var earth = new Earth(1.0, texture);

  earth.createMarker(48.856700, 2.350800); // Paris
  earth.createMarker(51.507222, -0.1275); // London
 earth.createMarker(34.050000, -118.250000); // LA
 earth.createMarker(41.836944, -87.684722); // Chicago
  earth.createMarker(35.683333, 139.683333); // Tokyo
  earth.createMarker(33.333333, 44.383333); // Baghdad
  earth.createMarker(40.712700, -74.005900); // New York

  earth.createMarker(55.750000, 37.616667); // Moscow
  earth.createMarker(35.117500, -89.971111); // Memphis
  earth.createMarker(-33.925278, 18.423889); // Cape Town
  earth.createMarker(32.775833, -96.796667); // Dallas
  earth.createMarker(52.366667, 4.900000); // Amsterdam
  earth.createMarker(42.358056, -71.063611); // Boston
  earth.createMarker(52.507222, 13.145833); // Berlin

  earth.createMarker(37.783333, -122.416667); // San Francisco

  scene.add(earth);

  //-------------
  // globe

  var radius1 = 1;

  //var sphere1 = new THREE.Mesh(new THREE.SphereGeometry(radius1, 16, 16));
  // scene.add( sphere1 );

  var city = {
    "name": "Nader Hany",
    "lat": 30,
    "lng": 30
  };

  var label = new InfoBox(city, radius1, document.body);
  var material1 = new THREE.MeshPhongMaterial({
    color: 0xDC143C
  });
  var marker1 = new THREE.Mesh(new THREE.SphereGeometry(0.05, 16, 16), material1);
  marker1.userData = {
    URL: "http://stackoverflow.com"
  };
  marker1.position.copy(label.position);
  scene.add(marker1);

  var city2 = {
    "name": "Nader Hany",
    "lat": 40,
    "lng": 40
  };
  var label2 = new InfoBox(city2, radius1, document.body);
  var geometry2 = new THREE.SphereGeometry(0.05, 16, 16);
  var material2 = new THREE.MeshPhongMaterial({
    map: THREE.ImageUtils.loadTexture('https://upload.wikimedia.org/wikipedia/commons/4/40/Egyptian_Revolution_Flag_%281952-1958%29.jpg', THREE.SphericalRefractionMapping)
  });
  var marker2 = new THREE.Mesh(geometry2, material2);

  marker2.userData = {
    URL: "http://stackoverflow.com"
  };
  marker2.position.copy(label2.position);
  scene.add(marker2);

   markerarry.push(marker1)
  markerarry.push(marker2)

  //----------------
window.onmousedown = function( event ) 
{
  // the following line would stop any other event handler from firing
  // (such as the mouse's TrackballControls)
  // event.preventDefault();
  
  const rect = renderer.domElement.getBoundingClientRect();
  const left = event.clientX - rect.left;
  const top = event.clientY - rect.top;

  const x = (left / rect.width) * 2 - 1;
  const y = - (top / rect.height) * 2 + 1;
  
  const raycaster = new THREE.Raycaster();
  raycaster.ray.origin.setFromMatrixPosition(camera.matrixWorld);
  raycaster.ray.direction.set(x, y, 0.5).unproject(camera).sub(raycaster.ray.origin).normalize();
  
  const intersects = raycaster.intersectObjects(markerarry, true);
  console.log(intersects);

}
  //-----------------------

  window.addEventListener('resize', onResize);
  onResize();

  document.body.appendChild(renderer.domElement);



}

function onResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
  //  label.update();

  requestAnimationFrame(animate);

  controls.update();

  renderer.render(scene, camera);
}
