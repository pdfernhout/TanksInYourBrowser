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
    context.scale(imageScale, imageScale);
    context.translate(tank.x, tank.y);
    context.rotate(tank.bodyRotation);
    context.translate( -bodyImage.width / 2, -bodyImage.height / 2);
    context.drawImage(bodyImage, 0, 0);
    context.restore();
}

function move(tank, distance) {
    tank.x = tank.x + distance * Math.cos(tank.bodyRotation + 3.14159265 * 0.5);
    tank.y = tank.y + distance * Math.sin(tank.bodyRotation + 3.14159265 * 0.5);
}

function keypress(event) {
    var tank = tank1;
   console.log("keypress event detected: ", event);
   if (event.key === 'a' || event.key === 'A') {
       tank.bodyRotation = tank.bodyRotation - 0.1;
   } else if (event.key === 'd' || event.key === 'D') {
       tank.bodyRotation = tank.bodyRotation + 0.1;
   } else if (event.key === 'w' || event.key === 'W') {
       move(tank, -10);
   } else if (event.key === 's' || event.key === 'S') {
       move(tank, 10);
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