let stats = document.getElementById('stats');
let character = document.getElementById('character')
let enemys = document.getElementById('enemys')
let battleE = document.getElementById('battle-e')
let battleP = document.getElementById('battle-p')
let pBar = document.querySelector('.progress-bar')
let battleLog = document.querySelector('#battle-log')
let takeBtn;
let sellBtn;
let progress = 0;
let intervalId;
let regIntervalId;
let enemyBattleIntervalId;
let charBattleIntervalId;
let selectedEnemy = "skeleton";
let inBattle = false;
let enemyMaxHealth;
let charMaxHealth = 100;
let expUp = 200;
let expStage = 1;
let regHp = false;
let regHpRate = 2;
let charAttackLog;
let enemyAttackLog;
let countLog = 0;
let coinDrop;
let gold = 0;
let silver = 0;
let copper = 0;
let weight = 0;

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
    damage: 10,
    mana: 25,
    atkspeed: 1.5,
    exp: 0
}



class Enemy {
    constructor(name, health, exp, attack, atkspeed, armor, coinType, coinVal, itemGrade){
        this.name = name;
        this.health = health;
        this.exp = exp;
        this.attack = attack;
        this.atkspeed = atkspeed;
        this.armor = armor;
        this.coinType = coinType;
        this.coinVal = coinVal;
        this.itemGrade = itemGrade;
    }
}

let enemyObj = {
    snake: new Enemy('Snake', 50, 7, 5, 5, 0, 'copper', 5, 0),
    skeleton: new Enemy('Skeleton', 100, 16, 12, 5, 0, 'copper', 15, 1),
    ghoul: new Enemy('Ghoul', 150, 40, 20, 5, 0, 'copper', 45, 1),
    troll: new Enemy('Troll', 200, 68, 30, 4, 5, 'copper', 68, 1),
    spearman: new Enemy('Spearman', 350, 92, 48, 3, 10, 'copper', 98, 1)
}

class newItem {
    constructor(name, damage, health, weight, value, itemSlot){
        this.name = name;
        this.damage = damage;
        this.health = health;
        this.weight = weight;
        this.value = value;
        this.itemSlot = itemSlot;
    }
}

let items = {
    woodenSword: new newItem('Wooden Sword', 10, 10, 20, 80, 3),
    woodenShield: new newItem('Wooden Shield', 0, 15, 15, 60, 4),
    leatherHelmet: new newItem('Leather Helmet', 0, 5, 5, 50, 0),
    leatherArmor: new newItem('Leather Armor', 0, 5, 5, 50, 1),
    leatherBoots: new newItem('Leather Boots', 0, 5, 5, 50, 2)
}

let itemGrade1 = {
    0: items.leatherHelmet,
    1: items.leatherArmor,
    2: items.leatherBoots,
    3: items.woodenSword,
    4: items.woodenShield
}

////////////////////////// INVENTORY /////////////////////////////
let inventory = [];
let loot = [];
let inventoryList = document.querySelector('#inventory');
let lootList = document.querySelector('#loot');

//////////////////////////////// LOAD INVENTORY //////////////////////////////////////
let loadInventory = () => {
    let inventoryFooter = document.querySelector('#inventory-footer')
    inventoryFooter.innerHTML = `
    <div id="money">
        <div><p>Gold: ${gold}</p></div>
        <div><p>Silver: ${silver}</p></div>
        <div><p>Copper: ${copper}</p></div>
    </div>
    <div id="weight"><p>Weight: ${weight}kg</p></div>
    `
}

let checkInventory = () => {
    inventoryList.innerHTML = ``
    for(let i = 0; i < inventory.length; i++){
        inventoryList.innerHTML += `
        <div><p>${inventory[i].name}</p></div>
    `
    }
}

