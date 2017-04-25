"use strict";
var stage, grid = [], hero, preloadText, queue;
var levels = [], currentLevel = 1, tileSize = 48;
var omusteanSpriteSheet;
var keys = {
    up: false,
    down: false,
    left: false,
    right: false
};
var bgMusic;
var buttons = document.querySelectorAll("button");
var ammoPrice = 10;
var lifePrice = 15;
var riflePrice = 50;
var shotgunPrice = 30;
var shopMessage = "";

var inventoryPistol = document.getElementById("pistolIMG");
var inventoryRifle = document.getElementById("rifleIMG");
var inventoryShotgun = document.getElementById("shotgunIMG");
var vid = document.getElementById("firstDialog");
var secondVid = document.getElementById("secondDialog");
var pressToClose = "<p style='bottom:0; position:absolute; left:20px; color:white;'>Press 'i' to close</p>";
var vid = document.getElementById("thirdDialog");

//get assets from last game 

var coins = parseInt(localStorage.getItem('coins'));
var currentAmmo = parseInt(localStorage.getItem('currentAmmo'));
var currentLife  = parseInt(localStorage.getItem('currentLife'));
var score = parseInt(localStorage.getItem('totalScore'));

//Get weapons from last game 

var weapons =  jQuery.parseJSON(localStorage.getItem('weapons'));


function preload(){
    stage = new createjs.Stage("canvasLevel3");
    preloadText = new createjs.Text("Hello", "50px Courier New", "#000");
    stage.addChild(preloadText);
    queue = new createjs.LoadQueue(true);
    queue.installPlugin(createjs.Sound);
    queue.on("progress", queueProgress);
    queue.on("complete", queueComplete);
    queue.loadManifest([
        "img/sprites/tiles.png",
        {id:"tileSprites",src:"json/bgtiles.json"},
        {id:"levelJson",src:"json/levels/levels.json"},
        {id: "omusteanSS", src:"omustean.json"},
        {id:"backMusic", src:"../backgroundMusic.mp3"},
        "img/sprites/pistol.png"
    ])
    bgMusic = createjs.Sound.play("backMusic");
    bgMusic.volume=0.3;
    bgMusic.loop=true;
}

function queueProgress(e) {

    preloadText.text = Math.round(e.progress * 100) + "%";
    stage.update();
}

//document.getElementById("inventory").innerHTML = "<h2>You have "+coins + " coins and the following items:</h2>"+pressToClose;
document.getElementById("shop").innerHTML = "<div style='display: inline-block; margin-right: 110px; margin-bottom: 30px'><img src='img/sprites/ammo.png'>*5 = 10coins</div><div style='display:inline-block; width=150px;'><img src='img/sprites/shotgun.png'>*1 = 30coins</div><div style='display:inline-block; width=150px; margin-right: 110px;'><img src='img/sprites/heart.png'>*1 = 15coins</div><div style='display:inline-block; width=150px;'><img src='img/sprites/rifle.png'>*1 = 50coins</div><p style='bottom:0; position:absolute; left:20px; color:black;'>Press 'x' to close</p>";
var vid = document.getElementById("fourthDialog");

function playVid() {
    vid.style.display = 'block';
    bgMusic.volume = 0;
    vid.play();
}

function pauseVid() {
    vid.pause();
    secondVid.pause();
}
function removeFourthDialog() {
    var removeFourthDialog = document.getElementById('fourthDialog');
    removeFourthDialog.parentNode.removeChild(removeFourthDialog);

    var addCanvas = document.getElementById('canvasLevel3').style.display='block';
    bgMusic.volume = 1;
    return false;
}
function queueComplete(){


    var t = queue.getResult("levelJson")
    for(var i=0; i< t.levels.length; i++){
        levels.push(t.levels[i])
    }
    setupLevel();


    window.onkeyup = keyUp;
    //window.onkeydown = keyDown;
    createjs.Ticker.setFPS(30);
    createjs.Ticker.on("tick", function(e){stage.update(e)})
}


