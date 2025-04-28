// Load html and callback after loading is complete
export function loadHTML(id, url, callback) {
  fetch(url)
    .then(response => {
      if (!response.ok) throw new Error("HTTP error " + response.status);
      return response.text();
    })
    .then(data => {
      document.getElementById(id).innerHTML = data;
      if (callback) callback(); // call your listener-setup code
    })
    .catch(err => console.error("Fetch error:", err));
}

function loadFooter(id, url) {
  loadHTML(id, url, function () {
    const settingsBtn = document.getElementById("settingsIcon");
    if (settingsBtn) {
      settingsBtn.addEventListener("click", function () {
        alert("Settings Button in child.html clicked!");
      });
    }

    const infoBtn = document.getElementById("infoIcon");
    if (infoBtn) {
      infoBtn.addEventListener("click", function () {
        alert("Info Button in child.html clicked!");
      });
    }
  });
}

async function loadSVGMarker(url) {
    console.log("In SVG marker");
    const response = await fetch(url);
    const svgText = await response.text();

    const loader = new SVGLoader();
    const svgData = loader.parse(svgText);

    const path = svgData.paths[0]; // just first path
    const shapes = SVGLoader.createShapes(path);
    const shape = shapes[0];

    const markerGeometry = new THREE.ShapeGeometry(shape);
    const markerMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000, side: THREE.DoubleSide });
    const markerMesh = new THREE.Mesh(markerGeometry, markerMaterial);

    markerMesh.scale.set(0.01, 0.01, 0.01);
    markerMesh.rotation.x = -Math.PI / 2; // optional, point upward

    return markerMesh;
}

// Make globally accessible
window.loadHTML = loadHTML;
window.loadFooter = loadFooter;
window.loadSVGMarker = loadSVGMarker;