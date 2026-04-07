// script.js

document.addEventListener("DOMContentLoaded", function () {
  createStars();

  const cardContainer = document.getElementById("cardcontainer");
  const quest = document.getElementById("quest");

  if (cardContainer) cardContainer.style.display = "none";
  if (quest) quest.style.display = "none";

  typeTitle();
  setTimeout(typeIntro, 2500);
  setTimeout(showCards, 4500);
});

const titleText = "Hi, This is Ravi Tarun Prasad Nimmalapudi.";
let i = 0;

function typeTitle() {
  const titleElement = document.getElementById("title");
  if (titleElement && i < titleText.length) {
    titleElement.innerHTML += titleText.charAt(i);
    i++;
    setTimeout(typeTitle, 65);
  }
}

const introText = "Welcome to my portfolio!";
let j = 0;

function typeIntro() {
  const introElement = document.getElementById("intro");
  if (introElement && j < introText.length) {
    introElement.innerHTML += introText.charAt(j);
    j++;
    setTimeout(typeIntro, 70);
  }
}

const questText = "Select a quest to begin!";

function showCards() {
  const cardsContainer = document.getElementById("cardcontainer");
  const quest = document.getElementById("quest");

  if (cardsContainer) cardsContainer.style.display = "flex";
  if (quest) {
    quest.innerHTML = questText;
    quest.style.display = "block";
  }
}

function navigateTo(page) {
  window.location.href = page;
}

