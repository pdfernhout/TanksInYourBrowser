TanksInYourBrowser
==================

Multi-player tank toy using JavaScript in the browser and node.js with socket.io for the server

Copyright 2014 by Paul Fernhout <pdfernhout@kurtz-fernhout.com> and contributors

MIT License

Use node.js to run server/TanksServer.js.

Connect to your server machine using a web browser on port 8090, such as for local connections:
  http://localhost:8090
  
Use WASD keys to go forward and back and turn the tank.
Use left and right arrow keys to turn the turret.
Use space to fire. There is a two-second reload delay between shots.

Currently this is just a learning toy.
There is no collision detection, score keeping, login, or lots of other stuff.
There is a bug with leftover "ghost" tanks from previous connections.
