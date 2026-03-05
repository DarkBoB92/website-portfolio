/***** NAVBAR TOGGLE *****/
function toggleMenu() {
  const navLinks = document.querySelector(".nav-links");
  const hamburger = document.querySelector(".hamburger");

  navLinks.classList.toggle("active");
  hamburger.classList.toggle("active");
}

// Close menu when clicking a link (on mobile)
document.querySelectorAll(".nav-links a").forEach(link => {
  link.addEventListener("click", () => {
    document.querySelector(".nav-links").classList.remove("active");
    document.querySelector(".hamburger").classList.remove("active");
  });
});

/***** SMOOTH SCROLL *****/
document.querySelectorAll('nav ul li a').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    e.preventDefault();
    document.querySelector(this.getAttribute('href')).scrollIntoView({
      behavior: 'smooth'
    });
  });
});

/***** (Unused) "More Details" Logic - Not Active *****/
// If not using data attributes, you can remove all references to openModalBtns, etc.
// ...

/***** MODAL OPEN FUNCTION *****/
function openModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.add("show");
    document.body.classList.add("modal-open");
  }
}

/***** MODAL CLOSE FUNCTION WITH VIDEO STOP *****/
function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (!modal) return;

  modal.classList.remove("show");
  document.body.classList.remove("modal-open");

  // Stop embedded video playback
  const iframes = modal.querySelectorAll("iframe");
  iframes.forEach((iframe) => {
    const oldSrc = iframe.src;
    iframe.src = "";
    iframe.src = oldSrc;
  });
}

/***** CLOSE MODAL BY CLICKING OUTSIDE *****/
window.onclick = function (event) {
  if (event.target.classList.contains("modal")) {
    closeModal(event.target.id);
  }
};

/***** CLOSE MODAL WITH ESC *****/
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    const openModalEl = document.querySelector(".modal.show");
    if (openModalEl) closeModal(openModalEl.id);
  }
});
