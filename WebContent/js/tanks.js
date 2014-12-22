/* jshint devel: true */
/* jshint browser: true */
/* jshint -W097 */

"use strict";

// TODO: Fix shell offset when turret rotated

var imageScale = 0.20;

var shellRange = 10000;
var traverseSpeed = 0.03;
var turretSpeed = 0.03;
var fireWaitDelay_ms = 2000;

var canvas = document.getElementById("tankCanvas");
var context = canvas.getContext('2d');

var shells = [];
var downKeys = {};
var lastShotTime = new Date();

var shellImage = new Image();

var tank1 = {
    x: 500,
    y: 500,
    bodyRotation: 1.0,
    turretRotation: 0.0,
    bodyImage: new Image(),
    turretImage: new Image()
};

function drawCaptureCircle() {
    context.beginPath();
    context.arc(95, 50, 40, 0, 2 * Math.PI);
    context.stroke();
}

function drawTank(tank) {
    var bodyImage = tank.bodyImage;
    var turretImage = tank.turretImage;
    
    context.save();
    
    context.scale(imageScale, imageScale);
    context.translate(tank.x, tank.y);
    
    context.rotate(tank.bodyRotation);
    
    context.save();
    context.translate( -bodyImage.width / 2, -bodyImage.height / 2);
    context.drawImage(bodyImage, 0, 0);
    context.restore();
    
    context.translate( 0, -70);
    context.rotate(tank.turretRotation);
    context.translate( -turretImage.width / 2, -turretImage.height / 2 - 50);
    context.drawImage(turretImage, 0, 0);
    
    context.restore();
}

function drawShell(shell) {
    context.save();
    context.scale(imageScale, imageScale);
    context.translate(shell.x, shell.y);
    context.rotate(shell.direction);
    context.drawImage(shellImage, 0, 0);
    context.restore();
    
    // context.beginPath();
    // context.arc(shell.x * imageScale, shell.y * imageScale, 4, 0, 2 * Math.PI);
    // context.stroke();
}

function drawShells() {
    for (var shellIndex in shells) {
        var shell = shells[shellIndex];
        drawShell(shell);
    }
}

function moveTank(tank, distance) {
    tank.x = tank.x + distance * Math.cos(tank.bodyRotation - 3.14159265 * 0.5);
    tank.y = tank.y + distance * Math.sin(tank.bodyRotation - 3.14159265 * 0.5);
}

function moveShell(shell, distance) {
    shell.x = shell.x + distance * Math.cos(shell.direction - 3.14159265 * 0.5);
    shell.y = shell.y + distance * Math.sin(shell.direction - 3.14159265 * 0.5);
    shell.distance += distance;
    if (shell.distance > shellRange) return false;
    return true;
}

function fire(tank) {
    var now = new Date();
    var fireWait_ms = now.getTime() - lastShotTime.getTime();
    if (fireWait_ms < fireWaitDelay_ms) return;
    
    var barrelLength = 450;
    
    // var x = tank.x + -70 * Math.cos(shell.direction - 3.14159265 * 0.5) + 
    
    var shell = {x: tank.x, y: tank.y, direction: tank.bodyRotation + tank.turretRotation, distance: 0.0};
    moveShell(shell, barrelLength);
    shells.push(shell);
    lastShotTime = now;
}

function incrementShells() {
    var hadShells = shells.length;
    var shellsToKeep = [];
    var shellIndex;
    for (shellIndex in shells) {
        var shell = shells[shellIndex];
        var keep = moveShell(shell, 100);
        if (keep) shellsToKeep.push(shell);
    }
    shells = shellsToKeep;
    return hadShells;
}

function keypress(key) {
    var tank = tank1;
   console.log("keypress event detected: ", key);
   if (key === 'a' || key === 'A') {
       tank.bodyRotation = tank.bodyRotation - traverseSpeed;
   } else if (key === 'd' || key === 'D') {
       tank.bodyRotation = tank.bodyRotation + traverseSpeed;
   } else if (key === 'w' || key === 'W') {
       moveTank(tank, 10);
   } else if (key === 's' || key === 'S') {
       moveTank(tank, -10);
   } else if (key === 'Left') {
       tank.turretRotation = tank.turretRotation - turretSpeed;
   } else if (key === 'Right') {
       tank.turretRotation = tank.turretRotation + turretSpeed;
   } else if (key === ' ') {
       fire(tank);
   }
}

function keydown(event) {
    var key = event.key;
    downKeys[key] = true;
    keypress(key);
    drawAll();
}

function keyup(event) {
    var key = event.key;
    delete downKeys[key];
}

function drawAll() {
    context.clearRect ( 0 , 0 , canvas.width, canvas.height );
    drawCaptureCircle();
    drawTank(tank1);
    drawShells();
}

function timerTick() {
    var redrawNeeded = incrementShells();
    for (var key in downKeys) {
        redrawNeeded = true;
        keypress(key);
    }
    if (redrawNeeded) drawAll();
}

function setup() {

    tank1.bodyImage.src = 'images/hullv1.png';
    tank1.turretImage.src = 'images/tank1imageturretv2.png';
    shellImage.src = 'images/shell.png';
        
    window.onkeydown = keydown;
    window.onkeyup = keyup;
    
    window.setInterval(timerTick, 100);
}

setup();
drawAll();