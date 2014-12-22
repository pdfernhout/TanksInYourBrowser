/* jshint devel: true */
/* jshint browser: true */
/* jshint -W097 */

"use strict";

var canvas = document.getElementById("tankCanvas");
var context = canvas.getContext('2d');
var imageScale = 0.20;

var tank1 = {
    x: 500,
    y: 500,
    bodyRotation: 1.0,
    turretRotation: 1.0,
    bodyImage: new Image()
};

function drawCaptureCircle() {
    context.beginPath();
    context.arc(95, 50, 40, 0, 2 * Math.PI);
    context.stroke();
}

function drawTank(tank) {
    var bodyImage = tank.bodyImage;
    
    context.save();
    context.translate(tank.x * imageScale, tank.y * imageScale);
    context.scale(imageScale, imageScale);
    context.rotate(1.0);
    context.translate( -bodyImage.width * imageScale / 2, -bodyImage.height * imageScale / 2);
    context.drawImage(bodyImage, 0, 0);
    context.restore();
}

function keypress(event) {
    var tank = tank1;
   console.log("keypress event detected: ", event);
   if (event.key === 'a' || event.key === 'A') {
       tank.x = tank.x - 10;
   } else if (event.key === 'd' || event.key === 'D') {
       tank.x = tank.x + 10;
   } else if (event.key === 'w' || event.key === 'W') {
       tank.y = tank.y - 10;
   } else if (event.key === 's' || event.key === 'S') {
       tank.y = tank.y + 10;
   }
   drawAll();
}

function drawAll() {
    context.clearRect ( 0 , 0 , canvas.width, canvas.height );
    drawCaptureCircle();
    drawTank(tank1);
}

function setup() {

    tank1.bodyImage.src = 'images/tank1imagev2.png';
    
    window.onkeypress = keypress;
}

setup();
drawAll();