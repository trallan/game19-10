let stats = document.getElementById('stats');
let character = document.getElementById('character')
let enemys = document.getElementById('enemys')
let battleE = document.getElementById('battle-e')
let battleP = document.getElementById('battle-p')
let pBar = document.querySelector('.progress-bar')
let progress = 0;
let intervalId;
let battleIntervalId;
let selectedEnemy = "skeleton";
let inBattle = false;

let statsObject = {
    level: 1,
    points: 5,
    strength: 0,
    dexterity: 0,
    stamina: 0,
    intelligence: 0
};

let charObject = {
    health: 100,
    damage: 5,
    mana: 25,
    atkspeed: 1
}

class Enemy {
    constructor(name, health, exp, attack, atkspeed){
        this.name = name;
        this.health = health;
        this.exp = exp;
        this.attack = attack
        this.atkspeed = atkspeed
    }
}

let enemyObj = {
    skeleton: new Enemy('Skeleton', 100, 8, 12, 1),
    ghoul: new Enemy('Ghoul', 150, 20, 20, 1),
    troll: new Enemy('Troll', 200, 30, 15, 2),
    spearman: new Enemy('Spearman', 350, 45, 30, 2)
}

let oldPoints = statsObject.points;
//////////////////////////////// STATS WINDOW //////////////////////////////////////////
let loadStats = () => {
    stats.innerHTML = `
    <p style="text-decoration: underline;">Stats</p>
    <p>Level: ${statsObject.level}</p>
    <p>Avaible points: ${statsObject.points}</p>
    <div class="stats-val"><p>Strength: ${statsObject.strength} <button class="stats-btn">+</button></p></div>
    <div class="stats-val"><p>Dexterity: ${statsObject.dexterity} <button class="stats-btn">+</button></p></div>
    <div class="stats-val"><p>Stamina: ${statsObject.stamina} <button class="stats-btn">+</button></p></div>
    <div class="stats-val"><p>Intelligence: ${statsObject.intelligence} <button class="stats-btn">+</button></p></div>
    <div><button class="reset-btn">Reset stats</button></div>
    `
    let statsBtn = document.querySelectorAll('.stats-btn');
    for(let i = 0; i < statsBtn.length; i++){
    statsBtn[i].addEventListener('click', function(){
        if(statsObject.points > 0){
            if(i === 0){
                statsObject.strength +=1
            }
            if(i === 1){
                statsObject.dexterity +=1
            }
            if(i === 2){
                statsObject.stamina +=1
            }
            if(i === 3){
                statsObject.intelligence +=1
            }
            statsObject.points -= 1
        }
        loadScreen()
        }   
    )};
    //////////////////// RESET STATS //////////////////////
    let resetStats = document.querySelector('.reset-btn');
    resetStats.addEventListener('click', function(){
        statsObject.strength = 0;
        statsObject.dexterity = 0;
        statsObject.stamina = 0;
        statsObject.intelligence  = 0;
        statsObject.points = oldPoints;
        loadScreen()
    })
}

////////////////////////////////// CHARACTER WINDOW //////////////////////////////////
let loadCharacter = () => {
    character.innerHTML = `
        <div><p>Health: ${charObject.health + statsObject.stamina*5}</p></div>
        <div><p>Damage: ${charObject.damage + statsObject.strength*3}</p></div>
        <div><p>Mana: ${charObject.mana + statsObject.intelligence*15}</p></div>
        <div><p>Attack speed: ${charObject.atkspeed + statsObject.dexterity*0.2}</p></div>
    `
}
//////////////////////////////////// ENEMY LIST WINDOW //////////////////////////////
let loadEnemyList = () => {
    enemys.innerHTML = `
        <div><p style="text-decoration: underline">Enemy list</p></div>
        <div><button class="enemy-btn" value="skeleton">Skeleton</button></div>
        <div><button class="enemy-btn" value="ghoul">Ghoul</button></div>
        <div><button class="enemy-btn" value="troll">Troll</button></div>
        <div><button class="enemy-btn" value="spearman">Spearman</button></div>
    `
//////////////////////////// CHOOSE ENEMY ////////////////////////////////////
    let enemyBtn = document.querySelectorAll('.enemy-btn')
    for(let i = 0; i < enemyBtn.length; i++){
        enemyBtn[i].addEventListener('click', function(){
            if(inBattle === true){
                console.log("YOU ARE IN BATTLE ALREADY")
                return
            }
            selectedEnemy = enemyBtn[i].value;
            loadBattle()
        });
    }
}

/////////////////////////// BATTLE WINDOW ///////////////////////
let loadBattle = () => {
    battleP.innerHTML = `
        <div><p>Player</p></div>
        <div><p>Health:</p></div>
        <div><p>${charObject.health + statsObject.stamina*5}</p></div>
    `
    battleE.innerHTML = `
        <div><p>${enemyObj[selectedEnemy].name}</p></div>
        <div><p>Health:</p></div>
        <div><p>${enemyObj[selectedEnemy].health}</p></div>
    `
}
//////////////////////// ATTACK BTN //////////////////////////////// 
let atkBtn = document.querySelector('.atk-btn');
atkBtn.addEventListener('click', function(){
    atkBtn.style.display = "none";
    intervalId = setInterval(startLoading, 250)
    battleIntervalId = setInterval(startBattle, 3000) // Attacks per second
    progress = 0;
    inBattle = true;
});
//////////////////// PROGRESS BAR ////////////////////////////////
let updateProgressBar = (progressBar, value) => {
    value = Math.round(value);
    progressBar.querySelector('.progress-fill').style.width = `${value}%`;
    progressBar.querySelector('.progress-txt').textContent = `${value}%`;
}
//////////////////////// START LOADING BAR / ATTACK BUTTON//////////////////////
let startLoading = () => {
    if(progress >= 100 || charObject.health <= 0){
        clearInterval(intervalId);
        clearInterval(battleIntervalId);
        atkBtn.style.display = "block";
        inBattle = false;
        return
    }
    progress++;
    updateProgressBar(pBar, progress)
}
////////////////////// START BATTLE //////////////////////////
let startBattle = () => {
    enemyObj[selectedEnemy].health -= charObject.damage
    charObject.health -= enemyObj[selectedEnemy].attack
    loadBattle();
}

////////////////////////// LEVEL UP ///////////////////////////////////
let levelUp = () => {
    statsObject.level += 1;
    statsObject.points += 5;
    oldPoints += 5;
    loadStats();
}

let loadScreen = () => {
    loadBattle()
    loadStats()
    loadCharacter()
    loadEnemyList()
}

loadScreen();