//////////////////////////// COIN DROP ///////////////////////
let dropCoin = (type, val) => {
    coinDrop = Math.floor(Math.random() * val)
    if(type === 'copper'){
        copper += coinDrop
        if(copper >= 100){
            silver += 1
            copper = 0;
        }
    }
    if (type === 'silver'){
        silver += coinDrop
        if(silver >= 100){
            gold += 1
            silver = 0;
        }
    }
    if (type === 'gold'){
        gold += coinDrop
    }
    loadInventory();
}
///////////////////////////////// ITEMS THAT DROP WHEN ENEMY DIE ////////////////////////////////////
let dropItem = () => {
    dropCoin(enemyObj[selectedEnemy].coinType, enemyObj[selectedEnemy].coinVal)
    if(Math.floor(Math.random() * 3) === 0){
        loot.push(itemGrade1[Math.floor(Math.random() * 4)]);
    }
    lootList.innerHTML += `
        <div><p>You looted ${coinDrop} ${enemyObj[selectedEnemy].coinType}.</p></div>
    `
        for(let i = 0; i < loot.length; i++){
            lootList.innerHTML += `
            <div><p>You looted a ${loot[i].name}. <button id="take-btn">Take</button> <button id="sell-btn">Sell</button></p></div>
        `
    }
    takeBtn = document.querySelector('#take-btn');
    sellBtn = document.querySelector('#sell-btn');
    /////////////////////////////// TAKE AND SELL ITEMS //////////////////////////////////
    if(takeBtn != null){
        takeBtn.addEventListener('click', function(){
            console.log('You picked up an item')
            inventory.push(loot[0])
            loot = [];
            takeBtn.style.display = "none";
            sellBtn.style.display = "none";
            checkInventory();
            loadInventory();
        })
        sellBtn.addEventListener('click', function(){
            console.log('You sold an item')
            takeBtn.style.display = "none";
            sellBtn.style.display = "none";
            copper += loot[0].value
            loadInventory();
        })
    }
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
    /////////////////////////// ADD STATS BUTTON//////////////////////////
    let statsBtn = document.querySelectorAll('.stats-btn');
    for(let i = 0; i < statsBtn.length; i++){
    statsBtn[i].addEventListener('click', function(){
        if(inBattle === true){
            return
        }
        if(statsObject.points > 0){
            if(i === 0){
                statsObject.strength += 1
                charObject.damage += 1
            }
            if(i === 1){
                if(charObject.atkspeed <= 1){
                    return
                }
                statsObject.dexterity += 1
                charObject.atkspeed -= 0.008
            }
            if(i === 2){
                statsObject.stamina +=1
                charObject.health += 5
                charMaxHealth += 5
            }
            if(i === 3){
                statsObject.intelligence +=1
                charObject.mana += 2
                regHpRate += 0.2
            }
            statsObject.points -= 1
        }
        loadScreen()
        }   
    )};
    //////////////////// RESET STATS //////////////////////
    let resetStats = document.querySelector('.reset-btn');
        resetStats.addEventListener('click', function(){
            if(inBattle === true || charObject.health < charMaxHealth){
                return
            }
            statsObject.strength = 0;
            statsObject.dexterity = 0;
            statsObject.stamina = 0;
            statsObject.intelligence  = 0;
            statsObject.points = oldPoints;
            charObject.health = 100;
            charObject.damage = 5;
            charObject.mana = 25;
            charObject.atkspeed = 1.5;
            charMaxHealth = 100;
            loadCharacter()
            loadScreen()
        })
}

