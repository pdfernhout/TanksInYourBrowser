/* jshint devel: true */
/* jshint browser: true */
/* jshint -W097 */

"use strict";

var canvas = document.getElementById("tankCanvas");
var context = canvas.getContext('2d'); 

function drawAll() {
    drawCaptureCircle();
    drawTank();
}

function drawCaptureCircle() {
    context.beginPath();
    context.arc(95, 50, 40, 0, 2 * Math.PI);
    context.stroke();
}

function drawTank() {
    var imageScale = 0.20;
    
    var tank1Image = new Image();
    tank1Image.src = 'images/tank1imagev2.png';
    context.save();
    context.translate(500 * imageScale, 500 * imageScale);
    context.scale(imageScale, imageScale);
    context.rotate(1.0);
    context.translate( -tank1Image.width * imageScale / 2, -tank1Image.height * imageScale / 2);
    context.drawImage(tank1Image, 0, 0);
    context.restore();
}

drawAll();