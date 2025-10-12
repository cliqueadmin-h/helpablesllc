#!/usr/bin/env node

/**
 * Helpables Jamstack Starter - Installation Script
 * 
 * This script helps set up the project by:
 * - Installing dependencies
 * - Creating environment files
 * - Providing next steps
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

function log(message, color = colors.reset) {
  console.log(`${color}${message}${colors.reset}`);
}

function header(message) {
  console.log('');
  log('='.repeat(60), colors.cyan);
  log(message, colors.bright + colors.cyan);
  log('='.repeat(60), colors.cyan);
  console.log('');
}

function step(number, message) {
  log(`\n${colors.bright}Step ${number}:${colors.reset} ${message}`, colors.blue);
}

function success(message) {
  log(`✓ ${message}`, colors.green);
}

function warning(message) {
  log(`⚠ ${message}`, colors.yellow);
}

function runCommand(command, cwd = process.cwd()) {
  try {
    execSync(command, { cwd, stdio: 'inherit' });
    return true;
  } catch (error) {
    return false;
  }
}

function copyEnvFile(source, destination) {
  try {
    if (!fs.existsSync(destination)) {
      fs.copyFileSync(source, destination);
      success(`Created ${destination}`);
      return true;
    } else {
      warning(`${destination} already exists, skipping...`);
      return false;
    }
  } catch (error) {
    warning(`Could not create ${destination}`);
    return false;
  }
}

async function main() {
  header('🚀 Helpables Jamstack Starter - Setup');

  log('Welcome to the Helpables Jamstack starter setup!\n', colors.bright);
  log('This script will help you get started quickly.\n');

  // Check Node version
  step(1, 'Checking Node.js version');
  const nodeVersion = process.version;
  const majorVersion = parseInt(nodeVersion.split('.')[0].substring(1));
  
  if (majorVersion >= 18) {
    success(`Node.js ${nodeVersion} detected`);
  } else {
    warning(`Node.js ${nodeVersion} detected. Version 18 or higher is recommended.`);
  }

  // Install frontend dependencies
  step(2, 'Installing frontend dependencies');
  const frontendPath = path.join(process.cwd(), 'frontend');
  
  if (fs.existsSync(frontendPath)) {
    log('Installing packages (this may take a few minutes)...\n');
    if (runCommand('npm install', frontendPath)) {
      success('Frontend dependencies installed');
    } else {
      warning('Failed to install frontend dependencies. You may need to run manually.');
    }
  } else {
    warning('Frontend directory not found. Make sure you\'re in the project root.');
  }

  // Install CMS dependencies
  step(3, 'Installing CMS dependencies');
  const cmsPath = path.join(process.cwd(), 'cms');
  
  if (fs.existsSync(cmsPath)) {
    log('Installing packages (this may take a few minutes)...\n');
    if (runCommand('npm install', cmsPath)) {
      success('CMS dependencies installed');
    } else {
      warning('Failed to install CMS dependencies. You may need to run manually.');
    }
  } else {
    warning('CMS directory not found. Make sure you\'re in the project root.');
  }

  // Create environment files
  step(4, 'Setting up environment files');
  
  const frontendEnvExample = path.join(frontendPath, '.env.example');
  const frontendEnvLocal = path.join(frontendPath, '.env.local');
  copyEnvFile(frontendEnvExample, frontendEnvLocal);

  const cmsEnvExample = path.join(cmsPath, '.env.example');
  const cmsEnv = path.join(cmsPath, '.env');
  copyEnvFile(cmsEnvExample, cmsEnv);

  // Next steps
  header('✅ Setup Complete!');

  log('Your Helpables Jamstack starter is ready to use!\n', colors.bright + colors.green);

  log('📝 Next Steps:\n', colors.bright);

  log('1. Start the CMS (Strapi):', colors.cyan);
  log('   cd cms');
  log('   npm run develop\n');

  log('2. In a new terminal, start the frontend (Next.js):', colors.cyan);
  log('   cd frontend');
  log('   npm run dev\n');

  log('3. Open your browser:', colors.cyan);
  log('   CMS Admin:  http://localhost:1337/admin');
  log('   Website:    http://localhost:3000\n');

  log('4. Set up Strapi:', colors.cyan);
  log('   - Create your admin account');
  log('   - Configure public permissions (see QUICKSTART.md)');
  log('   - Add sample content\n');

  log('📚 Documentation:', colors.bright);
  log('   - QUICKSTART.md     - Quick start guide');
  log('   - README.md         - Full documentation');
  log('   - VERCEL.md         - Deploy frontend');
  log('   - AZURE.md          - Deploy CMS\n');

  log('💡 Helpful Commands:', colors.bright);
  log('   npm run dev         - Start both servers (requires concurrently)');
  log('   cd cms && npm run seed  - View seed data structure\n');

  header('Happy Building! 🎉');
  
  log('Need help? Check the docs or contact hello@helpables.io\n');
}

main().catch(error => {
  console.error('Setup failed:', error);
  process.exit(1);
});
