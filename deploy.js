// Enhanced deployment script for Vercel
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('Starting enhanced deployment process...');

// Function to run a command and return its output
function run(command) {
  console.log(`Running: ${command}`);
  return execSync(command, { stdio: 'inherit' });
}

try {
  // Ensure we have the latest code
  console.log('Pulling latest changes...');
  run('git pull origin main');

  // Clean up any previous build artifacts
  console.log('Cleaning up...');
  if (fs.existsSync('.next')) {
    fs.rmSync('.next', { recursive: true, force: true });
  }
  if (fs.existsSync('node_modules')) {
    fs.rmSync('node_modules', { recursive: true, force: true });
  }

  // Install dependencies
  console.log('Installing dependencies...');
  run('npm install');

  // Build the application
  console.log('Building the application...');
  run('npm run build');

  // Install Vercel CLI
  console.log('Installing Vercel CLI...');
  run('npm install -g vercel@latest');

  // Deploy to Vercel with specific settings
  console.log('Deploying to Vercel...');
  run('vercel --prod --yes');

  console.log('Deployment completed successfully!');
} catch (error) {
  console.error('Deployment failed:', error.message);
  process.exit(1);
}
