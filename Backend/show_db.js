const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config({ path: path.join(__dirname, '.env') });

const User = require('./models/User');
const Module = require('./models/Module');

async function showDatabase() {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/student_cshark';
  console.log(`Connecting to MongoDB at: ${uri}...\n`);
  
  try {
    await mongoose.connect(uri);
    console.log('--- DATABASE STATUS ---\n');

    // 1. Fetch all Modules
    const modules = await Module.find({});
    console.log(`📚 MODULES COLLECTION (${modules.length} modules found):`);
    modules.forEach((mod, idx) => {
      console.log(`  ${idx + 1}. [${mod.difficulty}] ${mod.title}`);
      console.log(`     Hours: ${mod.studyHours}h | Videos: ${mod.videos.length} | Questions: ${mod.questions.length}`);
    });
    console.log('');

    // 2. Fetch all Users
    const users = await User.find({});
    console.log(`👤 USERS COLLECTION (${users.length} users found):`);
    users.forEach((usr, idx) => {
      console.log(`  ${idx + 1}. Name: ${usr.name}`);
      console.log(`     Email: ${usr.email}`);
      console.log(`     Role: ${usr.role.toUpperCase()} | Status: ${usr.status.toUpperCase()}`);
      if (usr.completedModules && usr.completedModules.length > 0) {
        console.log(`     Completed Modules:`);
        usr.completedModules.forEach(comp => {
          const modName = modules.find(m => m._id.toString() === comp.moduleId.toString())?.title || 'Unknown Module';
          console.log(`       - ${modName} (Score: ${comp.score}%, Completed on: ${comp.dateCompleted.toLocaleDateString()})`);
        });
      } else {
        console.log(`     Completed Modules: None`);
      }
      console.log('');
    });

  } catch (err) {
    console.error('Error connecting to database:', err);
  } finally {
    await mongoose.connection.close();
    console.log('MongoDB connection closed.');
  }
}

showDatabase();
