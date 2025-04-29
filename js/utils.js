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

function showIdleScreen() {
    const header = document.getElementById('header');
    const logo = document.getElementById('logo');
    const title = document.getElementById('title');
    
    header.classList.add('fullscreen');

  setTimeout(() => {
    const headerRect = header.getBoundingClientRect();
    const centerX = headerRect.width / 2;
    const centerY = headerRect.height / 2;

    const logoOffsetX = centerX - (logo.offsetLeft + logo.offsetWidth / 2);
    const logoOffsetY = centerY - logo.offsetHeight - 10 - (logo.offsetTop + logo.offsetHeight / 2);

    const titleOffsetX = centerX - (title.offsetLeft + title.offsetWidth / 2)+200;
    const titleOffsetY = centerY + 10 - (title.offsetTop + title.offsetHeight / 2);

    logo.style.transform = `translate(${logoOffsetX}px, ${logoOffsetY}px)`;
    title.style.transform = `translate(${titleOffsetX}px, ${titleOffsetY}px)`;

    // Start breathing animation after scale animation completes (delay of 0.8s)
    setTimeout(() => {
      title.classList.add('breathing'); // Start breathing animation
    }, 800); // After 0.8s to match the scale transition duration
  }, 300); // Delay for smoother effect
}

function restoreToActiveScreen() {
    const header = document.getElementById('header');
    const logo = document.getElementById('logo');
    const title = document.getElementById('title');
    
    logo.style.transform = `translate(0, 0)`;
    title.style.transform = `translate(0, 0)`;
    title.classList.remove('breathing'); // Remove breathing effect when restoring

    setTimeout(() => {
        header.classList.remove('fullscreen');
    }, 300);
}

// Make globally accessible
window.loadHTML = loadHTML;
window.loadFooter = loadFooter;
window.loadSVGMarker = loadSVGMarker;
window.showIdleScreen = showIdleScreen;
window.restoreToActiveScreen = restoreToActiveScreen;
