let stats = document.getElementById('stats');
let character = document.getElementById('character')
let enemys = document.getElementById('enemys')
let battleE = document.getElementById('battle-e')
let battleP = document.getElementById('battle-p')
let pBar = document.querySelector('.progress-bar')
let progress = 0;
let intervalId;
let enemyBattleIntervalId;
let charBattleIntervalId;
let selectedEnemy = "skeleton";
let inBattle = false;
let enemyMaxHealth

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
    atkspeed: 2,
    exp: 0
}

class Enemy {
    constructor(name, health, exp, attack, atkspeed, armor){
        this.name = name;
        this.health = health;
        this.exp = exp;
        this.attack = attack;
        this.atkspeed = atkspeed;
        this.armor = armor;
    }
}

let enemyObj = {
    skeleton: new Enemy('Skeleton', 100, 8, 12, 5),
    ghoul: new Enemy('Ghoul', 150, 15, 20, 5),
    troll: new Enemy('Troll', 200, 23, 15, 4, 5),
    spearman: new Enemy('Spearman', 350, 46, 30, 3, 10)
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
                statsObject.strength += 1
                charObject.damage += 2
            }
            if(i === 1){
                statsObject.dexterity +=1
                charObject.atkspeed -= 0.008
            }
            if(i === 2){
                statsObject.stamina +=1
                charObject.health += 5
            }
            if(i === 3){
                statsObject.intelligence +=1
                charObject.mana += 15
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
        charObject.health = 100;
        charObject.damage = 5;
        charObject.mana = 25;
        charObject.atkspeed = 1;
        loadCharacter()
        loadScreen()
    })
}

////////////////////////////////// CHARACTER WINDOW //////////////////////////////////
let loadCharacter = () => {
    character.innerHTML = `
        <div><p>Health: ${charObject.health}</p></div>
        <div><p>Damage: ${charObject.damage}</p></div>
        <div><p>Mana: ${charObject.mana}</p></div>
        <div><p>Attack speed: ${Math.round(charObject.atkspeed * 100) / 100}</p></div>
        <div><p>Experience: ${charObject.exp}</p></div>
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
        <div><p>${charObject.health}</p></div>
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
    enemyMaxHealth = enemyObj[selectedEnemy].health
    atkBtn.style.display = "none";
    intervalId = setInterval(startLoading, 250)
    enemyBattleIntervalId = setInterval(enemyAttack, enemyObj[selectedEnemy].atkspeed * 1000) // Attacks per second
    charBattleIntervalId = setInterval(charAttack, charObject.atkspeed * 1000) // Attacks per second
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
    if(progress >= 100 || charObject.health <= 0 || enemyObj[selectedEnemy].health <= 0){
        if(charObject.health < 0){
            charObject.health = 0;
            loadBattle()
        }
        if(enemyObj[selectedEnemy].health < 0){
            enemyObj[selectedEnemy].health = 0;
            charObject.exp += enemyObj[selectedEnemy].exp;
            loadCharacter()
            loadBattle()
        }
        resetBattle();
        loadBattle();
        clearInterval(intervalId);
        clearInterval(enemyBattleIntervalId);
        clearInterval(charBattleIntervalId);
        atkBtn.style.display = "block";
        inBattle = false;
        return
    }
    progress++;
    updateProgressBar(pBar, progress)
}
////////////////////// START BATTLE ENEMY //////////////////////////
let enemyAttack = () => {
    charObject.health -= Math.floor(Math.random() * enemyObj[selectedEnemy].attack)
    loadBattle();
}
////////////////////// START BATTLE PLAYER //////////////////////////
let charAttack = () => {
    enemyObj[selectedEnemy].health -=  Math.floor(Math.random() * charObject.damage);
    loadBattle()
}

////////////////////////// LEVEL UP ///////////////////////////////////
let levelUp = () => {
    statsObject.level += 1;
    statsObject.points += 5;
    oldPoints += 5;
    loadStats();
}

let resetBattle = () => {
    enemyObj[selectedEnemy].health = enemyMaxHealth;
}

let loadScreen = () => {
    loadBattle()
    loadStats()
    loadCharacter()
    loadEnemyList()
}

loadScreen();