function setupLevel(){
    stage.removeAllChildren();
    currentLevel++;
    if(currentLevel==levels.length){
        gameWon()
    }
    bgMusic = createjs.Sound.play("backMusic");
    bgMusic.volume=0;

    var ss = new createjs.SpriteSheet(queue.getResult('tileSprites'));

    //console.log();
    var level = levels[currentLevel].tiles;

    grid=[]
    for(var i=0; i < level.length; i++){
        grid.push([]);
        for(var z=0; z< level[0].length; z++){
            grid[i].push(null);
        }
    }

    //test=level;
    var heroRow, heroCol;
    for(var row=0; row<level.length; row++){
        for(var col =0; col<level[0].length; col++){
            var img='';
            switch(level[row][col]){
                case 0:
                    img = "sandTopLeft";
                    break;
                case 1:
                    img = "sandTopMiddle";
                    break;
                case 2:
                    img = "sandTopRight";
                    break;
                case 3:
                    img = "snowTopLeft";
                    break;
                case 4:
                    img = "snowTopMiddle";
                    break;
                case 5:
                    img = "snowTopRight";
                    break;
                case 6:
                    img = "swampTopLeft";
                    break;
                case 7:
                    img = "swampTopMiddle";
                    break;
                case 8:
                    img = "swampTopRight";
                    break;
                case 9:
                    img = "grassWatterTopLeft";
                    break;
                case 10:
                    img = "grassWatterTopMiddle";
                    break;
                case 11:
                    img = "grassWatterTopRight";
                    break;
                case 12:
                    img = "sandWatterTopLeft";
                    break;
                case 13:
                    img = "sandWatterTopMiddle";
                    break;
                case 14:
                    img = "sandWaterTopRight";
                    break;
                case 15:
                    img = "sandPalmTreeTopLeft";
                    break;
                case 16:
                    img = "sandPalmTreeTopMiddle";
                    break;
                case 17:
                    img = "sandPalmTreeTopRight";
                    break;
                case 18:
                    img = "sandMiddleLeft";
                    break;
                case 19:
                    img = "sandMiddleMiddle";
                    break;
                case 20:
                    img = "sandMiddleRight";
                    break;
                case 21:
                    img = "snowMiddleLeft";
                    break;
                case 22:
                    img = "snowMiddleMiddle";
                    break;
                case 23:
                    img = "snowMiddleRight";
                    break;
                case 24:
                    img = "swampMiddleLeft";
                    break;
                case 25:
                    img = "swampMiddleMiddle";
                    break;
                case 26:
                    img = "swampMiddleRight";
                    break;
                case 27:
                    img = "grassWatterMiddleLeft";
                    break;
                case 28:
                    img = "grassWatterMiddleMiddle";
                    break;
                case 29:
                    img = "grassWatterMiddleRight";
                    break;
                case 30:
                    img = "sandWatterMiddleLeft";
                    break;
                case 32:
                    img = "sandWatterMiddleRight";
                    break;
                case 33:
                    img = "sandPalmTreeMiddleLeft";
                    break;
                case 34:
                    img = "sandPalmTreeMiddleMiddle";
                    break;
                case 35:
                    img = "sandPalmTreeMiddleRight";
                    break;
                case 36:
                    img = "sandDownLeft";
                    break;
                case 37:
                    img = "sandDownMiddle";
                    break;
                case 38:
                    img = "sandDownRight";
                    break;
                case 39:
                    img = "snowDownLeft";
                    break;
                case 40:
                    img = "snowDownMiddle";
                    break;
                case 41:
                    img = "snowDownRight";
                    break;
                case 42:
                    img = "swampDownLeft";
                    break;
                case 43:
                    img = "swampDownMiddle";
                    break;
                case 44:
                    img = "swampDownRight";
                    break;
                case 45:
                    img = "grassWatterDownLeft";
                    break;
                case 46:
                    img = "grassWatterDownMiddle";
                    break;
                case 47:
                    img = "grassWatterDownRight";
                    break;
                case 48:
                    img = "sandWatterDownLeft";
                    break;
                case 49:
                    img = "sandWatterDownMiddle";
                    break;
                case 50:
                    img = "sandWatterDownRight";
                    break;
                case 51:
                    img = "sandPalmTreeDownLeft";
                    break;
                case 52:
                    img = "sandPalmTreeDownMiddle";
                    break;
                case 53:
                    img = "sandPalmTreeDownRight";
                    break;
                case 54:
                    img = "pineTreeTopLeft";
                    break;
                case 55:
                    img = "pineTreeTopMiddle";
                    break;
                case 56:
                    img = "pineTreeTopRight";
                    break;
                case 57:
                    img = "gun";
                    break;
                case 58:
                    img = "enemy";
                    break;
                case 59:
                    img = "continue";
                    break;
                case 60:
                    img = "evilHero";
                    break;                    
                case 62:
                    img = "grassMountainTopLeft";
                    break;
                case 63:
                    img = "grassMountainTopMiddle";
                    break;
                case 64:
                    img = "grassMountainTopRight";
                    break;
                case 68:
                    img = "sandCity";
                    break;
                case 72:
                    img = "pineTreeMiddleLeft";
                    break;
                case 73:
                    img = "pineTreeMiddleMiddle";
                    break;
                case 74:
                    img = "pineTreeMiddleRight";
                    break;
                case 80:
                    img = "grassMountainMiddleLeft";
                    break;
                case 81:
                    img = "grassMountainMiddleMiddle";
                    break;
                case 82:
                    img = "grassMountainMiddleRight";
                    break;
                case 86:
                    img = "sandCity2";
                    break;
                case 90:
                    img = "pineTreeDownLeft";
                    break;
                case 91:
                    img = "pineTreeDownMiddle";
                    break;
                case 92:
                    img = "pineTreeDownRight";
                    break;
                case 98:
                    img = "grassMountainDownLeft";
                    break;
                case 99:
                    img = "grassMountainDownMiddle";
                    break;
                case 100:
                    img = "grassMountainDownRight";
                    break;
                case 142:
                    img = "redHouse";
                    break;
                case 143:
                    img = "shop";
                    break;
                case 160:
                    img = "grassCity";
                    break;
                case 161:
                    img = "ferryWheel";
                    break;
                case 181:
                    img = "walkingPath";
                    break;
                case 240:
                    img = "grass";
                    break;
                case 289:
                    img = "bridge";
                    break;
                case 401:
                    img = "bridge";
                    heroRow=row;
                    heroCol=col;
                    break;
                case 275:
                    img="castle1";
                    break;
                case 276:
                    img="castle2";
                    break;
                case 293:
                    img="castle3";
                    break;
                case 294:
                    img="castle4";
                    break;
                case 311:
                    img="castle5";
                    break;
                case 312:
                    img="castle6";
                    break;
            }
            var tile = new createjs.Sprite(ss, img);
            tile.x=col*tileSize;
            tile.y=row*tileSize;
            tile.row=row;
            tile.col=col;
            tile.tileNumber=level[row][col];
            if(level[row][col]==401){
                tile.tileNumber=289;
            }
            if(level[row][col]==402){
                tile.tileNumber=240;
            }
            stage.addChild(tile);
            grid[row][col]=tile;
        }
    }
    omusteanSpriteSheet = new createjs.SpriteSheet(queue.getResult('omusteanSS'));
    hero = new createjs.Sprite(omusteanSpriteSheet, "down");
    hero.x=heroCol*tileSize;
    hero.y=heroRow*tileSize;
    hero.row=heroRow;
    hero.col=heroCol;
    hero.ammo=currentAmmo;
    hero.life=currentLife;
    stage.addChild(hero);
}

