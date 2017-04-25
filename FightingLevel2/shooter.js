"use strict"
var stage, hero, queue, heroGunPistolSpriteSheet, heroGunShotgunSpriteSheet, heroGunRifleSpriteSheet, ghostStileSheet;
var preloadText;
var enemies=[];
var bullets=[];
var score=0;
var keys = {
    left: false,
    right:false
}
var splash;
var bgMusic;
var hearts=[];
var scoreDOM=document.querySelector('#score');
var canvasDOM=document.querySelector('#myGame');
//get assets from last game 

var coins = parseInt(localStorage.getItem('coins'));
var currentAmmo = parseInt(localStorage.getItem('currentAmmo'));
var currentLife  = parseInt(localStorage.getItem('currentLife'));
var score = parseInt(localStorage.getItem('totalScore'));

//Get weapons from last game 

var weapons =  jQuery.parseJSON(localStorage.getItem('weapons'));

function init(){
    stage = new createjs.Stage('myGame');
    preloadText = new createjs.Text("Loading", "30px Verdana", "#FFF");
    stage.addChild(preloadText);
    queue = new createjs.LoadQueue(true);
    queue.on('progress', progress);
    queue.on('complete', clickDoc);
    queue.installPlugin(createjs.Sound);
    queue.loadManifest([
        {"id":"heroGunPistolSS", "src":"../heroGunPistol.json"},
        {"id":"heroGunShotgunSS", "src":"../heroGunShotgun.json"},
        {"id":"heroGunRifleSS", "src":"../heroGunRifle.json"},
        {"id":"ghostSS", "src":"ghosts.json"},
        {
            "id":"backMusic",
            "src":"../backgroundMusic.mp3"
        },
        {
            "id":"pSound",
            "src":"../pistol.wav"
        },
        {
            "id":"died",
            "src":"../ehh.wav"
        }

    ]);
    

}
function clickDoc(){
    canvasDOM.addEventListener('click', setup)
}
function progress(e){
    preloadText.text = Math.floor(e.progress*100)+"%";
    stage.update();
}
function setup(){
    canvasDOM.removeEventListener('click', setup)
    canvasDOM.classList.remove('bg')
    stage.removeChild(preloadText);
     heroGunPistolSpriteSheet = new createjs.SpriteSheet(queue.getResult('heroGunPistolSS'));
    heroGunShotgunSpriteSheet = new createjs.SpriteSheet(queue.getResult('heroGunShotgunSS'));
    heroGunRifleSpriteSheet = new createjs.SpriteSheet(queue.getResult('heroGunRifleSS'));
    ghostStileSheet = new createjs.SpriteSheet(queue.getResult('ghostSS'));
    bgMusic = createjs.Sound.play("backMusic");
    bgMusic.volume=0.3;

   if(weapons.rifle===true){
        hero = new createjs.Sprite(heroGunRifleSpriteSheet, "right")
    }else if (weapons.shotgun===true){
        hero = new createjs.Sprite(heroGunShotgunSpriteSheet, "right")
    }else{
        hero = new createjs.Sprite(heroGunPistolSpriteSheet,"right");
    }
    hero.lives=currentLife;
    var xPos=stage.canvas.width-100;
    for(var i=0; i<hero.lives; i++){
        var t = new createjs.Bitmap('heart.png');
        t.x=xPos;
        xPos-=80;
        hearts.push(t)
        stage.addChild(t)
    }
    stage.addChild(hero);
    hero.x = 350;
    hero.y = 230;
    hero.width = 105;
    hero.height = 108;
    hero.direction='right';
    window.onkeyup = keyUp;
    window.onkeydown = keyDown;
    createjs.Ticker.setFPS(60);
    createjs.Ticker.addEventListener('tick', tickHappened);
}

function keyDown(e){
    if(e.keyCode==37){
        keys.left=true;
    }
    if(e.keyCode==39){
        keys.right=true;
    }
}

