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
    question: "Before donating an old phone, what should you do?",
    choices: ["Leave your personal photos and accounts on it", "Back up and securely erase your data", "Throw it into a river"],
    answer: 1,
    explanation: "Back up important files, sign out and securely erase personal data before passing on a phone."
  },
  {
    question: "Which choice is usually best for a laptop that still works well?",
    choices: ["Keep using it or pass it on", "Throw it in mixed rubbish", "Replace it just because a new colour is released"],
    answer: 0,
    explanation: "Using a functional product longer helps prevent avoidable waste and reduces the need for new materials."
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
  resultHeading.textContent = quizScore === questions.length ? "You're a reuse expert!" : quizScore >= Math.ceil(questions.length / 2) ? "You're on the right track!" : "Every step is a chance to learn!";
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


// ===========================================================
// RE:BOOT ARCADE — three standalone, dependency-free SDG games.
// Questions, sorting items and memory concepts can be edited here.
// ===========================================================

// GAME 01: Choose the correct handling method for everyday objects.
// Local waste rules may vary; these are broad learning categories.
const sortingItems = [
  { emoji: "📱", name: "Broken smartphone", to: "ewaste", why: "A broken phone should go to a recognised e-waste collection point, not a regular rubbish bin." },
  { emoji: "🔋", name: "Used AA battery", to: "batteries", why: "Loose batteries require designated battery collection. They should not go in general household waste." },
  { emoji: "📦", name: "Clean cardboard box", to: "recycling", why: "Clean cardboard packaging normally belongs in paper and cardboard recycling." },
  { emoji: "💻", name: "Working old laptop", to: "reuse", why: "If it is still usable, keep it, sell it or donate it after securely erasing your personal data." },
  { emoji: "🔌", name: "Broken charging cable", to: "ewaste", why: "Unusable charging cables can be collected with electronic waste so useful materials can be recovered." },
  { emoji: "🪫", name: "Used power-bank battery", to: "batteries", why: "Power banks contain rechargeable batteries. Take them to an appropriate battery/electronics collection point; do not put them in mixed waste." },
  { emoji: "🥤", name: "Empty plastic bottle", to: "recycling", why: "Empty packaging can usually be sorted into its appropriate packaging recycling stream; follow your local sorting rules." },
  { emoji: "🎧", name: "Working headphones", to: "reuse", why: "Give working headphones to someone who needs them instead of throwing them away." }
];
let sortIndex = 0;
let sortScore = 0;
let sortAnswered = false;
const sortButtons = [...document.querySelectorAll("#sort-choices button")];
const sortNext = document.getElementById("sort-next");
const sortFinish = document.getElementById("sort-finish");

function renderSortingItem() {
  const item = sortingItems[sortIndex];
  sortAnswered = false;
  document.getElementById("sort-item").hidden = false;
  document.getElementById("sort-choices").hidden = false;
  sortFinish.hidden = true;
  document.getElementById("sort-emoji").textContent = item.emoji;
  document.getElementById("sort-name").textContent = item.name;
  document.getElementById("sort-step").textContent = `ITEM ${sortIndex + 1} / ${sortingItems.length}`;
  document.getElementById("sort-score").textContent = `${sortScore} POINTS`;
  document.getElementById("sort-meter").style.width = `${100 * sortIndex / sortingItems.length}%`;
  document.getElementById("sort-feedback").textContent = "";
  sortNext.hidden = true;
  sortButtons.forEach(button => {
    button.disabled = false;
    button.classList.remove("is-correct", "is-wrong");
  });
}

function finishSorting() {
  document.getElementById("sort-item").hidden = true;
  document.getElementById("sort-choices").hidden = true;
  document.getElementById("sort-feedback").textContent = "";
  document.getElementById("sort-step").textContent = "GAME COMPLETE";
  document.getElementById("sort-score").textContent = `${sortScore} POINTS`;
  document.getElementById("sort-meter").style.width = "100%";
  sortNext.hidden = true;
  sortFinish.hidden = false;
  sortFinish.replaceChildren();
  const score = document.createElement("strong");
  score.textContent = `${sortScore}/${sortingItems.length}`;
  const heading = document.createElement("h4");
  heading.textContent = sortScore === sortingItems.length ? "Sorting superstar!" : "Every item has a better destination.";
  const note = document.createElement("p");
  note.textContent = "Remember: local collection rules vary. Reuse working technology and take electronics and batteries to suitable collection points.";
  const again = document.createElement("button");
  again.type = "button";
  again.textContent = "Play again ↻";
  again.addEventListener("click", () => { sortIndex = 0; sortScore = 0; renderSortingItem(); });
  sortFinish.append(score, heading, note, again);
}

sortButtons.forEach(button => button.addEventListener("click", () => {
  if (sortAnswered) return;
  sortAnswered = true;
  const item = sortingItems[sortIndex];
  const right = button.dataset.sort === item.to;
  if (right) sortScore++;
  document.getElementById("sort-score").textContent = `${sortScore} POINTS`;
  document.getElementById("sort-meter").style.width = `${100 * (sortIndex + 1) / sortingItems.length}%`;
  sortButtons.forEach(b => {
    b.disabled = true;
    if (b.dataset.sort === item.to) b.classList.add("is-correct");
    else if (b === button) b.classList.add("is-wrong");
  });
  document.getElementById("sort-feedback").textContent = `${right ? "✓ Correct!" : "✕ Not quite."} ${item.why}`;
  sortNext.textContent = sortIndex === sortingItems.length - 1 ? "See my result →" : "Next item →";
  sortNext.hidden = false;
}));
sortNext.addEventListener("click", () => {
  if (!sortAnswered) return;
  sortIndex++;
  if (sortIndex === sortingItems.length) finishSorting();
  else renderSortingItem();
});
renderSortingItem();

// GAME 02: Classic matching pairs with an educational message on each match.
const memoryConcepts = [
  { id: "repair", emoji: "🔧", label: "Repair", tip: "Repair: fix a device when safe and practical instead of replacing it." },
  { id: "reuse", emoji: "🔄", label: "Reuse", tip: "Reuse: keep working electronics in circulation." },
  { id: "recycle", emoji: "♻️", label: "Recycle", tip: "Recycle: use authorised e-waste collections for broken devices." },
  { id: "battery", emoji: "🔋", label: "Battery", tip: "Battery: use a separate battery collection point." },
  { id: "protect", emoji: "🛡️", label: "Protect", tip: "Protect: good care can help a device last longer." },
  { id: "reduce", emoji: "💡", label: "Reduce", tip: "Reduce: buy a new device only when you need it." }
];
let memoryCards = [];
let memoryFlipped = [];
let memoryMatched = new Set();
let memoryMoves = 0;
let memoryLocked = false;
let memoryGameVersion = 0;
let memoryTimer = null;
const memoryBoard = document.getElementById("memory-board");
const memoryMessage = document.getElementById("memory-message");

function shuffleArray(items) {
  const shuffled = [...items];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}
function updateMemoryStatus() {
  document.getElementById("memory-pairs").textContent = `${memoryMatched.size} / ${memoryConcepts.length} PAIRS`;
  document.getElementById("memory-moves").textContent = `${memoryMoves} MOVES`;
}
function drawMemoryBoard(focusAt = -1) {
  memoryBoard.replaceChildren(...memoryCards.map((card, i) => {
    const revealed = memoryFlipped.includes(i) || memoryMatched.has(card.id);
    const matched = memoryMatched.has(card.id);
    const button = document.createElement("button");
    button.type = "button";
    button.className = `memory-card${revealed ? " is-up" : ""}${matched ? " is-matched" : ""}`;
    button.dataset.cardIndex = String(i);
    button.disabled = matched;
    button.setAttribute("aria-label", revealed ? `Card ${i + 1}: ${card.label}${matched ? ", matched" : ""}` : `Card ${i + 1}: face down`);
    const symbol = document.createElement("span");
    symbol.className = revealed ? "memory-symbol" : "memory-back";
    symbol.setAttribute("aria-hidden", "true");
    symbol.textContent = revealed ? card.emoji : "?";
    button.append(symbol);
    if (revealed) {
      const label = document.createElement("span");
      label.className = "memory-label";
      label.textContent = card.label;
      button.append(label);
    }
    button.addEventListener("click", () => flipMemoryCard(i));
    return button;
  }));
  if (focusAt >= 0 && !memoryMatched.has(memoryCards[focusAt].id)) {
    memoryBoard.querySelector(`[data-card-index="${focusAt}"]`)?.focus();
  }
  updateMemoryStatus();
}
function flipMemoryCard(index) {
  if (memoryLocked || memoryFlipped.includes(index) || memoryMatched.has(memoryCards[index].id)) return;
  memoryFlipped.push(index);
  if (memoryFlipped.length === 1) {
    memoryMessage.textContent = "Choose one more card to find the pair.";
    drawMemoryBoard(index);
    return;
  }
  memoryMoves++;
  const [a, b] = memoryFlipped;
  const firstCard = memoryCards[a];
  if (firstCard.id === memoryCards[b].id) {
    memoryMatched.add(firstCard.id);
    memoryFlipped = [];
    memoryMessage.textContent = memoryMatched.size === memoryConcepts.length
      ? `Amazing! All ${memoryConcepts.length} pairs in ${memoryMoves} moves. You gave these ideas a second life!`
      : `✓ Match! ${firstCard.tip}`;
    drawMemoryBoard();
  } else {
    memoryLocked = true;
    memoryMessage.textContent = "Not a match. Remember these positions!";
    drawMemoryBoard(index);
    const version = memoryGameVersion;
    memoryTimer = setTimeout(() => {
      if (version !== memoryGameVersion) return;
      memoryFlipped = [];
      memoryLocked = false;
      memoryMessage.textContent = "Try another pair.";
      drawMemoryBoard();
      memoryTimer = null;
    }, 1000);
  }
}
function restartMemoryGame() {
  memoryGameVersion++;
  if (memoryTimer !== null) clearTimeout(memoryTimer);
  memoryTimer = null;
  memoryCards = shuffleArray(memoryConcepts.flatMap(item => [item, item]));
  memoryFlipped = [];
  memoryMatched = new Set();
  memoryMoves = 0;
  memoryLocked = false;
  memoryMessage.textContent = "Tap any two cards to find a match.";
  drawMemoryBoard();
}
document.getElementById("memory-restart").addEventListener("click", restartMemoryGame);
restartMemoryGame();

// GAME 03: Additional true/false quiz with explanations and a replay option.
const mythStatements = [
  { statement: "You must replace a working phone every year.", isFact: false, why: "A phone that still meets your needs can often be kept much longer." },
  { statement: "A used battery needs a separate collection route.", isFact: true, why: "Batteries can pose hazards in mixed waste and are collected separately." },
  { statement: "Repairing a device can help reduce e-waste.", isFact: true, why: "Extending a product's useful life can prevent avoidable electronic waste." },
  { statement: "Recycling a working laptop is always better than donating it.", isFact: false, why: "Reuse often retains more value than immediately recycling a device that still works." },
  { statement: "SDG 12 is about responsible consumption and production.", isFact: true, why: "The United Nations defines Goal 12 as Responsible Consumption and Production." },
  { statement: "It is fine to donate a phone without deleting your personal data.", isFact: false, why: "Always back up and securely erase personal data before selling or donating a device." }
];
let mythIndex = 0;
let mythScore = 0;
let mythAnswered = false;
const mythButtons = [...document.querySelectorAll("#myth-actions button")];
const mythNext = document.getElementById("myth-next");
const mythFinish = document.getElementById("myth-finish");
function renderMyth() {
  mythAnswered = false;
  document.getElementById("myth-statement").hidden = false;
  document.getElementById("myth-actions").hidden = false;
  mythFinish.hidden = true;
  document.getElementById("myth-step").textContent = `STATEMENT ${mythIndex + 1} / ${mythStatements.length}`;
  document.getElementById("myth-score").textContent = `${mythScore} POINTS`;
  document.getElementById("myth-statement").textContent = mythStatements[mythIndex].statement;
  document.getElementById("myth-meter").style.width = `${100 * mythIndex / mythStatements.length}%`;
  document.getElementById("myth-feedback").textContent = "";
  mythNext.hidden = true;
  mythButtons.forEach(button => { button.disabled = false; button.classList.remove("is-correct", "is-wrong"); });
}
mythButtons.forEach(button => button.addEventListener("click", () => {
  if (mythAnswered) return;
  mythAnswered = true;
  const item = mythStatements[mythIndex];
  const chosen = button.dataset.myth === "true";
  const right = chosen === item.isFact;
  if (right) mythScore++;
  document.getElementById("myth-score").textContent = `${mythScore} POINTS`;
  document.getElementById("myth-meter").style.width = `${100 * (mythIndex + 1) / mythStatements.length}%`;
  mythButtons.forEach(b => {
    b.disabled = true;
    if ((b.dataset.myth === "true") === item.isFact) b.classList.add("is-correct");
    else if (b === button) b.classList.add("is-wrong");
  });
  document.getElementById("myth-feedback").textContent = `${right ? "✓ Correct!" : "✕ Not quite."} ${item.why}`;
  mythNext.textContent = mythIndex === mythStatements.length - 1 ? "See my result →" : "Next statement →";
  mythNext.hidden = false;
}));
function finishMyth() {
  document.getElementById("myth-statement").hidden = true;
  document.getElementById("myth-actions").hidden = true;
  document.getElementById("myth-feedback").textContent = "";
  document.getElementById("myth-step").textContent = "QUIZ COMPLETE";
  document.getElementById("myth-score").textContent = `${mythScore} POINTS`;
  document.getElementById("myth-meter").style.width = "100%";
  mythNext.hidden = true;
  mythFinish.hidden = false;
  mythFinish.replaceChildren();
  const score = document.createElement("strong");
  score.textContent = `${mythScore}/${mythStatements.length}`;
  const heading = document.createElement("h4");
  heading.textContent = mythScore === mythStatements.length ? "Myth-busting master!" : "You learned something new!";
  const note = document.createElement("p");
  note.textContent = "You can make smarter choices by asking what is true and how devices can last longer.";
  const again = document.createElement("button");
  again.type = "button";
  again.textContent = "Try again ↻";
  again.addEventListener("click", () => { mythIndex = 0; mythScore = 0; renderMyth(); });
  mythFinish.append(score, heading, note, again);
}
mythNext.addEventListener("click", () => {
  if (!mythAnswered) return;
  mythIndex++;
  if (mythIndex >= mythStatements.length) finishMyth();
  else renderMyth();
});
renderMyth();
