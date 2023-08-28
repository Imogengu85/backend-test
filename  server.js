// service.js
const express = require('express');
const mongoose = require('mongoose');
const socketIO = require('socket.io');

// Create Express app
const app = express();
const server = require('http').createServer(app);
const io = socketIO(server);

// Connect to MongoDB
const mongoURI = 'mongodb://localhost:27017/mining_simulation';
mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('Connected to MongoDB');
})
.catch((err) => {
  console.error('Failed to connect to MongoDB', err);
});

// WebSocket connection
io.on('connection', (socket) => {
  console.log('A user connected');

  // Handle events here
  socket.on('disconnect', () => {
    console.log('A user disconnected');
  });

  // Emit initial data to the frontend
  socket.emit('initialData', async () => {
    const [planets, miners, asteroids] = await Promise.all([
      Planet.find(),
      Miner.find().populate('planet'),
      Asteroid.find(),
    ]);
  
    return {
      planets,
      miners,
      asteroids,
    };
  });


  // Listen for frontend events
  socket.on('createMiner', async (data) => {
    const { carryCapacity, travelSpeed, miningSpeed, position, planetId } = data;

    try {
      const planet = await Planet.findById(planetId);
      if (!planet) {
        return socket.emit('error', 'Planet not found');
      }

      const miner = new Miner({
        carryCapacity,
        travelSpeed,
        miningSpeed,
        position,
        planet: planetId,
        status: 0,
      });

      await miner.save();

      socket.emit('minerCreated', miner);
    } catch (error) {
      socket.emit('error', 'Internal server error');
    }
  });
});

// Start the server
const port = 3000;
server.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
