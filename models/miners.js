const Miner = mongoose.model('Miner', {
    carryCapacity: Number,
    travelSpeed: Number,
    miningSpeed: Number,
    position: {
      x: Number,
      y: Number,
    },
    planet: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Planet',
    },
    status: Number,
  });