function keyUp(e) {
    switch (e.keyCode) {
        case 37:
            moveTo(0, -1)
            hero.gotoAndPlay("left");
            break;
        case 38:
            moveTo(-1, 0)
            hero.gotoAndPlay("up");
            break;
        case 39:
            moveTo(0, 1)
            hero.gotoAndPlay("right");
            break;
        case 40:
            moveTo(1, 0)
            hero.gotoAndPlay("down");
            break;
        case 73:
            toggleInventory();
            break;
        case 88:
            toggleShop();
            break;
    }

}

function toggleInventory() {
    var inventory = document.getElementById('inventory');
    if ( inventory.style.display != 'none' ) {
        inventory.style.display = 'none';
        inventoryPistol.style.display="none";
        inventoryRifle.style.display="none";
        inventoryShotgun.style.display="none";
    }
    else {
        if(weapons.pistol===true){
            inventoryPistol.style.display="block";
        }
        if(weapons.rifle===true){
            inventoryRifle.style.display="block";
        }
        if(weapons.shotgun===true){
            inventoryShotgun.style.display="block";
        }
        inventory.style.display = 'block';        
        document.getElementById("inventory").innerHTML = "<h2>You have "+coins+ " coins, "+hero.life+" lifes and the following items:</h2><img src='img/sprites/ammo.png'/>= "+currentAmmo+pressToClose;
    }
}


function toggleShop() {
    var shop = document.getElementById('shop');

    if ( shop.style.display != 'none' ) {
        shop.style.display = 'none';
        shopMessage="";
        document.getElementById("shopMessage").innerHTML=shopMessage;
        document.getElementById("shopMessage").style.display="none";
        for (var i = 0; i < buttons.length; i++) {
                buttons[i].style.display = 'none';
            }
    }
    //document.getElementById("inventory").innerHTML = "<h2>You have "+coins+ " coins and the following items:</h2><img src='img/sprites/pistol.png'/><br/><img src='img/sprites/ammo.png'/>= "+hero.ammo+pressToClose;

}


function buyAmmo(){
    if (coins>=ammoPrice){
        coins-=ammoPrice;
        currentAmmo=currentAmmo+5;
        shopMessage="<span style='background-color:blue; color:white'>You bought 5 ammo</span>";
        document.getElementById("shopMessage").innerHTML=shopMessage;
    }else{
        shopMessage="You don't have enough coins";
        document.getElementById("shopMessage").innerHTML=shopMessage;
    }
}

