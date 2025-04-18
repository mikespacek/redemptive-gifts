// Enhanced deployment script for Netlify
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
  // Clean up any previous build artifacts
  console.log('Cleaning up...');
  if (fs.existsSync('.next')) {
    fs.rmSync('.next', { recursive: true, force: true });
  }

  // Build the application
  console.log('Building the application...');
  run('npm run build');

  // Deploy to Netlify with specific settings using npx
  console.log('Deploying to Netlify...');
  run('npx netlify-cli deploy --prod --dir=out --site=83234e3c-4e90-427d-b9e3-85e694b208c4');

  console.log('Deployment completed successfully!');
} catch (error) {
  console.error('Deployment failed:', error.message);
  process.exit(1);
}
