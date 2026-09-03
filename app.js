const spirits = [
  ["A Spread of Rampant Green", "Gioco base"], ["Bringer of Dreams and Nightmares", "Gioco base"],
  ["Lightning's Swift Strike", "Gioco base"], ["Ocean's Hungry Grasp", "Gioco base"],
  ["River Surges in Sunlight", "Gioco base"], ["Shadows Flicker Like Flame", "Gioco base"],
  ["Thunderspeaker", "Gioco base"], ["Vital Strength of the Earth", "Gioco base"],
  ["Keeper of the Forbidden Wilds", "Branch & Claw"], ["Sharp Fangs Behind the Leaves", "Branch & Claw"],
  ["Downpour Drenches the World", "Feather & Flame"], ["Finder of Paths Unseen", "Feather & Flame"],
  ["Heart of the Wildfire", "Feather & Flame"], ["Serpent Slumbering Beneath the Island", "Feather & Flame"],
  ["Fractured Days Split the Sky", "Jagged Earth"], ["Grinning Trickster Stirs Up Trouble", "Jagged Earth"],
  ["Lure of the Deep Wilderness", "Jagged Earth"], ["Many Minds Move as One", "Jagged Earth"],
  ["Shifting Memory of Ages", "Jagged Earth"], ["Shroud of Silent Mist", "Jagged Earth"],
  ["Starlight Seeks Its Form", "Jagged Earth"], ["Stone's Unyielding Defiance", "Jagged Earth"],
  ["Vengeance as a Burning Plague", "Jagged Earth"], ["Volcano Looming High", "Jagged Earth"],
  ["Devouring Teeth Lurk Underfoot", "Horizons"], ["Eyes Watch from the Trees", "Horizons"],
  ["Fathomless Mud of the Swamp", "Horizons"], ["Rising Heat of Stone and Sand", "Horizons"], ["Sun-Bright Whirlwind", "Horizons"],
  ["Breath of Darkness Down Your Spine", "Nature Incarnate"], ["Dances Up Earthquakes", "Nature Incarnate"],
  ["Ember-Eyed Behemoth", "Nature Incarnate"], ["Hearth-Vigil", "Nature Incarnate"],
  ["Relentless Gaze of the Sun", "Nature Incarnate"], ["Towering Roots of the Jungle", "Nature Incarnate"],
  ["Wandering Voice Keens Delirium", "Nature Incarnate"], ["Wounded Waters Bleeding", "Nature Incarnate"]
].map(([name, expansion]) => ({ name, expansion }));

const quantity = document.querySelector("#quantity");
const availability = document.querySelector("#availability");
const options = document.querySelector("#expansion-options");
const resultsSection = document.querySelector("#results-section");
const resultsGrid = document.querySelector("#results-grid");
const expansions = [...new Set(spirits.map(({ expansion }) => expansion))];

function imageUrl(name) {
  return `https://spiritislandwiki.com/index.php?title=Special:Redirect/file/${encodeURIComponent(`${name}.png`)}&width=500`;
}

function wikiUrl(name) {
  return `https://spiritislandwiki.com/index.php?title=${encodeURIComponent(name.replaceAll(" ", "_"))}`;
}

function selectedSpirits() {
  const selectedExpansions = [...document.querySelectorAll(".expansion-option input:checked")].map(({ value }) => value);
  return spirits.filter(({ expansion }) => selectedExpansions.includes(expansion));
}

function normalizeQuantity() {
  const maximum = selectedSpirits().length;
  const entered = Number.parseInt(quantity.value, 10);
  const value = Number.isFinite(entered) ? Math.max(1, Math.min(entered, maximum || 1)) : 1;
  quantity.value = value;
  return value;
}

function updateAvailability() {
  const available = selectedSpirits().length;
  quantity.max = Math.max(available, 1);
  normalizeQuantity();
  availability.textContent = available ? `${available} Spiriti principali disponibili.` : "Seleziona almeno un'espansione.";
  availability.classList.toggle("warning", available === 0);
  document.querySelector("#draw-button").disabled = available === 0;
}

function createOptions() {
  expansions.forEach((expansion, index) => {
    const count = spirits.filter((spirit) => spirit.expansion === expansion).length;
    const id = `expansion-${index}`;
    options.insertAdjacentHTML("beforeend", `<div class="expansion-option"><input id="${id}" type="checkbox" value="${expansion}" checked><label for="${id}">${expansion} · ${count}</label></div>`);
  });
}

function shuffle(items) {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function draw() {
  const count = normalizeQuantity();
  const drafted = shuffle(selectedSpirits()).slice(0, count);
  resultsGrid.replaceChildren(...drafted.map((spirit) => {
    const card = document.createElement("article");
    card.className = "spirit-card";
    card.innerHTML = `<img class="spirit-image" src="${imageUrl(spirit.name)}" alt="Illustrazione di ${spirit.name}"><div class="spirit-info"><p class="spirit-expansion">${spirit.expansion}</p><h3 class="spirit-name">${spirit.name}</h3><a class="spirit-link" href="${wikiUrl(spirit.name)}" target="_blank" rel="noreferrer">Apri nella wiki ↗</a></div>`;
    return card;
  }));
  resultsSection.hidden = false;
  resultsSection.scrollIntoView({ behavior: "smooth", block: "start" });
}

createOptions();
updateAvailability();
options.addEventListener("change", updateAvailability);
quantity.addEventListener("change", updateAvailability);
document.querySelectorAll(".stepper-button").forEach((button) => button.addEventListener("click", () => {
  quantity.value = Number(quantity.value || 1) + Number(button.dataset.step);
  updateAvailability();
}));
document.querySelector("#draw-button").addEventListener("click", draw);
document.querySelector("#redraw-button").addEventListener("click", draw);