////////////////////////////////// CHARACTER WINDOW //////////////////////////////////
let loadCharacter = () => {
    character.innerHTML = `
        <div><p>Health: ${charMaxHealth}</p></div>
        <div><p>Damage: ${charObject.damage}</p></div>
        <div><p>Mana: ${charObject.mana}</p></div>
        <div><p>Attack speed: ${Math.round(charObject.atkspeed * 100) / 100}</p></div>
        <div><p>Experience: ${charObject.exp}</p></div>
        <div><p>Exp to next level: ${expUp}</p></div>
    `
}
//////////////////////////////////// ENEMY LIST WINDOW //////////////////////////////
let loadEnemyList = () => {
    enemys.innerHTML = `
        <div><p style="text-decoration: underline">Enemy list</p></div>
        <div><button class="enemy-btn" value="snake">Snake</button></div>
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

/////////////////////////// BATTLE LOG ////////////////////////////////

let charLoadBattleLog = () => {
    countLog++;
    
    battleLog.innerHTML += `
        <div><p>Player hit ${enemyObj[selectedEnemy].name} for ${charAttackLog} damage.</p></div>
    `
}

let enemyLoadBattleLog = () => {
    countLog++;
    
    battleLog.innerHTML += `
        <div><p style="color: red;">Enemy hit you for ${enemyAttackLog} damage.</p></div>
    `
}

//////////////////////// ATTACK BTN //////////////////////////////// 
let atkBtn = document.querySelector('.atk-btn');
atkBtn.addEventListener('click', function(){
    battleLog.innerHTML = ``;
    lootList.innerHTML = ``;
    loot = [];
    countLog = 0;
    if(regHp === true){
        return
    }
    clearInterval(regIntervalId)
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
//////////////////////// START LOADING BAR / CHECK ENEMY & PLAYER DEAD //////////////////////
let startLoading = () => {
    if(progress >= 100 || charObject.health <= 0 || enemyObj[selectedEnemy].health <= 0){
        if(charObject.health < 0){
            charObject.health = 0;
            charObject.exp -= enemyObj[selectedEnemy].exp;
            loadBattle()
        }
        //////////////////// ENEMY DEAD ///////////////////////
        if(enemyObj[selectedEnemy].health < 0){
            enemyObj[selectedEnemy].health = 0;
            charObject.exp += enemyObj[selectedEnemy].exp;
            loadInventory();
            dropItem();
            expIncrease();
            loadCharacter();
            loadBattle();
            checkInventory();
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
    enemyAttackLog = Math.floor(Math.random() * enemyObj[selectedEnemy].attack);
    charObject.health -= enemyAttackLog
    enemyLoadBattleLog();
    loadBattle();
}
////////////////////// START BATTLE PLAYER //////////////////////////
let charAttack = () => {
    charAttackLog = Math.floor(Math.random() * charObject.damage)
    enemyObj[selectedEnemy].health -= charAttackLog;
    charLoadBattleLog();
    loadBattle();
}

////////////////////////// LEVEL UP ///////////////////////////////////
let levelUp = () => {
    statsObject.level += 1;
    statsObject.points += 5;
    oldPoints += 5;
    charObject.damage += 5;
    charMaxHealth += 5;
    charObject.health += 5
    charObject.mana += 5
    loadBattle();
    loadCharacter();
    loadStats();
}
//////////////////////////// INCREASE EXP / EXP STAGE /////////////////////////
let expIncrease = () => {
    if(charObject.exp >= expUp){
        levelUp()
        expUp += 200 * expStage;
        expStage += 0.5;
    }
}
/////////////////////// BATTLE RESETS ///////////////////////////
let resetBattle = () => {
    enemyObj[selectedEnemy].health = enemyMaxHealth;
}
///////////////////////// REGENERATE BUTTON //////////////
let regBtn = document.querySelector('.reg-btn');
regBtn.addEventListener('click', function(){
    if(inBattle === false){
        regBtn.style.display = "none";
        regHp = true;
    }
    if(inBattle === false){
        regIntervalId = setInterval(regenerateHealth, 2000);
    }else {
        return
    }
});
/////////////////////// REG HP FUNC ////////////////////////
let regenerateHealth = () => {
    if(charObject.health < charMaxHealth){
        charObject.health += regHpRate;
        loadBattle()
    }
    if(charObject.health >= charMaxHealth ){
        regHp = false;
        regBtn.style.display = "block"
        clearInterval(regIntervalId)
        charObject.health = charMaxHealth
        loadBattle()
    }
}

let loadScreen = () => {
    loadBattle()
    loadStats()
    loadCharacter()
    loadEnemyList()
    loadInventory()
}



loadScreen();