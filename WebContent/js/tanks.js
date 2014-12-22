/* jshint devel: true */
/* jshint browser: true */
/* jshint -W097 */

"use strict";

function drawTank() {
    var canvas = document.getElementById("tankCanvas");
    var context = canvas.getContext('2d'); 
    context.beginPath();
    context.arc(95, 50, 40, 0, 2 * Math.PI);
    context.stroke();
    
    var imageScale = 0.20;
    
    var tank1Image = new Image();
    tank1Image.src = 'images/tank1imagev2.png';
    context.save();
    context.translate(200 * imageScale, 200 * imageScale);
    context.scale(imageScale, imageScale);
    context.rotate(1.0);
    context.translate( -tank1Image.width * imageScale / 2, -tank1Image.height * imageScale / 2);
    context.drawImage(tank1Image, 0, 0);
    context.restore();
}

drawTank();