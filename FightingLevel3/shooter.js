"use strict";
var stage, hero, queue, heroGunPistolSpriteSheet, heroGunShotgunSpriteSheet, heroGunRifleSpriteSheet, ghostStileSheet,evilBat, batHealth;
var preloadText;
var enemies=[];
var bullets=[];
var evilBatLives=[];
var evilBullets=[];

//get assets from last game 

var coins = parseInt(localStorage.getItem('coins'));
var currentAmmo = parseInt(localStorage.getItem('currentAmmo'));
var currentLife  = parseInt(localStorage.getItem('currentLife'));
var score = parseInt(localStorage.getItem('totalScore'));

//Get weapons from last game 

var weapons =  jQuery.parseJSON(localStorage.getItem('weapons'));


var keys = {
    left: false,
    right:false,
    upArrow:false
}
var splash;
var bgMusic;
var hearts=[];
var scoreDOM=document.querySelector('span');
var canvasDOM=document.querySelector('#myGame');
var temp = new createjs.Bitmap("evil.png");
var evilHealthBar=document.querySelector('#evilHealthBar');

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
        {
            "id":"backMusic",
            "src":"backgroundMusic.mp3"
        },
        {
            "id":"pSound",
            "src":"pistol.wav"
        }
       

    ]);


}
function clickDoc(){
    canvasDOM.addEventListener('click', setup)
}
function progress(e){
    preloadText.text = "Loading " + Math.floor(e.progress*100)+"%" + "\n"+ "Click to continue";
    preloadText.width= 100;
    preloadText.height=50;
    preloadText.x=stage.canvas.width/2-preloadText.width;
    preloadText.y=stage.canvas.height-preloadText.height-20;
    stage.update();
}

function setup(){
    canvasDOM.removeEventListener('click', setup);
    canvasDOM.classList.remove('bg');
    stage.removeChild(preloadText);
     heroGunPistolSpriteSheet = new createjs.SpriteSheet(queue.getResult('heroGunPistolSS'));
    heroGunShotgunSpriteSheet = new createjs.SpriteSheet(queue.getResult('heroGunShotgunSS'));
    heroGunRifleSpriteSheet = new createjs.SpriteSheet(queue.getResult('heroGunRifleSS'));
    ghostStileSheet = new createjs.SpriteSheet(queue.getResult('ghostSS'));
    bgMusic = createjs.Sound.play("backMusic");
    bgMusic.volume=0.3;

    evilBat = new createjs.Bitmap('evil.png');
    evilBat.evilBatLives=15;
    var bxPos=10;
    for(var i=0; i<evilBat.evilBatLives; i++){
        var t = new createjs.Bitmap('evilHeart.png');
        t.x=bxPos;
        bxPos+=48;
        evilBatLives.push(t)
        stage.addChild(t)
    }
    batHealth = new createjs.Text("Evil Bat health", "20px Verdana", "#FFF");
    batHealth.width= 100;
    batHealth.height=50;
    batHealth.x=190;
    batHealth.y=40;
    stage.addChild(batHealth)
    evilBat.height=51;
    evilBat.width=72;
    evilBat.x=stage.canvas.width-100;
    evilBat.y=stage.canvas.height/2+150;
    evilBat.xDir=4;
    evilBat.yDir=5;
    stage.addChild(evilBat)


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
    hero.x = 150;
    hero.y = 400;
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
    if(e.keyCode==38){
        keys.upArrow=true;
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
    if(keyEvent.keyCode==38){
        keys.upArrow=false;
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

function evilFireLoop(){
    var rand = Math.floor(Math.random()*1001);
    for (var i = 0; i >= 0; i--) {
        if(rand<10){
        evilFire();
        }
    };
}

function evilFire(){
    var t= new createjs.Shape();
    t.graphics.beginFill('orange').drawRect(0,0,5,5);      
    t.width=5;
    t.height=5;
    t.x=evilBat.x;
    t.y=evilBat.y+evilBat.height/2;
    stage.addChild(t);
    evilBullets.push(t);
}

function moveEvilBullets(){
    var rand = Math.floor(Math.random()*1001);
    for (var b = evilBullets.length - 1; b >= 0; b--) {
        
            evilBullets[b].x-=5;
        
    
    if(evilBullets[b].x<-10 || evilBullets[b].y>stage.canvas.height+10){
            stage.removeChild(evilBullets[b]);
            evilBullets.splice(b, 1);
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
        
        if(bullets[b].x<-10 || bullets[b].x>stage.canvas.width+10){
            stage.removeChild(bullets[b]);
            bullets.splice(b, 1);
        }
    }
}
function gravity(){
    var currentPos=hero.y;
    if(currentPos <= 400){
    hero.y+=7;
    }else currentPos=400;
}

function moveHero(){
    
    if(keys.upArrow){
        hero.y-=10;
        if(hero.y >= 200){
            hero.y=250;
        }

    }
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

function moveEvilBat(){
    evilBat.x+=evilBat.xDir;
    evilBat.y+=evilBat.yDir;
    if(evilBat.y > stage.canvas.height-evilBat.height){
        evilBat.yDir*=-1;
    }else if(evilBat.x > stage.canvas.width-evilBat.width) {
        evilBat.xDir*=-1;
    }else if(evilBat.y< 0){
        evilBat.yDir*=-1;
    }else if(evilBat.x < 0) {
        evilBat.xDir*=-1;
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
    for(b=bullets.length-1; b>=0; b--){
        
            if(hitTest(bullets[b], evilBat)){

                stage.removeChild(bullets[b]);
                bullets.splice(b,1)

                evilBat.evilBatLives--;
                var t = evilBatLives.pop();
                stage.removeChild(t)
                if(weapons.rifle===true){
                    evilBat.evilBatLives-=2;
                    stage.removeChild(t);
                    stage.removeChild(t);
                } else if (weapons.shotgun===true) {
                    evilBat.evilBatLives-=1
                } else {
                    evilBat.evilBatLives-=0.5;
                }
                if(evilBat.evilBatLives<1){
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
                    window.location = ('../miniProjectJavaScript/win.html')
                }
            }
    }
        for(b=evilBullets.length-1; b>=0; b--){
        
            if(hitTest(evilBullets[b], hero)){
                stage.removeChild(evilBullets[b]);
                evilBullets.splice(b,1)
                lostLife();
            }
    }

        if(hitTest(hero, evilBat)){
            lostLife();
            
    }
}

    function lostLife(){
    evilBat.x=stage.canvas.width-100;
    evilBat.y=stage.canvas.height/2+150;
    hero.x = 150;
    hero.y = 400;
    keys.left=false;
    keys.right=false;
    keys.upArrow=false;
    alert("you lost one life");
    hero.lives--;
    var temp = hearts.pop();
    stage.removeChild(temp);
    if(hero.lives<1){
        alert("you have died! Try again!");
        location.reload();
    }
}


function tickHappened(myEvent){
    moveEvilBat();
    evilFireLoop();
    moveEvilBullets();
    moveBullets();
    moveHero();
    gravity();
    checkCollisions();
    stage.update(myEvent);
}