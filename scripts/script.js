let xp = 0;
let health = 100;
let gold = 50;
let currentWeapon = 0;
let fighting;
let monsterHealth;
let inventory = ["stick"];

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
const weapons = [
  { name: 'stick', power: 5 },
  { name: 'dagger', power: 30 },
  { name: 'claw hammer', power: 50 },
  { name: 'sword', power: 100 }
];
const monsters = [
  {
    name: "slime",
    level: 2,
    health: 15
  },
  {
    name: "fanged beast",
    level: 8,
    health: 60
  },
  {
    name: "dragon",
    level: 20,
    health: 300
  }
];
const locations = [
  { name: "town square", buttonText: ["Go to store", "Go to cave", "Fight dragon"], buttonFunctions: [goStore, goCave, fightDragon], text: "You are in the town square. You see a sign that says \"Store\"." },
  { name: "store", buttonText: ["Buy 10 health (10 gold)", "Buy weapon (30 gold)", "Go to town square"], buttonFunctions: [buyHealth, buyWeapon, goTown], text: "You enter the store." },
  { name: "cave", buttonText: ["Fight slime", "Fight fanged beast", "Go to town square"], buttonFunctions: [fightSlime, fightBeast, goTown], text: "You enter the cave. You see some monsters." },
  { name: "fight", buttonText: ["Attack", "Dodge", "Run"], buttonFunctions: [attack, dodge, run], text: "You are fighting a monster." },
  { name: "kill monster", buttonText: ["Go to town square", "Go to town square", "Go to town square"], buttonFunctions: [goTown, goTown, goTown], text: 'The monster screams "Arg!" as it dies. You gain experience points and find gold.' },
  { name: "lose", buttonText: ["Restart", "Restart", "Restart"], buttonFunctions: [restart, restart, restart], text: "You have been defeated. Try again!" }
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
  button1.onclick = goStore;
  button2.onclick = goCave;
  button3.onclick = fightDragon;
}

function update(location) {
  monsterStats.style.display = "none";
  button1.innerText = location["button text"][0];
  button2.innerText = location["button text"][1];
  button3.innerText = location["button text"][2];
  button1.onclick = location["button functions"][0];
  button2.onclick = location["button functions"][1];
  button3.onclick = location["button functions"][2];
  text.innerHTML = location.text;
}

function goTown() {
  update(locations[0]);
  townSound.play(); // Play town sound
  caveSound.pause(); // Pause cave sound if it's playing
}

function goStore() {
  update(locations[1]);
  townSound.pause(); // Pause town sound if it's playing
  caveSound.pause(); // Pause cave sound if it's playing
}

function goCave() {
  update(locations[2]);
  caveSound.loop = true; // Loop cave sound
  caveSound.play(); // Play cave sound
  townSound.pause(); // Pause town sound if it's playing
}

function buyHealth() {
  if (gold >= 10) {
    gold -= 10;
    health += 10;
    goldText.innerText = gold;
    healthText.innerText = health;
  } else {
    text.innerText = "You do not have enough gold to buy health.";
  }
}

function buyWeapon() {
  if (currentWeapon < weapons.length - 1) {
    if (gold >= 30) {
      gold -= 30;
      currentWeapon++;
      goldText.innerText = gold;
      let newWeapon = weapons[currentWeapon].name;
      text.innerText = "You now have a " + newWeapon + ".";
      inventory.push(newWeapon);
      text.innerText += " In your inventory you have: " + inventory;
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
    goldText.innerText = gold;
    let currentWeapon = inventory.shift();
    text.innerText = "You sold a " + currentWeapon + ".";
    text.innerText += " In your inventory you have: " + inventory;
  } else {
    text.innerText = "Don't sell your only weapon!";
  }
}

function fightSlime() {
  fighting = 0;
  goFight();
  slimeSound.play(); // Play slime sound
}

function fightBeast() {
  fighting = 1;
  goFight();
  beastSound.play(); // Play beast sound
}

function fightDragon() {
  fighting = 2;
  goFight();
  dragonSound.play(); // Play dragon sound
}

function goFight() {
  update(locations[3]);
  monsterHealth = monsters[fighting].health;
  monsterStats.style.display = "block";
  monsterName.innerText = monsters[fighting].name;
  monsterHealthText.innerText = monsterHealth;
}

function attack() {
  text.innerText = "The " + monsters[fighting].name + " attacks.";
  text.innerText += " You attack it with your " + weapons[currentWeapon].name + ".";
  health -= getMonsterAttackValue(monsters[fighting].level);
  if (isMonsterHit()) {
    monsterHealth -= weapons[currentWeapon].power + Math.floor(Math.random() * xp) + 1;    
  } else {
    text.innerText += " You miss.";
  }
  healthText.innerText = health;
  monsterHealthText.innerText = monsterHealth;
  if (health <= 0) {
    lose();
  } else if (monsterHealth <= 0) {
    if (fighting === 2) {
      winGame();
    } else {
      defeatMonster();
    }
  }
  if (Math.random() <= .1 && inventory.length !== 1) {
    text.innerText += " Your " + inventory.pop() + " breaks.";
    currentWeapon--;
  }
}

function getMonsterAttackValue(level) {
  const hit = (level * 5) - (Math.floor(Math.random() * xp));
  console.log(hit);
  return hit > 0 ? hit : 0;
}

function isMonsterHit() {
  return Math.random() > .2 || health < 20;
}

function dodge() {
  text.innerText = "You dodge the attack from the " + monsters[fighting].name;
}

function defeatMonster() {
  gold += Math.floor(monsters[fighting].level * 6.7);
  xp += monsters[fighting].level;
  goldText.innerText = gold;
  xpText.innerText = xp;
  update(locations[4]);
}

function lose() {
  loseSound.play(); // Play lose sound
  update(locations[5]);
}

function winGame() {
  update(locations[6]);
}

function restart() {
  xp = 0;
  health = 100;
  gold = 50;
  currentWeapon = 0;
  inventory = ["stick"];
  goldText.innerText = gold;
  healthText.innerText = health;
  xpText.innerText = xp;
  goTown();
}

// Easter egg functions
function updateStats() {
  xpText.innerText = `XP: ${xp}`;
  healthText.innerText = `Health: ${health}`;
  goldText.innerText = `Gold: ${gold}`;
}

// Initialize background music and buttons
document.addEventListener('DOMContentLoaded', () => {
  initializeBackgroundMusic();
  initializeButtons();
});
window.onload = () => {
  const canvas1 = document.getElementById('canvas1');
  const ctx1 = canvas1.getContext('2d');

  // Example drawing
  ctx1.fillStyle = 'blue';
  ctx1.fillRect(10, 10, 100, 100);
};
