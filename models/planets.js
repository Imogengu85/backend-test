const Planet = mongoose.model('Planet', {
    position: {
      x: Number,
      y: Number,
    },
    minerals: Number,
  });