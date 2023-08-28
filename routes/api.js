// REST API endpoints
app.use(express.json());

// Get all miners
app.get('/miners', async (req, res) => {
  try {
    const miners = await Miner.find().populate('planet');
    res.json(miners);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get miners from a specific planet
app.get('/miners', async (req, res) => {
  const { planetId } = req.query;

  try {
    const miners = await Miner.find({ planet: planetId }).populate('planet');
    res.json(miners);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get a specific miner
app.get('/miners/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const miner = await Miner.findById(id).populate('planet');
    if (miner) {
      res.json(miner);
    } else {
      res.status(404).json({ error: 'Miner not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create a new miner
app.post('/miners', async (req, res) => {
  const { carryCapacity, travelSpeed, miningSpeed, position, planetId } = req.body;

  try {
    const planet = await Planet.findById(planetId);
    if (!planet) {
      return res.status(404).json({ error: 'Planet not found' });
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

    res.json(miner);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update a miner
app.put('/miners/:id', async (req, res) => {
  const { id } = req.params;
  const { carryCapacity, travelSpeed, miningSpeed, position, planetId, status } = req.body;

  try {
    const miner = await Miner.findById(id);
    if (!miner) {
      return res.status(404).json({ error: 'Miner not found' });
    }

    miner.carryCapacity = carryCapacity;
    miner.travelSpeed = travelSpeed;
    miner.miningSpeed = miningSpeed;
    miner.position = position;
    miner.planet = planetId;
    miner.status = status;

    await miner.save();

    res.json(miner);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete a miner
app.delete('/miners/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const miner = await Miner.findByIdAndDelete(id);
    if (miner) {
      res.json({ message: 'Miner deleted successfully' });
    } else {
      res.status(404).json({ error: 'Miner not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});
