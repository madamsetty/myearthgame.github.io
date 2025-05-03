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

    // Make the header fullscreen
    header.classList.add('fullscreen');

    // Delay to allow for smooth transition
    setTimeout(() => {
        // Get the dimensions and position of the header
        const headerRect = header.getBoundingClientRect();
        const centerX = headerRect.width / 2;
        const centerY = headerRect.height / 2;

        // Calculate the offset for the logo to center it
        const logoRect = logo.getBoundingClientRect();
        const logoOffsetX = centerX - (logoRect.left + logoRect.width / 2);
        const logoOffsetY = centerY - (logoRect.top + logoRect.height / 2); // Adjusted Y offset for logo

        // Calculate the offset for the title to center it
        const titleRect = title.getBoundingClientRect();
        const titleOffsetX = centerX - (titleRect.left + titleRect.width / 2) + 75; // Adjusted X offset for title
        const titleOffsetY = centerY - (titleRect.top + titleRect.height / 2) + 100; // Adjusted Y offset for title

        // Apply the calculated translation to the logo and title
        logo.style.transform = `translate(${logoOffsetX}px, ${logoOffsetY}px)`;
        title.style.transform = `translate(${titleOffsetX}px, ${titleOffsetY}px)`;

        // Start the breathing animation for the title after 0.8s delay (to match scaling transition)
        setTimeout(() => {
            title.classList.add('breathing'); // Start breathing animation
        }, 800); // After 0.8s delay for smooth transition
    }, 300); // Initial delay for smoother effect when the fullscreen header is applied
}

function restoreToActiveScreen() {
    const header = document.getElementById('header');
    const logo = document.getElementById('logo');
    const title = document.getElementById('title');
    
    if(logo) {
        logo.style.transform = `translate(0, 0)`;
        title.style.transform = `translate(0, 0)`;
        title.classList.remove('breathing'); // Remove breathing effect when restoring
    }
    setTimeout(() => {
        header.classList.remove('fullscreen');
    }, 300);
}

function getImageUrl(name) {
  // note that this does not include files in subdirectories
  return new URL(`./dir/${name}.png`, import.meta.url).href
}

// Make globally accessible
window.loadHTML = loadHTML;
window.loadFooter = loadFooter;
window.loadSVGMarker = loadSVGMarker;
window.showIdleScreen = showIdleScreen;
window.restoreToActiveScreen = restoreToActiveScreen;
window.getImageUrl = getImageUrl;
