#!/usr/bin/env node

/**
 * CampusConnect Lite - Setup Verification Script
 * Run this script to verify your setup is correct
 * Usage: node verify-setup.js
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 CampusConnect Lite - Setup Verification\n');

let hasErrors = false;

// Check 1: Node.js version
console.log('1. Checking Node.js version...');
const nodeVersion = process.version;
const majorVersion = parseInt(nodeVersion.split('.')[0].substring(1));
if (majorVersion >= 18) {
  console.log('   ✅ Node.js version', nodeVersion, '(OK)\n');
} else {
  console.log('   ❌ Node.js version', nodeVersion, '(Need 18 or higher)\n');
  hasErrors = true;
}

// Check 2: Package.json exists
console.log('2. Checking package.json...');
try {
  const pkg = require('./package.json');
  console.log('   ✅ package.json found');
  console.log('   ✅ Project:', pkg.name);
  console.log('   ✅ Version:', pkg.version, '\n');
} catch (err) {
  console.log('   ❌ package.json not found or invalid\n');
  hasErrors = true;
}

// Check 3: Required files exist
console.log('3. Checking required files...');
const requiredFiles = [
  'server.js',
  'app.js',
  '.env.example',
  'config/database.js',
  'models/User.js',
  'models/Event.js',
  'models/Registration.js',
  'controllers/authController.js',
  'controllers/eventController.js',
  'controllers/registrationController.js',
  'controllers/adminController.js',
  'middleware/auth.js',
  'middleware/errorHandler.js',
  'routes/authRoutes.js',
  'routes/eventRoutes.js',
  'routes/registrationRoutes.js',
  'routes/adminRoutes.js'
];

let allFilesExist = true;
requiredFiles.forEach(file => {
  const filePath = path.join(__dirname, file);
  if (fs.existsSync(filePath)) {
    console.log('   ✅', file);
  } else {
    console.log('   ❌', file, '(missing)');
    allFilesExist = false;
    hasErrors = true;
  }
});

if (allFilesExist) {
  console.log('   ✅ All required files present\n');
} else {
  console.log('   ❌ Some files are missing\n');
}

// Check 4: Dependencies
console.log('4. Checking dependencies...');
try {
  const pkg = require('./package.json');
  const requiredDeps = [
    'fastify',
    '@fastify/cors',
    'mongoose',
    'bcrypt',
    'jsonwebtoken',
    'dotenv'
  ];
  
  let allDepsPresent = true;
  requiredDeps.forEach(dep => {
    if (pkg.dependencies[dep]) {
      console.log('   ✅', dep);
    } else {
      console.log('   ❌', dep, '(not installed)');
      allDepsPresent = false;
      hasErrors = true;
    }
  });
  
  if (allDepsPresent) {
    console.log('   ✅ All dependencies listed\n');
  } else {
    console.log('   ❌ Run: npm install\n');
  }
} catch (err) {
  console.log('   ❌ Cannot read dependencies\n');
  hasErrors = true;
}

// Check 5: node_modules
console.log('5. Checking node_modules...');
if (fs.existsSync(path.join(__dirname, 'node_modules'))) {
  console.log('   ✅ node_modules directory exists\n');
} else {
  console.log('   ❌ node_modules not found');
  console.log('   ⚠️  Run: npm install\n');
  hasErrors = true;
}

// Check 6: Environment file
console.log('6. Checking environment configuration...');
const envPath = path.join(__dirname, '.env');
const envExamplePath = path.join(__dirname, '.env.example');

if (fs.existsSync(envExamplePath)) {
  console.log('   ✅ .env.example found');
} else {
  console.log('   ❌ .env.example not found');
  hasErrors = true;
}

if (fs.existsSync(envPath)) {
  console.log('   ✅ .env file exists');
  
  // Read .env file and check for required variables
  const envContent = fs.readFileSync(envPath, 'utf8');
  const requiredVars = ['PORT', 'MONGO_URI', 'JWT_SECRET', 'FRONTEND_URL'];
  
  console.log('   Checking environment variables:');
  requiredVars.forEach(varName => {
    if (envContent.includes(varName)) {
      const match = envContent.match(new RegExp(`${varName}=(.+)`));
      if (match && match[1] && match[1].trim() !== '') {
        console.log('   ✅', varName, '(set)');
      } else {
        console.log('   ⚠️ ', varName, '(empty)');
      }
    } else {
      console.log('   ❌', varName, '(missing)');
      hasErrors = true;
    }
  });
  console.log('');
} else {
  console.log('   ❌ .env file not found');
  console.log('   ⚠️  Run: cp .env.example .env\n');
  hasErrors = true;
}

// Check 7: .gitignore
console.log('7. Checking .gitignore...');
const gitignorePath = path.join(__dirname, '.gitignore');
if (fs.existsSync(gitignorePath)) {
  const gitignoreContent = fs.readFileSync(gitignorePath, 'utf8');
  const shouldIgnore = ['node_modules', '.env'];
  let allIgnored = true;
  
  shouldIgnore.forEach(item => {
    if (gitignoreContent.includes(item)) {
      console.log('   ✅', item, 'ignored');
    } else {
      console.log('   ❌', item, 'not ignored');
      allIgnored = false;
      hasErrors = true;
    }
  });
  
  if (allIgnored) {
    console.log('   ✅ .gitignore properly configured\n');
  } else {
    console.log('   ❌ Update .gitignore\n');
  }
} else {
  console.log('   ❌ .gitignore not found\n');
  hasErrors = true;
}

// Final Summary
console.log('═══════════════════════════════════════════════════════');
if (hasErrors) {
  console.log('❌ SETUP INCOMPLETE - Please fix the errors above');
  console.log('═══════════════════════════════════════════════════════\n');
  process.exit(1);
} else {
  console.log('✅ SETUP COMPLETE - Your backend is ready!');
  console.log('═══════════════════════════════════════════════════════\n');
  console.log('Next steps:');
  console.log('1. Make sure MongoDB is accessible');
  console.log('2. Update .env with your MongoDB URI');
  console.log('3. Generate a strong JWT_SECRET');
  console.log('4. Run: npm start');
  console.log('5. Test: curl http://localhost:5000\n');
  process.exit(0);
}