function buyLife(){
    if (coins>=lifePrice && currentLife<3){
        coins-=lifePrice;
        currentLife+=1;
        shopMessage="<span style='background-color:blue; color:white'>You bought 1 life</span>";
        document.getElementById("shopMessage").innerHTML=shopMessage;
    }else if(coins<lifePrice){
        shopMessage="You don't have enough coins";
        document.getElementById("shopMessage").innerHTML=shopMessage;
    }else{
        shopMessage="You already have 3 lifes";
        document.getElementById("shopMessage").innerHTML=shopMessage;
    }
}

function buyRifle(){
    if (weapons.rifle!=true && coins>=riflePrice){
        coins-=riflePrice;
        weapons.rifle=true;
        shopMessage="<span style='background-color:blue; color:white'>You bought a Rifle</span>";
        document.getElementById("shopMessage").innerHTML=shopMessage;
    }else if(coins<riflePrice){
        shopMessage="You don't have enough coins";
        document.getElementById("shopMessage").innerHTML=shopMessage;
    }else{
        shopMessage="You already own a rifle";
        document.getElementById("shopMessage").innerHTML=shopMessage;
    }
}

function buyShotgun(){
    if (weapons.shotgun!=true && coins>=shotgunPrice){
        coins-=shotgunPrice;
        weapons.shotgun=true;
        shopMessage="<span style='background-color:blue; color:white'>You bought a Shotgun</span>";
        document.getElementById("shopMessage").innerHTML=shopMessage;
    }else if(coins<shotgunPrice){
        shopMessage="You don't have enough coins";
        document.getElementById("shopMessage").innerHTML=shopMessage;
    }else{
        shopMessage="You already own a Shotgun";
        document.getElementById("shopMessage").innerHTML=shopMessage;
    }
}

function moveTo(rowModifier, colModifier){
    var newCol = hero.col+colModifier;
    var newRow = hero.row+rowModifier;
    if(isValidTile(newRow, newCol)){
        hero.row=newRow;
        hero.col=newCol;
        hero.x=newCol*tileSize+tileSize/4;
        hero.y=newRow*tileSize;
    }
}
function isValidTile(row, col){
    switch(grid[row][col].tileNumber){
        case 240:
            return true;
            break;
        case 181:
            return true;
            break;
        case 289:
            return true;
            break;
        case 60:
            var removeCanvas = document.getElementById('canvasLevel3').style.display='none';
            playVid();
            grid[row][col].gotoAndStop("bridge");
            grid[row][col].tileNumber=0;    
            return true;
            break;
        case 15, 16, 17, 33, 34, 35, 51, 52, 53, 54,55,56,72,73,74,90,91,92,62,63,64,80,81,82:
            return false;
            break;
         case 57:
            weapons.pistol=true;
            grid[row][col].gotoAndStop("grass");
            grid[row][col].tileNumber=240;
            currentAmmo+=5;
            //document.getElementById("inventory").innerHTML = "<h2>You have "+coins+ " coins and the following items:</h2><img src='img/sprites/pistol.png'/><br/><img src='img/sprites/ammo.png'/>= "+hero.ammo+pressToClose;
            return true;
            break;
        case 142:
            var removeCanvas = document.getElementById('canvasLevel3').style.display='none';
            playVid();    
            return true;
            break;
        case 143:
            var showShop = document.getElementById('shop').style.display='block';
            document.getElementById("shopMessage").style.display="block";
            for (var i = 0; i < buttons.length; i++) {
                buttons[i].style.display = 'block';
            }
            
            return true;
            break;
        case 293:
            if(currentAmmo>20){
            var removeCanvas = document.getElementById('canvasLevel3').style.display='none';  
                localStorage.setItem('coins', coins);
                localStorage.setItem('currentAmmo', currentAmmo);
                localStorage.setItem('currentLife', currentLife);
                localStorage.setItem('totalScore', score);
               // localStorage.setItem('weapons', weapons);
                
                
                function storedWeapons(pistol,rifle,shotgun) {
                      this.pistol = pistol;
                      this.rifle = rifle;
                      this.shotgun = shotgun;
                    }

var test = new storedWeapons(weapons.pistol, weapons.rifle, weapons.shotgun);
                
                localStorage.setItem('weapons', JSON.stringify(test));
                
                
                window.location = "../FightingLevel3/shooter.html";
                grid[row][col].gotoAndStop("bridge");
                grid[row][col].tileNumber=289;

                return true;
            } else {
            alert("You need more ammo!")
            return false;
        }
            break;
        case 59:
            setupLevel();
            break;

    }
}
function tock(e) {
    moveHero();
    stage.update(e);
}