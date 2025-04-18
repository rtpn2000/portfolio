// script.js

// Handling the 'Home' Page.
document.addEventListener("DOMContentLoaded", function () {
  // Initialize falling stars
  createStars();
  // Initially hide the game cards container
  document.getElementById("cardcontainer").style.display = "none";
  document.getElementById("quest").style.display = "none";
  // Start typing effect for title and then intro
  typeTitle();
  setTimeout(typeIntro, 2500);
  setTimeout(showCards, 4500); // Displays the game cards after the title has appeared.
});

// Typing effect for the title.
const titleText = "Hi, This is Ravi Tarun Prasad Nimmalapudi.";
let i = 0;
function typeTitle() {
  const titleElement = document.getElementById("title");
  if (titleElement) {
      if (i <titleText.length) {
          titleElement.innerHTML += titleText.charAt(i);
          i++;
          setTimeout(typeTitle, 65);
      }
  }
}

// Typing effect for intro text
const introText = "Welcome to my portfolio!";
let j = 0;
function typeIntro() {
  const introElement = document.getElementById("intro");
  if (introElement) {
      if (j < introText.length) {
          introElement.innerHTML += introText.charAt(j);
          j++;
          setTimeout(typeIntro, 70);
      }
  }
}

// Game cards section title.
const questText = "Select a quest to begin!";

// Displays game cards.
function showCards() {
  const cardsContainer = document.getElementById("cardcontainer");
  cardsContainer.style.display = "flex";

  const quest = document.getElementById("quest");
  quest.innerHTML = questText;
  quest.style.display = "block";
}

// On-click functionality.
function navigateTo(page) {
  window.location.href = page;
}

// Function to generate falling stars dynamically
function createStars(numStars = 100) {
  const background = document.querySelector(".background");
  for (let i = 0; i < numStars; i++) {
      let star = document.createElement("div");
      star.classList.add("star");
      // Random Position & Animation
      let x = Math.random() * window.innerWidth;
      let y = Math.random() * window.innerHeight;
      let duration = Math.random() * 5 + 3;
      star.style.left = `${x}px`;
      star.style.top = `${y}px`;
      star.style.animation = `moveStars ${duration}s linear infinite`;
      background.appendChild(star);
      setTimeout(() => {
          star.remove();
          createStars(1);
      }, duration * 1000);
  }
}

// Handling 'Modals'-1.
function openModal(id) {
  document.getElementById(id).style.display = 'block';
}

// Handling 'Modals'-2.
function closeModal(id) {
  document.getElementById(id).style.display = 'none';
}

// Closes modal if clicking outside the modal content.
window.onclick = function(event) {
  const modals = document.querySelectorAll(".modal");
  modals.forEach(modal => {
    if (event.target === modal) {
      modal.style.display = "none";
    }
  });
};

// Handling 'Resume' Modal.
document.addEventListener('DOMContentLoaded', () => {
  const modal = document.getElementById('resumeModal');
  const btn = document.getElementById('resumeBtn');
  const closeBtn = document.querySelector('.close-btn');

  btn.addEventListener('click', (e) => {
    e.preventDefault();
    modal.style.display = 'block';
  });

  closeBtn.addEventListener('click', () => {
    modal.style.display = 'none';
  });

  window.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.style.display = 'none';
    }
  });
});

// Matches nav‑link and add .active - Glows current page.
document.addEventListener('DOMContentLoaded', () => {
  const path = window.location.pathname.split('/').pop();
  document.querySelectorAll('.nav-links a').forEach(a => {
    if (a.getAttribute('href') === path) {
      a.classList.add('active');
    }
  });
});