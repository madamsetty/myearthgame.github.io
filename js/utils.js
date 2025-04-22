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

// Make globally accessible
window.loadHTML = loadHTML;
window.loadFooter = loadFooter;
