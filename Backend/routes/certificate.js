const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const PDFDocument = require('pdfkit');
const User = require('../models/User');
const Module = require('../models/Module');
const fs = require('fs');

// GET /api/certificates/generate/:userId/:moduleId
// Generate and stream PDF certificate
router.get('/generate/:userId/:moduleId', auth, async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    const module = await Module.findById(req.params.moduleId);

    if (!user || !module) {
      return res.status(404).json({ msg: 'User or Module not found' });
    }

    // Ensure the requester is either the student themselves or an admin
    if (req.user.role !== 'admin' && req.user.userId !== user._id.toString()) {
       return res.status(403).json({ msg: 'Unauthorized' });
    }

    // Find the completed module record to verify they passed
    const completedModule = user.completedModules.find(m => m.moduleId.toString() === module._id.toString());
    
    if (!completedModule || completedModule.score < 75) {
        return res.status(400).json({ msg: 'Student has not passed this module' });
    }

    // Create a new PDF document
    const doc = new PDFDocument({
        layout: 'landscape',
        size: 'A4',
    });

    // Set response headers to force download
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=Certificate_${user.name.replace(/\s+/g, '_')}_${module.title.replace(/\s+/g, '_')}.pdf`);

    // Pipe PDF to response
    doc.pipe(res);

    // --- Certificate Design ---
    
    // Background
    doc.rect(0, 0, doc.page.width, doc.page.height).fill('#f8fafc');
    
    // Inner Border
    doc.lineWidth(10);
    doc.rect(20, 20, doc.page.width - 40, doc.page.height - 40).stroke('#1e40af'); // Tailwind blue-800

    // College Name
    doc.font('Helvetica-Bold')
       .fontSize(30)
       .fillColor('#1e3a8a') // Tailwind blue-900
       .text('NIE First Grade College of Mysore', 0, 100, { align: 'center' });

    // Subtitle
    doc.font('Helvetica')
       .fontSize(20)
       .fillColor('#475569') // Tailwind slate-600
       .text('Certificate of Completion', 0, 150, { align: 'center' });

    // Student Name text
    doc.fontSize(16)
       .fillColor('#64748b') // Tailwind slate-500
       .text('This is to certify that', 0, 230, { align: 'center' });

    // Actual Name
    doc.font('Helvetica-Bold')
       .fontSize(35)
       .fillColor('#0f172a') // Tailwind slate-900
       .text(user.name, 0, 260, { align: 'center' });

    // Module description
    doc.font('Helvetica')
       .fontSize(16)
       .fillColor('#64748b')
       .text(`has successfully completed the assessment for the module`, 0, 330, { align: 'center' });

    // Module Title
    doc.font('Helvetica-Bold')
       .fontSize(25)
       .fillColor('#1e40af')
       .text(module.title, 0, 360, { align: 'center' });

    // Score
    doc.font('Helvetica')
       .fontSize(14)
       .fillColor('#475569')
       .text(`with a passing score of ${completedModule.score}%`, 0, 410, { align: 'center' });

    // Date
    const dateStr = new Date(completedModule.dateCompleted).toLocaleDateString();
    doc.fontSize(12)
       .text(`Date of Issue: ${dateStr}`, 0, 480, { align: 'center' });

    // Finalize PDF file
    doc.end();

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error generating certificate');
  }
});

module.exports = router;
