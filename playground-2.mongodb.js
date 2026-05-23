// C-Shark Software Academy — Premium MongoDB Administrative Playground
// Use this interactive workspace to audit students, modules, and certification distributions.

// 1. Establish database connection namespace context
use('student_cshark');

// ==========================================
// 🔍 SEGMENT 1: GLOBAL PLATFORM AUDIT STATS
// ==========================================
print('--- RUNNING C-SHARK ACADEMY GLOBAL AUDIT ---');

// Count total students and modules
const totalStudents = db.getCollection('users').countDocuments({ role: 'student' });
const totalAdmins = db.getCollection('users').countDocuments({ role: 'admin' });
const totalModules = db.getCollection('modules').countDocuments();

// Count total certificates issued (students with score >= 75%)
const totalCertificates = db.getCollection('users').aggregate([
  { $unwind: '$completedModules' },
  { $match: { 'completedModules.score': { $gte: 75 } } },
  { $count: 'certificatesCount' }
]).toArray();

const certificateCount = totalCertificates.length > 0 ? totalCertificates[0].certificatesCount : 0;

print(`Total Registered Students: ${totalStudents}`);
print(`Total Platform Administrators: ${totalAdmins}`);
print(`Active Premium Modules: ${totalModules}`);
print(`Professional Certificates Issued: ${certificateCount}`);


// ==========================================
// 🎓 SEGMENT 2: DETAILED MODULE ENGAGEMENT & AVERAGE SCORES
// ==========================================
print('\n--- MODULE AVERAGE ASSESSMENT METRICS ---');

db.getCollection('users').aggregate([
  // Flatten completed modules arrays
  { $unwind: '$completedModules' },
  // Join with modules collection to pull title
  {
    $lookup: {
      from: 'modules',
      localField: 'completedModules.moduleId',
      foreignField: '_id',
      as: 'moduleDetails'
    }
  },
  { $unwind: '$moduleDetails' },
  // Group by module and compute statistics
  {
    $group: {
      _id: '$completedModules.moduleId',
      moduleTitle: { $first: '$moduleDetails.title' },
      averageScore: { $avg: '$completedModules.score' },
      highestScore: { $max: '$completedModules.score' },
      studentsCompleted: { $sum: 1 }
    }
  },
  // Sort by average score descending
  { $sort: { averageScore: -1 } }
]).forEach(metric => {
  print(`Module: "${metric.moduleTitle}"`);
  print(`  - Enrolled Completions: ${metric.studentsCompleted}`);
  print(`  - Average Score: ${metric.averageScore.toFixed(2)}%`);
  print(`  - Highest Attained Score: ${metric.highestScore}%`);
  print('-----------------------------------------');
});


// ==========================================
// 🏆 SEGMENT 3: LEADERBOARD — HIGHEST-PERFORMING STUDENTS
// ==========================================
print('\n--- C-SHARK ACADEMY HONOR ROLL (TOP PERFORMERS >= 90%) ---');

db.getCollection('users').aggregate([
  { $match: { role: 'student' } },
  { $unwind: '$completedModules' },
  { $match: { 'completedModules.score': { $gte: 90 } } },
  {
    $lookup: {
      from: 'modules',
      localField: 'completedModules.moduleId',
      foreignField: '_id',
      as: 'mod'
    }
  },
  { $unwind: '$mod' },
  {
    $project: {
      _id: 0,
      studentName: '$name',
      studentEmail: '$email',
      moduleTitle: '$mod.title',
      score: '$completedModules.score',
      completedDate: '$completedModules.dateCompleted'
    }
  },
  { $sort: { score: -1 } }
]).forEach(leader => {
  print(`Student: ${leader.studentName} (${leader.studentEmail})`);
  print(`  - Completed: "${leader.moduleTitle}"`);
  print(`  - Score: ${leader.score}%`);
  print(`  - Date Unlocked: ${leader.completedDate.toISOString().split('T')[0]}`);
  print('-----------------------------------------');
});


// ==========================================
// ⚙️ SEGMENT 4: SYSTEM BYPASS — DEV ADMINISTRATION OVERRIDES
// ==========================================

// --- UNCOMMENT & RUN ANY OF THE SNIPPETS BELOW TO AUTO-MANAGE USERS ---

// 1. Auto-approve all pending students (for quick verification of seeded modules)
/*
db.getCollection('users').updateMany(
  { role: 'student', status: 'pending' },
  { $set: { status: 'approved' } }
);
print('All pending students have been successfully approved!');
*/

// 2. Query list of all pending students waiting for administration review
/*
db.getCollection('users').find(
  { role: 'student', status: 'pending' },
  { name: 1, email: 1, createdAt: 1 }
).forEach(student => {
  print(`PENDING REVIEW: ${student.name} <${student.email}> (Joined: ${student.createdAt.toISOString().split('T')[0]})`);
});
*/
