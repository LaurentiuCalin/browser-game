"use strict";
//get assets from last game 

var coins = parseInt(localStorage.getItem('coins'));
var currentAmmo = parseInt(localStorage.getItem('currentAmmo'));
var currentLife  = parseInt(localStorage.getItem('currentLife'));

//Get weapons from last game 

var weapons =  jQuery.parseJSON(localStorage.getItem('weapons'));

var screen = document.getElementById('winScreen');
var score = coins* currentAmmo;
screen.innerHTML="<h2>You have finished the game with: "+ coins + " coins and " + currentAmmo + " ammo. </h2><h4> Your score is "+ score  + "</h4>";