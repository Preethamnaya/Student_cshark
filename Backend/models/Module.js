const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  questionText: { type: String, required: true },
  options: [{ type: String, required: true }],
  correctAnswer: { type: String, required: true },
  explanation: { type: String, required: true }
});

const videoSchema = new mongoose.Schema({
  title: { type: String, required: true },
  url: { type: String, required: true },
  durationMinutes: { type: Number, required: true, default: 10 }
});

const moduleSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  difficulty: { type: String, enum: ['Easy', 'Medium', 'Hard'], default: 'Easy' },
  studyHours: { type: Number, required: true, default: 10 },
  videos: [videoSchema],
  questions: [questionSchema]
}, { timestamps: true });

module.exports = mongoose.model('Module', moduleSchema);
