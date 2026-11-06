/* RE:BOOT / Interactive gallery — no framework, no backend, GitHub Pages ready. */
"use strict";

// --- Mobile navigation ---
const menuToggle = document.getElementById("menu-toggle");
const primaryNav = document.getElementById("primary-nav");
const closeMenu = () => {
  primaryNav.classList.remove("is-open");
  menuToggle.setAttribute("aria-expanded", "false");
  menuToggle.setAttribute("aria-label", "Open navigation");
};
menuToggle.addEventListener("click", () => {
  const isOpen = primaryNav.classList.toggle("is-open");
  menuToggle.setAttribute("aria-expanded", String(isOpen));
  menuToggle.setAttribute("aria-label", isOpen ? "Close navigation" : "Open navigation");
});
primaryNav.querySelectorAll("a").forEach(link => link.addEventListener("click", closeMenu));
window.addEventListener("keydown", event => { if (event.key === "Escape") closeMenu(); });

// --- Gallery, topic filters, photographer filters and accessible lightbox ---
const categoryNames = { problem: "The problem", solutions: "The solutions", process: "Behind the scenes" };
const galleryGrid = document.getElementById("photo-grid");
const galleryCount = document.getElementById("gallery-count");
const authorFilter = document.getElementById("author-filter");
const categoryButtons = [...document.querySelectorAll(".filter-button")];
let activeCategory = "all";
let activeAuthor = "all";
let visiblePhotos = [...galleryPhotos];
let lightboxIndex = 0;
let lightboxOpener = null;

function makePhotoCard(photo, index) {
  const button = document.createElement("button");
  button.type = "button";
  button.className = "photo-card";
  button.setAttribute("aria-label", `Open photo ${photo.id}: ${photo.title}, by Student ${photo.author.toUpperCase()}`);
  const visual = document.createElement("div");
  visual.className = "photo-card-visual";
  const img = document.createElement("img");
  img.src = photo.src;
  img.alt = photo.description;
  img.loading = index < 3 ? "eager" : "lazy";
  img.decoding = "async";
  visual.append(img);

  const tag = document.createElement("span");
  tag.className = "photo-card-tag";
  tag.textContent = categoryNames[photo.category] ?? photo.category;
  visual.append(tag);
  if (photo.demo) {
    const demoBadge = document.createElement("span");
    demoBadge.className = "photo-demo";
    demoBadge.textContent = "SAMPLE VISUAL";
    visual.append(demoBadge);
  }
  const expand = document.createElement("span");
  expand.className = "photo-expand";
  expand.setAttribute("aria-hidden", "true");
  expand.textContent = "↗";
  visual.append(expand);

  const info = document.createElement("div");
  info.className = "photo-card-info";
  const description = document.createElement("div");
  const title = document.createElement("h3");
  title.textContent = photo.title;
  const author = document.createElement("p");
  author.textContent = `PHOTO BY STUDENT ${photo.author.toUpperCase()}`;
  description.append(title, author);
  const count = document.createElement("span");
  count.className = "photo-card-index";
  count.textContent = String(photo.id).padStart(2, "0");
  info.append(description, count);
  button.append(visual, info);
  button.addEventListener("click", () => openLightbox(index, button));
  return button;
}

function renderGallery() {
  visiblePhotos = galleryPhotos.filter(photo =>
    (activeCategory === "all" || photo.category === activeCategory) &&
    (activeAuthor === "all" || photo.author === activeAuthor)
  );
  galleryGrid.replaceChildren(...visiblePhotos.map(makePhotoCard));
  galleryCount.textContent = `Showing ${visiblePhotos.length} of ${galleryPhotos.length} stories`;
  categoryButtons.forEach(button => {
    const current = button.dataset.category === activeCategory;
    button.classList.toggle("is-active", current);
    button.setAttribute("aria-pressed", String(current));
  });
  const allCount = categoryButtons.find(button => button.dataset.category === "all")?.querySelector("span");
  if (allCount) allCount.textContent = String(galleryPhotos.length);
}

categoryButtons.forEach(button => button.addEventListener("click", () => {
  activeCategory = button.dataset.category;
  renderGallery();
}));
authorFilter.addEventListener("change", () => {
  activeAuthor = authorFilter.value;
  renderGallery();
});