function keyUp(keyEvent){
    //console.log(keyEvent.keyCode);
    if(keyEvent.keyCode===32){
        if(currentAmmo > 0 ){
                if(weapons.rifle===true){
                    fireRifle();
                } else if (weapons.shotgun===true){
                    fireShotgun();
                }else {
                    firePistol();
                }
            
            //  console.log(weapons.pistol);
        }else{
            console.log('ai ramas fara ammo');
        }
    }
    if(keyEvent.keyCode==37){
        keys.left=false;
    }
    if(keyEvent.keyCode==39){
        keys.right=false;
    }
}
function firePistol(){
    var pistolShotSound = new Audio("../pistolSound.mp3")
    pistolShotSound.play();
    var t = new createjs.Bitmap('../miniProjectJavaScript/img/sprites/pistolShell.png');
    t.width=9;
    t.height=6;
    stage.addChild(t);
    if(hero.direction=='right') {
        t.x = hero.x + 100;
        t.direction = hero.direction
        t.y = hero.y + 70;
        t.scaleX = -1;
        bullets.push(t);
    }
    else{t.x = hero.x ;
        t.direction = hero.direction
        t.y = hero.y + 70;
        bullets.push(t);
    }
    createjs.Sound.play('pSound');
    currentAmmo--;
}

function fireShotgun(){
    
var shotgunShotSound = new Audio("../shotgunSound.mp3")
    shotgunShotSound.play();
    var t = new createjs.Bitmap('../miniProjectJavaScript/img/sprites/shotgunShell.png');
    t.width=16;
    t.height=6;
    stage.addChild(t);
    if(hero.direction=='right') {
        t.x = hero.x + 100;
        t.direction = hero.direction
        t.y = hero.y + 70;
        t.scaleX = -1;
        bullets.push(t);
    }
    else{t.x = hero.x ;
        t.direction = hero.direction
        t.y = hero.y + 70;
        bullets.push(t);
    }
    createjs.Sound.play('pSound');
    currentAmmo--;
}

function fireRifle(){
    
var rifleShotSound = new Audio("../rifleSound.mp3")
    rifleShotSound.play();
    var t = new createjs.Bitmap('../miniProjectJavaScript/img/sprites/rifleShell.png');
    t.width=16;
    t.height=6;
    stage.addChild(t);
    if(hero.direction=='right') {
        t.x = hero.x + 100;
        t.direction = hero.direction
        t.y = hero.y + 70;
        t.scaleX = -1;
        bullets.push(t);
    }
    else{t.x = hero.x ;
        t.direction = hero.direction
        t.y = hero.y + 70;
        bullets.push(t);
    }
    createjs.Sound.play('pSound');
    currentAmmo--;
}

function checkForNewEnemy(){
    var rand = Math.floor(Math.random()*1001);
   
    //console.log(rand);
    if(rand < 3){

        //console.log("new enemy", rand);
        var temp = new createjs.Sprite(ghostStileSheet,"left");
        temp.direction='left'
        temp.x=Math.floor(Math.random()*300);
        temp.width=120;
        temp.height=120;
        temp.x=1000;
        temp.y=230;
        temp.life=2
        stage.addChild(temp);
        enemies.push(temp)
        //console.log(enemies.length);
    } else if(rand <7){
        var temp = new createjs.Sprite(ghostStileSheet,"right");
        temp.x=Math.floor(Math.random()*300);
        temp.direction='right'
        temp.width=120;
        temp.height=120;
        temp.x=0;
        temp.y=230;
        temp.life=2
        stage.addChild(temp);
        enemies.push(temp)
    }
}
setInterval(checkForNewEnemy(), 1000);
function moveEnemies(){

        for (var i = enemies.length - 1; i >= 0; i--) {
            if (score<=13) {
                if (enemies[i].direction == 'left') {
                    enemies[i].x -= 2;
                } else {
                    enemies[i].x += 2;
                }
            } else {
                if (enemies[i].direction == 'left') {
                    enemies[i].x -= 3;
                } else {
                    enemies[i].x += 3;
                }
            }
        }
    }




