/* jshint devel: true */
/* jshint browser: true */
/* jshint -W097 */

/* global io */

"use strict";

// TODO: Fix shell offset when turret rotated

var imageScale = 0.20;

var shellRange = 10000;
var traverseSpeed = 0.03;
var turretSpeed = 0.03;
var fireWaitDelay_ms = 2000;
var tankUpdateThreshold_ms = 5000;

var canvas = document.getElementById("tankCanvas");
var context = canvas.getContext('2d');
var socket = io();

var shells = [];
var downKeys = {};
var lastTankUpdate = new Date();
var lastShotTime = new Date();

var bodyImage = new Image();
var turretImage = new Image();
var shellImage = new Image();

var tanks = {};
var dirty = true;

var localTank = {
    id: "" + Math.random(),
    x: 500,
    y: 500,
    bodyRotation: 1.0,
    turretRotation: 0.0
};

function drawCaptureCircle() {
    context.beginPath();
    context.arc(95, 50, 40, 0, 2 * Math.PI);
    context.stroke();
}

function drawTank(tank) {
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

function drawTanks() {
    for (var key in tanks) {
        var tank = tanks[key];
        drawTank(tank);
    }
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
    dirty = true;
}

function moveShell(shell, distance) {
    shell.x = shell.x + distance * Math.cos(shell.direction - 3.14159265 * 0.5);
    shell.y = shell.y + distance * Math.sin(shell.direction - 3.14159265 * 0.5);
    shell.distance += distance;
    if (shell.distance > shellRange) return false;
    return true;
}

function fire(tank) {
    var barrelLength = 450;
    
    // var x = tank.x + -70 * Math.cos(shell.direction - 3.14159265 * 0.5) + 
    
    var shell = {x: tank.x, y: tank.y, direction: tank.bodyRotation + tank.turretRotation, distance: 0.0};
    moveShell(shell, barrelLength);
    shells.push(shell);
    dirty = true;
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

function rotateTank(tank, amount) {
    tank.bodyRotation = tank.bodyRotation + amount;
    dirty = true;
}

function rotateTurret(tank, amount) {
    tank.turretRotation = tank.turretRotation + amount;
    dirty = true;
}

function keypress(key) {
    var tank = localTank;
   // console.log("keypress event detected: ", key);
   if (key === 'a' || key === 'A') {
       socket.emit('rotateTank', {id: localTank.id, amount: -traverseSpeed});
       rotateTank(tank, -traverseSpeed);
   } else if (key === 'd' || key === 'D') {
       socket.emit('rotateTank', {id: localTank.id, amount: traverseSpeed});
       rotateTank(tank, traverseSpeed);
   } else if (key === 'w' || key === 'W') {
       socket.emit('moveTank', {id: localTank.id, amount: 10});
       moveTank(tank, 10);
   } else if (key === 's' || key === 'S') {
       socket.emit('moveTank', {id: localTank.id, amount: -10});
       moveTank(tank, -10);
   } else if (key === 'Left') {
       socket.emit('rotateTurret', {id: localTank.id, amount: -turretSpeed});
       rotateTurret(tank, -turretSpeed);
   } else if (key === 'Right') {
       socket.emit('rotateTurret', {id: localTank.id, amount: turretSpeed});
       rotateTurret(tank, turretSpeed);
   } else if (key === ' ') {
       var now = new Date();
       var fireWait_ms = now.getTime() - lastShotTime.getTime();
       if (fireWait_ms < fireWaitDelay_ms) return;
       lastShotTime = now;
       socket.emit('fire', {id: localTank.id});
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
    context.clearRect(0 , 0, canvas.width, canvas.height);
    drawCaptureCircle();
    drawTanks();
    drawShells();
    dirty = false;
}

function timerTick() {
    var redrawNeeded = incrementShells();
    for (var key in downKeys) {
        redrawNeeded = true;
        keypress(key);
    }
    if (dirty) redrawNeeded = true;
    if (redrawNeeded) drawAll();
    
    var now = new Date();
    var lastUpdateGap_ms = now.getTime() - lastTankUpdate.getTime();
    
    if (lastUpdateGap_ms > tankUpdateThreshold_ms) {
        socket.emit('tank', localTank);
        lastTankUpdate = new Date();
    }
}

function tankForID(id) {
    // console.log("tankForID", id, tanks[id]);
    return tanks[id];
}

function setup() {
    tanks[localTank.id] = localTank;

    bodyImage.src = 'images/hullv1.png';
    turretImage.src = 'images/tank1imageturretv2.png';
    shellImage.src = 'images/shell.png';
        
    window.onkeydown = keydown;
    window.onkeyup = keyup;
    
    window.setInterval(timerTick, 100);
    
    socket.on('rotateTank', function(message) {
        // console.log("rotateTank", message);
        var tank = tankForID(message.id);
        if (tank && message.id !== localTank.id) rotateTank(tank, message.amount);
    });
    
    socket.on('moveTank', function(message) {
        // console.log("moveTank", message);
        var tank = tankForID(message.id);
        if (tank && message.id !== localTank.id) moveTank(tank, message.amount);
    });
    
    socket.on('rotateTurret', function(message) {
        // console.log("rotateTurret", message);
        var tank = tankForID(message.id);
        if (tank && message.id !== localTank.id) rotateTurret(tank, message.amount);
    });
    
    socket.on('fire', function(message) {
        // console.log("fire", message);
        var tank = tankForID(message.id);
        if (tank && message.id !== localTank.id && tanks) fire(tank);
    });
    
    socket.on('tank', function(message) {
        // console.log("tank", message);
        if (message.id !== localTank.id) {
            tanks[message.id] = message;
            dirty = true;
        }
    });
}

setup();
drawAll();