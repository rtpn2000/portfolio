document.addEventListener("DOMContentLoaded", function () {
  // Initialize falling stars
  createStars();

  // Initially hide the game cards container
  document.getElementById("cardcontainer").style.display = "none";
  document.getElementById("quest").style.display = "none";

  // Start typing effect for title and then intro
  typeTitle();
  setTimeout(typeIntro, 2500); // Adjusted delay for better flow
  setTimeout(showCards, 4500); // Show cards after intro is done
  
});

// Typing effect for the title
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

const questText = "Select a quest to begin!";

function showCards() {
  const cardsContainer = document.getElementById("cardcontainer");
  cardsContainer.style.display = "flex";

  const quest = document.getElementById("quest");
  quest.innerHTML = questText;
  quest.style.display = "block";
}

function navigateTo(page) {
  window.location.href = page;
}

// Function to generate falling stars dynamically
// Function to generate falling stars dynamically
function createStars(numStars = 100) {
  const background = document.querySelector(".background");

  for (let i = 0; i < numStars; i++) {
      let star = document.createElement("div");
      star.classList.add("star");

      // Random Position & Animation
      let x = Math.random() * window.innerWidth;
      let y = Math.random() * window.innerHeight;
      let duration = Math.random() * 5 + 3; // Different speeds for a natural effect

      star.style.left = `${x}px`;
      star.style.top = `${y}px`;
      star.style.animation = `moveStars ${duration}s linear infinite`;

      background.appendChild(star);

      // Remove stars and regenerate them to create a continuous effect
      setTimeout(() => {
          star.remove();
          createStars(1); // Create a new star when one is removed
      }, duration * 1000);
  }
}

function openModal(id) {
  document.getElementById(id).style.display = 'block';
}

function closeModal(id) {
  document.getElementById(id).style.display = 'none';
}

// Optional: close modal if clicking outside the modal content
window.onclick = function(event) {
  const modals = document.querySelectorAll(".modal");
  modals.forEach(modal => {
    if (event.target === modal) {
      modal.style.display = "none";
    }
  });
};

// On page load, find the matching nav‑link and add .active
document.addEventListener('DOMContentLoaded', () => {
  const path = window.location.pathname.split('/').pop();
  document.querySelectorAll('.nav-links a').forEach(a => {
    if (a.getAttribute('href') === path) {
      a.classList.add('active');
    }
  });
});