const lightbox = document.getElementById("lightbox");
const lightboxImage = document.getElementById("lightbox-image");
const lightboxClose = document.getElementById("lightbox-close");
const lightboxPrev = document.getElementById("lightbox-prev");
const lightboxNext = document.getElementById("lightbox-next");
function updateLightbox() {
  const photo = visiblePhotos[lightboxIndex];
  if (!photo) return;
  lightboxImage.src = photo.src;
  lightboxImage.alt = photo.description;
  document.getElementById("lightbox-counter").textContent = `${String(lightboxIndex + 1).padStart(2, "0")} / ${String(visiblePhotos.length).padStart(2, "0")}`;
  document.getElementById("lightbox-title").textContent = photo.title;
  document.getElementById("lightbox-description").textContent = photo.description;
  document.getElementById("lightbox-category").textContent = categoryNames[photo.category] ?? "Photo story";
  document.getElementById("lightbox-author").textContent = `PHOTO BY STUDENT ${photo.author.toUpperCase()}`;
}
function openLightbox(index, opener) {
  lightboxOpener = opener;
  lightboxIndex = index;
  updateLightbox();
  lightbox.hidden = false;
  lightbox.setAttribute("aria-hidden", "false");
  document.body.classList.add("lightbox-open");
  lightboxClose.focus();
}
function closeLightbox() {
  if (lightbox.hidden) return;
  lightbox.hidden = true;
  lightbox.setAttribute("aria-hidden", "true");
  document.body.classList.remove("lightbox-open");
  lightboxOpener?.focus();
}
function goToPhoto(direction) {
  lightboxIndex = (lightboxIndex + direction + visiblePhotos.length) % visiblePhotos.length;
  updateLightbox();
}
lightboxClose.addEventListener("click", closeLightbox);
lightbox.querySelector("[data-close-lightbox]").addEventListener("click", closeLightbox);
lightboxPrev.addEventListener("click", () => goToPhoto(-1));
lightboxNext.addEventListener("click", () => goToPhoto(1));
document.addEventListener("keydown", event => {
  if (lightbox.hidden) return;
  if (event.key === "Escape") closeLightbox();
  if (event.key === "ArrowLeft") goToPhoto(-1);
  if (event.key === "ArrowRight") goToPhoto(1);
  if (event.key === "Tab") {
    const controls = [lightboxClose, lightboxPrev, lightboxNext];
    const current = controls.indexOf(document.activeElement);
    if (event.shiftKey && current <= 0) { event.preventDefault(); controls[controls.length - 1].focus(); }
    if (!event.shiftKey && current === controls.length - 1) { event.preventDefault(); controls[0].focus(); }
  }
});
renderGallery();

// --- Quiz: edit these questions to match your own SDG topic ---
const questions = [
  {
    question: "Your phone battery no longer lasts all day. What is a smart first step?",
    choices: ["Throw the phone away", "Explore a safe battery replacement", "Buy two new phones"],
    answer: 1,
    explanation: "A safe battery replacement by a qualified repairer may extend the phone's useful life."
  },
  {
    question: "What should you do with a broken charger?",
    choices: ["Put it in a regular rubbish bin", "Leave it in a park", "Take it to an e-waste collection point"],
    answer: 2,
    explanation: "Electronic accessories belong in suitable e-waste collection systems, not mixed household waste."
  },
  {
    question: "Which everyday habit helps reduce electronic waste?",
    choices: ["Keep using devices that still meet your needs", "Upgrade every time a new model launches", "Buy devices you do not need"],
    answer: 0,
    explanation: "Keeping devices in use longer can reduce demand for new products and prevent avoidable waste."
  },
  {
    question: "What is UN Sustainable Development Goal 12 about?",
    choices: ["Life below water", "Responsible consumption and production", "Clean energy only"],
    answer: 1,
    explanation: "SDG 12 promotes sustainable consumption and production, including better waste prevention and management."
  }
];
let currentQuestion = 0;
let quizScore = 0;
let answered = false;
const quizQuestion = document.getElementById("quiz-question");
const quizOptions = document.getElementById("quiz-options");
const quizFeedback = document.getElementById("quiz-feedback");
const quizNext = document.getElementById("quiz-next");
const quizResult = document.getElementById("quiz-result");
const quizPosition = document.getElementById("quiz-position");
const quizScoreEl = document.getElementById("quiz-score");
const quizBar = document.getElementById("quiz-progress-bar");