function moveBullets(){
    for(var b = bullets.length-1; b>=0; b--){
        if(bullets[b].direction=='left'){
            bullets[b].x-=8;
        } else {
            bullets[b].x+=8;
        }
        /*
        bullets[b].x-=-8;
        if(bullets[b].x<-10){
            stage.removeChild(bullets[b]);
            bullets.splice(b, 1)
        }*/
    }
}

function moveHero(){

    if(keys.left){
        hero.x-=3;
        hero.direction='left';
        if(hero.currentAnimation!="left") {
            hero.gotoAndPlay("left");
        }

        if(hero.x<0){
            hero.x=0;
        }
    }
    if(keys.right){
        hero.x+=3;
        hero.direction='right';//TODO swicth sprite

        if(hero.currentAnimation!="right") {
            hero.gotoAndPlay("right");
        }

        if(hero.x > stage.canvas.width-100){
            hero.x = stage.canvas.width-100;
        }
    }
}

function hitTest(rect1, rect2){
    if ( rect1.x >= rect2.x + rect2.width
        || rect1.x + rect1.width <= rect2.x
        || rect1.y >= rect2.y + rect2.height
        || rect1.y + rect1.height <= rect2.y )
    {
        return false;
    }
    return true;
}

function checkCollisions(){
    var b, e, c;
    for(e=enemies.length-1; e>=0; e--){
        if(hitTest(hero, enemies[e])){

            hero.lives--;
            var temp = hearts.pop();
            stage.removeChild(temp);
            stage.removeChild(enemies[e]);
            enemies.splice(e,1)
            if(hero.lives<1){
                alert("you have died! Try again!");
                location.reload();

            }
        }
    }
    for(b=bullets.length-1; b>=0; b--){
        for(e=enemies.length-1; e>=0; e--){
            if(hitTest(bullets[b], enemies[e])){
                //console.error("we have a hit")
                stage.removeChild(bullets[b]);
                bullets.splice(b,1);
                if(weapons.rifle===true){
                    enemies[e].life-=2;
                } else if (weapons.shotgun===true) {
                    enemies[e].life-=1
                } else {
                    enemies[e].life-=0.5;
                }
                
               //console.log(enemies[e].life)
                if (enemies[e].life<0.5){
                    stage.removeChild(enemies[e]);
                    enemies.splice(e,1)
                    //console.log(enemies.length, "enemies left")
                    coins++;
                    score+=1;
                    scoreDOM.innerHTML=score;
                    createjs.Sound.play('died');
                    if(score==25){
                        coins+=20;
                        localStorage.setItem('coins', coins);
                        localStorage.setItem('currentAmmo', currentAmmo);
                        localStorage.setItem('currentLife', hero.lives);
                        localStorage.setItem('totalScore', score);
                    function storedWeapons(pistol,rifle,shotgun) {
                      this.pistol = pistol;
                      this.rifle = rifle;
                      this.shotgun = shotgun;
                    }

                        var test = new storedWeapons(weapons.pistol, weapons.rifle, weapons.shotgun);
                
                localStorage.setItem('weapons', JSON.stringify(test));
                        
                        alert("you finished the level");
                        window.location = ("../miniProjectJavaScript/index3.html")
                    }
                }
            }
        }
    }

    for(e=enemies.length-1; e>=0; e--){
        if(hitTest(hero, enemies[e])){

            hero.lives--;
            var temp = hearts.pop();
            stage.removeChild(temp);
            hero.girlFriend=null;
            stage.removeChild(enemies[e]);
            enemies.splice(e,1)
            if(hero.lives<1){
                //alert("you have died! Try again!");
                //location.reload();

            }
        }
    }
}


function tickHappened(myEvent){
    checkForNewEnemy();
    moveEnemies();
    moveBullets();
    moveHero();
    checkCollisions();
    stage.update(myEvent);
}