// Define MongoDB models
const Asteroid = mongoose.model('Asteroid', {
  position: {
    x: Number,
    y: Number,
  },
  minerals: Number,
  status: Number,
});