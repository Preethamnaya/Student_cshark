const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Module = require('../models/Module');
const User = require('../models/User');

// GET /api/modules
// Get all modules (Student must be approved)
router.get('/', auth, async (req, res) => {
  try {
    if (req.user.role === 'student' && req.user.status !== 'approved') {
      return res.status(403).json({ msg: 'Account pending approval from admin' });
    }
    
    // Do not send correct answers or explanations to the frontend initially
    const modules = await Module.find().select('-questions.correctAnswer -questions.explanation');
    res.json(modules);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// GET /api/modules/:id
// Get a single module by ID
router.get('/:id', auth, async (req, res) => {
  try {
    if (req.user.role === 'student' && req.user.status !== 'approved') {
      return res.status(403).json({ msg: 'Account pending approval from admin' });
    }

    const module = await Module.findById(req.params.id).select('-questions.correctAnswer -questions.explanation');
    if (!module) return res.status(404).json({ msg: 'Module not found' });
    res.json(module);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// POST /api/modules/:id/submit
// Submit an assessment
router.post('/:id/submit', auth, async (req, res) => {
  try {
    if (req.user.role !== 'student') {
        return res.status(403).json({ msg: 'Only students can submit assessments' });
    }

    const { answers } = req.body; // Array of selected options
    const module = await Module.findById(req.params.id);
    
    if (!module) return res.status(404).json({ msg: 'Module not found' });

    let correctCount = 0;
    const totalQuestions = module.questions.length;

    module.questions.forEach((q, index) => {
      if (answers[index] === q.correctAnswer) {
        correctCount++;
      }
    });

    const scorePercentage = Math.round((correctCount / totalQuestions) * 100);
    const passed = scorePercentage >= 75; // Tricky assessment has 75% passing mark!

    // Save to user profile
    const user = await User.findById(req.user.userId);
    
    // Check if module already completed
    const existingIndex = user.completedModules.findIndex(m => m.moduleId.toString() === req.params.id);
    
    let certificateUrl = null;
    if (passed) {
       certificateUrl = `/api/certificates/generate/${user._id}/${module._id}`;
    }

    if (existingIndex > -1) {
        // Update existing record if score is better
        if(user.completedModules[existingIndex].score < scorePercentage) {
            user.completedModules[existingIndex].score = scorePercentage;
            if(passed) user.completedModules[existingIndex].certificateUrl = certificateUrl;
        }
    } else {
        // Add new record
        user.completedModules.push({
            moduleId: module._id,
            score: scorePercentage,
            certificateUrl: passed ? certificateUrl : null
        });
    }

    await user.save();

    res.json({
        score: scorePercentage,
        passed,
        correctCount,
        totalQuestions,
        certificateUrl: passed ? certificateUrl : null,
        questions: module.questions // Return the complete questions with answers and explanations for educational review!
    });

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
