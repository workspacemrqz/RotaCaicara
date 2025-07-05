
#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🔍 Validating build process...');

try {
  // Step 1: Clean install production dependencies
  console.log('📦 Installing production dependencies...');
  execSync('npm ci --omit=dev', { stdio: 'inherit' });
  
  // Step 2: Run build
  console.log('🏗️ Building application...');
  execSync('npm run build', { stdio: 'inherit' });
  
  // Step 3: Validate build outputs
  console.log('✅ Validating build outputs...');
  
  const distPath = path.join(process.cwd(), 'dist');
  const serverFile = path.join(distPath, 'index.js');
  const clientDir = path.join(distPath, 'public');
  
  if (!fs.existsSync(serverFile)) {
    throw new Error('Server build output not found: dist/index.js');
  }
  
  if (!fs.existsSync(clientDir)) {
    throw new Error('Client build output not found: dist/public');
  }
  
  console.log('✅ Build validation successful!');
  console.log('🚀 Ready for deployment');
  
} catch (error) {
  console.error('❌ Build validation failed:', error.message);
  process.exit(1);
}
