// Define initial game variables
let xp = 0;
let health = 100;
let gold = 50;
let currentWeapon = 0;
let fighting;
let monsterHealth;
let inventory = ["stick"];

// DOM elements
const button1 = document.querySelector('#button1');
const button2 = document.querySelector("#button2");
const button3 = document.querySelector("#button3");
const text = document.querySelector("#text");
const xpText = document.querySelector("#xpText");
const healthText = document.querySelector("#healthText");
const goldText = document.querySelector("#goldText");
const monsterStats = document.querySelector("#monsterStats");
const monsterName = document.querySelector("#monsterName");
const monsterHealthText = document.querySelector("#monsterHealth");

// Image and video elements
const locationImage = document.getElementById('locationImage');
const locationVideo = document.getElementById('locationVideo');

// Weapons and monsters data
const weapons = [
  { name: 'stick', power: 5 },
  { name: 'dagger', power: 30 },
  { name: 'claw hammer', power: 50 },
  { name: 'sword', power: 100 }
];

const monsters = [
  { name: "slime", level: 2, health: 15 },
  { name: "fanged beast", level: 8, health: 60 },
  { name: "dragon", level: 20, health: 300 }
];

const locations = [
  { name: "town square", buttonText: ["Go to store", "Go to cave", "Fight dragon"], buttonFunctions: [goStore, goCave, fightDragon], text: "You are in the town square. You see a sign that says \"Store\".", image: 'images/town.gif' },
  { name: "store", buttonText: ["Buy 10 health (10 gold)", "Buy weapon (30 gold)", "Go to town square"], buttonFunctions: [buyHealth, buyWeapon, goTown], text: "You enter the store.", image: 'images/town.gif' },
  { name: "cave", buttonText: ["Fight slime", "Fight fanged beast", "Go to town square"], buttonFunctions: [fightSlime, fightBeast, goTown], text: "You enter the cave. You see some monsters.", image: 'images/cave.png' },
  { name: "fight", buttonText: ["Attack", "Dodge", "Run"], buttonFunctions: [attack, dodge, run], text: "You are fighting a monster.",},
  { name: "kill monster", buttonText: ["Go to town square", "Go to town square", "Go to town square"], buttonFunctions: [goTown, goTown, goTown], text: 'The monster screams "Arg!" as it dies. You gain experience points and find gold.'},
  { name: "lose", buttonText: ["Restart", "Restart", "Restart"], buttonFunctions: [restart, restart, restart], text: "You have been defeated. Try again!", image: 'images/dragon.mp4' }
];

// Create audio elements
const audio = {
  beast: new Audio('sounds/beast.mp3'),
  slime: new Audio('sounds/slime.mp3'),
  dragon: new Audio('sounds/dragon.mp3'),
  lose: new Audio('sounds/lose.mp3'),
  town: new Audio('sounds/town.mp3'),
  cave: new Audio('sounds/cave.mp3'),
  store: new Audio('sounds/store.mp3'),
  attack: new Audio('sounds/attack.mp3'),
  dodge: new Audio('sounds/dodge.mp3'),
  run: new Audio('sounds/run.mp3')
};

// Set the volume for each audio element to 0.5
for (const key in audio) {
  audio[key].volume = 0.5;
}

// Function to play a specific audio file
function playSound(sound, loop = false) {
  if (audio[sound]) {
    audio[sound].loop = loop;
    audio[sound].play();
  }
}

// Function to stop background music
function stopBackgroundMusic() {
  for (const key in audio) {
    if (audio[key].loop) {
      audio[key].pause();
      audio[key].currentTime = 0;
    }
  }
}

// Initialize background music
function initializeBackgroundMusic() {
  stopBackgroundMusic(); // Stop any previously playing background music
  playSound('town', true); // Play town music on loop
}

// Initialize buttons
function initializeButtons() {
  button1.addEventListener('click', function() {
    if (button1.onclick) button1.onclick();
  });
  button2.addEventListener('click', function() {
    if (button2.onclick) button2.onclick();
  });
  button3.addEventListener('click', function() {
    if (button3.onclick) button3.onclick();
  });
}

// Update UI based on the current location
function update(location) {
  monsterStats.style.display = "none";
  button1.innerText = location.buttonText[0];
  button2.innerText = location.buttonText[1];
  button3.innerText = location.buttonText[2];
  button1.onclick = location.buttonFunctions[0];
  button2.onclick = location.buttonFunctions[1];
  button3.onclick = location.buttonFunctions[2];
  text.innerText = location.text;

  // Hide all media elements
  locationImage.classList.remove('show');
  locationVideo.classList.remove('show');

  // Show the appropriate media element
  if (location.image) {
    locationImage.src = location.image;
    locationImage.classList.add('show');
  }
  
  if (location.video) {
    locationVideo.src = location.video;
    locationVideo.classList.add('show');
  }
}

