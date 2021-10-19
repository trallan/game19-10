let stats = document.getElementById('stats');
let character = document.getElementById('character')

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

let loadCharacter = () => {
    character.innerHTML = `
        <div><p>Health: ${charObject.health + statsObject.stamina*5}</p></div>
        <div><p>Damage: ${charObject.damage + statsObject.strength*3}</p></div>
        <div><p>Mana: ${charObject.mana + statsObject.intelligence*15}</p></div>
        <div><p>Attack speed: ${charObject.atkspeed + statsObject.dexterity*0.2}</p></div>
    `
}

////////////////////////// LEVEL UP ///////////////////////////////////
let levelUp = () => {
    statsObject.level += 1;
    statsObject.points += 5;
    oldPoints += 5;
    loadStats();
}

let loadScreen = () => {
    loadStats()
    loadCharacter()
}

loadScreen();