function renderQuestion() {
  const q = questions[currentQuestion];
  answered = false;
  quizResult.hidden = true;
  quizQuestion.hidden = false;
  quizOptions.hidden = false;
  quizQuestion.textContent = q.question;
  quizPosition.textContent = `QUESTION ${String(currentQuestion + 1).padStart(2, "0")} / ${String(questions.length).padStart(2, "0")}`;
  quizScoreEl.textContent = `SCORE ${quizScore}`;
  quizBar.style.width = `${((currentQuestion + 1) / questions.length) * 100}%`;
  quizFeedback.textContent = "";
  quizNext.hidden = true;
  quizOptions.replaceChildren(...q.choices.map((choice, index) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "quiz-option";
    const letter = document.createElement("span");
    letter.className = "quiz-option-letter";
    letter.textContent = String.fromCharCode(65 + index);
    const text = document.createElement("span");
    text.textContent = choice;
    button.append(letter, text);
    button.addEventListener("click", () => selectAnswer(index));
    return button;
  }));
}
function selectAnswer(selected) {
  if (answered) return;
  answered = true;
  const q = questions[currentQuestion];
  const correct = selected === q.answer;
  if (correct) quizScore++;
  quizScoreEl.textContent = `SCORE ${quizScore}`;
  [...quizOptions.querySelectorAll("button")].forEach((button, index) => {
    button.disabled = true;
    if (index === q.answer) button.classList.add("correct");
    else if (index === selected) button.classList.add("wrong");
  });
  quizFeedback.textContent = `${correct ? "✓ Correct!" : "✕ Not quite."} ${q.explanation}`;
  quizNext.textContent = currentQuestion === questions.length - 1 ? "See my result →" : "Next question →";
  quizNext.hidden = false;
}
function showQuizResult() {
  quizQuestion.hidden = true;
  quizOptions.hidden = true;
  quizFeedback.textContent = "";
  quizNext.hidden = true;
  quizPosition.textContent = "CHALLENGE COMPLETE";
  quizBar.style.width = "100%";
  quizResult.hidden = false;
  quizResult.replaceChildren();
  const scoreLabel = document.createElement("div");
  scoreLabel.className = "result-big";
  scoreLabel.textContent = `${quizScore}/${questions.length}`;
  const resultHeading = document.createElement("h4");
  resultHeading.textContent = quizScore === questions.length ? "You're a reuse expert!" : quizScore >= 2 ? "You're on the right track!" : "Every step is a chance to learn!";
  const resultCopy = document.createElement("p");
  resultCopy.textContent = "Keep exploring smarter ways to repair, reuse and recycle electronics.";
  const restartButton = document.createElement("button");
  restartButton.type = "button";
  restartButton.className = "button button-acid";
  restartButton.textContent = "Try again ↻";
  restartButton.addEventListener("click", () => { currentQuestion = 0; quizScore = 0; renderQuestion(); });
  quizResult.append(scoreLabel, resultHeading, resultCopy, restartButton);
}
quizNext.addEventListener("click", () => {
  if (!answered) return;
  currentQuestion++;
  if (currentQuestion >= questions.length) showQuizResult();
  else renderQuestion();
});
renderQuestion();

// --- Personal action plan: individual browser storage, NOT a shared poll ---
const PLEDGE_KEY = "reboot-sdg12-actions-v1";
const pledgeInputs = [...document.querySelectorAll("#pledges input[type=checkbox]")];
function readSavedActions() {
  try {
    const saved = JSON.parse(localStorage.getItem(PLEDGE_KEY) || "[]");
    return Array.isArray(saved) ? saved.filter(v => typeof v === "string") : [];
  } catch { return []; }
}
function writeSavedActions(actions) {
  try { localStorage.setItem(PLEDGE_KEY, JSON.stringify(actions)); } catch { /* Browsers may disable storage. */ }
}
function updatePledges(save = true) {
  const chosen = pledgeInputs.filter(input => input.checked).map(input => input.value);
  const percent = Math.round((chosen.length / pledgeInputs.length) * 100);
  document.getElementById("pledge-percent").textContent = `${percent}%`;
  document.getElementById("progress-ring").style.setProperty("--progress", `${percent}%`);
  document.getElementById("progress-ring").setAttribute("aria-label", `${percent} percent of actions selected`);
  document.getElementById("pledge-count").textContent = `${chosen.length} of ${pledgeInputs.length} actions`;
  document.getElementById("pledge-message").textContent = chosen.length === pledgeInputs.length
    ? "Amazing — you've chosen all four actions!"
    : chosen.length > 0 ? "A better future starts with a choice." : "Choose your first action.";
  if (save) writeSavedActions(chosen);
}
const savedActions = readSavedActions();
pledgeInputs.forEach(input => {
  input.checked = savedActions.includes(input.value);
  input.addEventListener("change", () => updatePledges());
});
document.getElementById("pledge-reset").addEventListener("click", () => {
  pledgeInputs.forEach(input => { input.checked = false; });
  updatePledges();
});
updatePledges(false);