// Location functions
function goTown() {
  stopBackgroundMusic();
  playSound('town', true); // Play town music
  update(locations[0]);
}

function goStore() {
  stopBackgroundMusic();
  playSound('store'); // Play store music
  audio.store.onended = () => { // Play town music after store.mp3 ends
    playSound('town', true);
  };
  update(locations[1]);
}

function goCave() {
  stopBackgroundMusic();
  playSound('cave', true); // Play cave music
  update(locations[2]);
}

// Buy functions
function buyHealth() {
  if (gold >= 10) {
    gold -= 10;
    health += 10;
    updateStats();
  } else {
    text.innerText = "You do not have enough gold to buy health.";
  }
}

function buyWeapon() {
  if (currentWeapon < weapons.length - 1) {
    if (gold >= 30) {
      gold -= 30;
      currentWeapon++;
      let newWeapon = weapons[currentWeapon].name;
      inventory.push(newWeapon);
      text.innerText = `You now have a ${newWeapon}. In your inventory you have: ${inventory.join(', ')}.`;
      updateStats();
    } else {
      text.innerText = "You do not have enough gold to buy a weapon.";
    }
  } else {
    text.innerText = "You already have the most powerful weapon!";
    button2.innerText = "Sell weapon for 15 gold";
    button2.onclick = sellWeapon;
  }
}

function sellWeapon() {
  if (inventory.length > 1) {
    gold += 15;
    let soldWeapon = inventory.shift();
    text.innerText = `You sold a ${soldWeapon}. In your inventory you have: ${inventory.join(', ')}.`;
    updateStats();
  } else {
    text.innerText = "Don't sell your only weapon!";
  }
}

// Fight functions
function fightSlime() {
  startFight(0, 'slime');
}

function fightBeast() {
  startFight(1, 'beast');
}

function fightDragon() {
  startFight(2, 'dragon');
}

function startFight(monsterIndex, sound) {
  stopBackgroundMusic();
  playSound(sound); // Play monster-specific sound
  fighting = monsterIndex;
  goFight();
}

function goFight() {
  update(locations[3]);
  monsterHealth = monsters[fighting].health;
  monsterStats.style.display = "block";
  monsterName.innerText = monsters[fighting].name;
  monsterHealthText.innerText = monsterHealth;
}

// Attack enemy
function attack() {
  playSound('attack');  // Play attack sound
  text.innerText = `The ${monsters[fighting].name} attacks. You attack it with your ${weapons[currentWeapon].name}.`;
  health -= getMonsterAttackValue(monsters[fighting].level);
  if (isMonsterHit()) {
    monsterHealth -= weapons[currentWeapon].power + Math.floor(Math.random() * xp) + 1;    
  } else {
    text.innerText += " You miss.";
  }
  updateStats();
  if (health <= 0) {
    lose();
  } else if (monsterHealth <= 0) {
    defeatMonster();
  } else {
    monsterHealthText.innerText = monsterHealth;
  }
}

function getMonsterAttackValue(monsterLevel) {
  return Math.floor(Math.random() * (monsterLevel * 2)) + 1; // Random damage based on monster level
}

function isMonsterHit() {
  return Math.random() * 100 > 20; // 80% chance to hit
}

// Dodge enemy attack
function dodge() {
  text.innerText = "You dodge the attack.";
  stopBackgroundMusic();
  playSound('dodge'); // Play dodge sound
  goFight();
}

// Run away from the fight
function run() {
  text.innerText = "You run away from the fight.";
  stopBackgroundMusic();
  playSound('run'); // Play run sound
  update(locations[2]);
}

// Defeat monster
function defeatMonster() {
  stopBackgroundMusic();
  playSound('win'); // Add win sound if needed
  xp += monsters[fighting].level;
  gold += monsters[fighting].level * 10;
  update(locations[4]);
}

// Handle losing the game
function lose() {
  update(locations[5]);
  playSound('lose'); // Play lose sound
}

// Win the game
function winGame() {
  update(locations[4]);
  stopBackgroundMusic();
  playSound('win'); // Add win sound if needed
}

// Restart the game
function restart() {
  xp = 0;
  health = 100;
  gold = 50;
  currentWeapon = 0;
  inventory = ["stick"];
  update(locations[0]);
  initializeBackgroundMusic();
}

// Update stats display
function updateStats() {
  xpText.innerText = `XP: ${xp}`;
  healthText.innerText = `Health: ${health}`;
  goldText.innerText = `Gold: ${gold}`;
}

// Initialize the game
function initializeGame() {
  initializeBackgroundMusic();
  initializeButtons();
  update(locations[0]);
}

// Call initialize game on page load
window.onload = initializeGame;
