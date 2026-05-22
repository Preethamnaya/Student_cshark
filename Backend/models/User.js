const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  googleId: { type: String },
  role: { type: String, enum: ['student', 'admin'], default: 'student' },
  status: { type: String, enum: ['pending', 'approved'], default: 'pending' },
  completedModules: [
    {
      moduleId: { type: mongoose.Schema.Types.ObjectId, ref: 'Module' },
      score: { type: Number },
      certificateUrl: { type: String },
      dateCompleted: { type: Date, default: Date.now }
    }
  ]
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
