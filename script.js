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

/***** Smooth Scrolling (existing functionality) *****/
document.querySelectorAll('nav ul li a').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    e.preventDefault();
    document.querySelector(this.getAttribute('href')).scrollIntoView({
      behavior: 'smooth'
    });
  });
});

/***** MODAL FUNCTIONALITY *****/
// 1. Grab all "More Details" buttons 
const openModalBtns = document.querySelectorAll('.open-modal-btn');
// 2. Grab all close buttons (the 'x')
const closeBtns = document.querySelectorAll('[data-close]');
// 3. Handle opening modal
openModalBtns.forEach(button => {
  button.addEventListener('click', () => {
    const modalSelector = button.getAttribute('data-modal-target');
    const modal = document.querySelector(modalSelector);
    modal.classList.add('active');
  });
});
// 4. Handle closing modal 
closeBtns.forEach(button => {
  button.addEventListener('click', () => {
    const modal = button.closest('.modal');
    modal.classList.remove('active');
  });
});
// 5. Close if user clicks outside modal-content
window.addEventListener('click', (e) => {
  if (e.target.classList.contains('modal')) {
    e.target.classList.remove('active');
  }
});
// Smooth scroll for nav links (if you want to keep this)
document.querySelectorAll('nav ul li a').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    e.preventDefault();
    document.querySelector(this.getAttribute('href')).scrollIntoView({
      behavior: 'smooth'
    });
  });
});

function openModal(modalId) {
  document.getElementById(modalId).style.display = "block";
}

function closeModal(modalId) {
  document.getElementById(modalId).style.display = "none";
}

// (Optional) Close if user clicks outside the modal-content
window.onclick = function(event) {
  if (event.target.classList.contains('modal')) {
    event.target.style.display = "none";
  }
}