function createStars(numStars = 100) {
  const background = document.querySelector(".background");
  if (!background) return;

  for (let index = 0; index < numStars; index++) {
    const star = document.createElement("div");
    star.classList.add("star");

    const x = Math.random() * window.innerWidth;
    const y = Math.random() * window.innerHeight;
    const duration = Math.random() * 5 + 3;

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

function openModal(id) {
  const modal = document.getElementById(id);
  if (modal) {
    modal.style.display = "flex";
  }
}

function closeModal(id) {
  const modal = document.getElementById(id);
  if (modal) {
    modal.style.display = "none";
  }
}

window.onclick = function (event) {
  const modals = document.querySelectorAll(".modal");
  modals.forEach((modal) => {
    if (event.target === modal) {
      modal.style.display = "none";
    }
  });
};

document.addEventListener("DOMContentLoaded", () => {
  const modal = document.getElementById("resumeModal");
  const btn = document.getElementById("resumeBtn");
  const closeBtn = document.getElementById("resumeCloseBtn");

  if (!modal || !btn || !closeBtn) {
    return;
  }

  btn.addEventListener("click", (e) => {
    e.preventDefault();
    modal.style.display = "flex";
  });

  closeBtn.addEventListener("click", () => {
    modal.style.display = "none";
  });

  window.addEventListener("click", (e) => {
    if (e.target === modal) {
      modal.style.display = "none";
    }
  });
});

document.addEventListener("DOMContentLoaded", () => {
  const path = window.location.pathname.split("/").pop();
  document.querySelectorAll(".nav-links a").forEach((a) => {
    if (a.getAttribute("href") === path) {
      a.classList.add("active");
    }
  });
});

const contactBtn = document.getElementById("contactBtn");
const contactModal = document.getElementById("contactModal");
const closeContactBtn = document.getElementById("closeContactBtn");

if (contactBtn && contactModal && closeContactBtn) {
  contactBtn.addEventListener("click", (e) => {
    e.preventDefault();
    contactModal.style.display = "flex";
  });

  closeContactBtn.addEventListener("click", () => {
    contactModal.style.display = "none";
  });

  window.addEventListener("click", (e) => {
    if (e.target === contactModal) {
      contactModal.style.display = "none";
    }
  });
}

const nbaModal = document.getElementById("nbaModal");
const openNBAModal = document.getElementById("openNBAModal");
const nbaCloseBtn = document.getElementById("nbaCloseBtn");

if (nbaModal && openNBAModal && nbaCloseBtn) {
  openNBAModal.addEventListener("click", (e) => {
    e.preventDefault();
    nbaModal.style.display = "block";
    const divElement = document.getElementById("vizNBA");
    if (!divElement) return;

    divElement.innerHTML = `<object class='tableauViz' style='display:none;'>
    <param name='host_url' value='https%3A%2F%2Fpublic.tableau.com%2F' />
    <param name='embed_code_version' value='3' />
    <param name='site_root' value='' />
    <param name='name' value='CPSC5320_VA3_NBA_Shotchart_Team3/NBAShotChart' />
    <param name='tabs' value='no' />
    <param name='toolbar' value='yes' />
    <param name='static_image' value='https://public.tableau.com/static/images/CP/CPSC5320_VA3_NBA_Shotchart_Team3/NBAShotChart/1.png' />
    <param name='animate_transition' value='yes' />
    <param name='display_static_image' value='yes' />
    <param name='display_spinner' value='yes' />
    <param name='display_overlay' value='yes' />
    <param name='display_count' value='yes' />
    <param name='language' value='en-GB' />
  </object>`;

    setTimeout(loadTableauViz, 300);
  });

  nbaCloseBtn.addEventListener("click", () => {
    nbaModal.style.display = "none";
  });

  window.addEventListener("click", (event) => {
    if (event.target === nbaModal) {
      nbaModal.style.display = "none";
    }
  });
}

function loadTableauViz() {
  const divElement = document.getElementById("vizNBA");
  if (!divElement) return;

  const vizElement = divElement.getElementsByTagName("object")[0];
  if (!vizElement) return;

  const width = divElement.offsetWidth || window.innerWidth;
  const preferredHeight = Math.round(width * 0.75);
  const minHeight = window.innerWidth <= 480 ? 320 : 420;
  const maxHeight = Math.round(window.innerHeight * 0.72);

  vizElement.style.width = "100%";
  vizElement.style.height = Math.max(minHeight, Math.min(preferredHeight, maxHeight)) + "px";

  const scriptElement = document.createElement("script");
  scriptElement.src = "https://public.tableau.com/javascripts/api/viz_v1.js";
  vizElement.parentNode.insertBefore(scriptElement, vizElement);
}

const kanyeModal = document.getElementById("kanyeModal");
const openKanyeModal = document.getElementById("openKanyeModal");
const kanyeCloseBtn = document.getElementById("kanyeCloseBtn");

if (kanyeModal && openKanyeModal && kanyeCloseBtn) {
  openKanyeModal.addEventListener("click", (e) => {
    e.preventDefault();
    kanyeModal.style.display = "block";
    const divElement = document.getElementById("vizKanye");
    if (!divElement) return;

    divElement.innerHTML = `<object class='tableauViz' style='display:none;'>
    <param name='host_url' value='https%3A%2F%2Fpublic.tableau.com%2F' />
    <param name='embed_code_version' value='3' />
    <param name='site_root' value='' />
    <param name='name' value='TwitteratiReactionAnalysis_KanyeWest_VA7_Team3/TwitteratiReactionAnalysis' />
    <param name='tabs' value='no' />
    <param name='toolbar' value='yes' />
    <param name='static_image' value='https://public.tableau.com/static/images/Tw/TwitteratiReactionAnalysis_KanyeWest_VA7_Team3/TwitteratiReactionAnalysis/1.png' />
    <param name='animate_transition' value='yes' />
    <param name='display_static_image' value='yes' />
    <param name='display_spinner' value='yes' />
    <param name='display_overlay' value='yes' />
    <param name='display_count' value='yes' />
    <param name='language' value='en-GB' />
  </object>`;

    setTimeout(loadKanyeViz, 300);
  });

  kanyeCloseBtn.addEventListener("click", () => {
    kanyeModal.style.display = "none";
  });

  window.addEventListener("click", (event) => {
    if (event.target === kanyeModal) {
      kanyeModal.style.display = "none";
    }
  });
}

function loadKanyeViz() {
  const divElement = document.getElementById("vizKanye");
  if (!divElement) return;

  const vizElement = divElement.getElementsByTagName("object")[0];
  if (!vizElement) return;

  const width = divElement.offsetWidth || window.innerWidth;
  const preferredHeight = Math.round(width * 0.75);
  const minHeight = window.innerWidth <= 480 ? 320 : 420;
  const maxHeight = Math.round(window.innerHeight * 0.72);

  vizElement.style.width = "100%";
  vizElement.style.height = Math.max(minHeight, Math.min(preferredHeight, maxHeight)) + "px";

  const scriptElement = document.createElement("script");
  scriptElement.src = "https://public.tableau.com/javascripts/api/viz_v1.js";
  vizElement.parentNode.insertBefore(scriptElement, vizElement);
}

const disneyModal = document.getElementById("disneyModal");
const openDisneyModal = document.getElementById("openDisneyModal");
const disneyCloseBtn = document.getElementById("disneyCloseBtn");

if (disneyModal && openDisneyModal && disneyCloseBtn) {
  openDisneyModal.addEventListener("click", (e) => {
    e.preventDefault();
    disneyModal.style.display = "block";
    const divElement = document.getElementById("vizDisney");
    if (!divElement) return;

    divElement.innerHTML = `<object class='tableauViz' style='display:none;'>
    <param name='host_url' value='https%3A%2F%2Fpublic.tableau.com%2F' />
    <param name='embed_code_version' value='3' />
    <param name='site_root' value='' />
    <param name='name' value='WhenToPlanA_DisneyVacay/WaitTimeDashboard' />
    <param name='tabs' value='no' />
    <param name='toolbar' value='yes' />
    <param name='static_image' value='https://public.tableau.com/static/images/Wh/WhenToPlanA_DisneyVacay/WaitTimeDashboard/1.png' />
    <param name='animate_transition' value='yes' />
    <param name='display_static_image' value='yes' />
    <param name='display_spinner' value='yes' />
    <param name='display_overlay' value='yes' />
    <param name='display_count' value='yes' />
    <param name='language' value='en-GB' />
  </object>`;

    setTimeout(loadDisneyViz, 300);
  });

  disneyCloseBtn.addEventListener("click", () => {
    disneyModal.style.display = "none";
  });

  window.addEventListener("click", (event) => {
    if (event.target === disneyModal) {
      disneyModal.style.display = "none";
    }
  });
}

function loadDisneyViz() {
  const divElement = document.getElementById("vizDisney");
  if (!divElement) return;

  const vizElement = divElement.getElementsByTagName("object")[0];
  if (!vizElement) return;

  const width = divElement.offsetWidth || window.innerWidth;
  const preferredHeight = Math.round(width * 0.75);
  const minHeight = window.innerWidth <= 480 ? 320 : 420;
  const maxHeight = Math.round(window.innerHeight * 0.72);

  vizElement.style.width = "100%";
  vizElement.style.height = Math.max(minHeight, Math.min(preferredHeight, maxHeight)) + "px";

  const scriptElement = document.createElement("script");
  scriptElement.src = "https://public.tableau.com/javascripts/api/viz_v1.js";
  vizElement.parentNode.insertBefore(scriptElement, vizElement);
}

document.addEventListener("DOMContentLoaded", function () {
  const likeBtn = document.getElementById("likeBtn");
  const likeCount = document.getElementById("likeCount");
  if (!likeBtn || !likeCount) return;

  let count = parseInt(localStorage.getItem("likeCount"), 10) || 0;
  let liked = localStorage.getItem("liked") === "true";
  likeCount.textContent = count;

  if (liked) {
    likeBtn.classList.add("liked");
  }

  likeBtn.addEventListener("click", function () {
    const wasLiked = likeBtn.classList.contains("liked");

    if (wasLiked) {
      count = Math.max(0, count - 1);
      likeBtn.classList.remove("liked");
      localStorage.setItem("liked", "false");
      showToast("I'll pretend I didn't see that!");
    } else {
      count += 1;
      likeBtn.classList.add("liked");
      localStorage.setItem("liked", "true");
      showToast("Another fan joined the cult!");
    }

    likeCount.textContent = count;
    localStorage.setItem("likeCount", count.toString());
  });
});

function showToast(message) {
  const toast = document.getElementById("like-toast");
  if (!toast) return;

  toast.textContent = message;
  toast.classList.add("show");
  setTimeout(() => {
    toast.classList.remove("show");
  }, 2000);
}
