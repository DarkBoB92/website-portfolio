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
  // Show the modal by setting display to block
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.style.display = "block";
  }
}

/***** MODAL CLOSE FUNCTION WITH VIDEO STOP *****/
function closeModal(modalId) {
  // 1. Get the modal element
  const modal = document.getElementById(modalId);
  if (!modal) return;

  // 2. Hide the modal
  modal.style.display = "none";

  // VIDEO STOP CODE: Reset each iframe's src to stop playback
  const iframes = modal.querySelectorAll('iframe');
  iframes.forEach((iframe) => {
    // Option A: "Reload" the same src
    // iframe.src = iframe.src;

    // Option B: Clear src, then restore (forces a full stop & reset to 0)
    const oldSrc = iframe.src;
    iframe.src = "";
    iframe.src = oldSrc;
  });
}

/***** CLOSE MODAL BY CLICKING OUTSIDE *****/
window.onclick = function(event) {
  if (event.target.classList.contains('modal')) {
    // Instead of just hiding it, call the same closeModal logic so videos stop
    closeModal(event.target.id);
  }
};
