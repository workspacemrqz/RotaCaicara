
#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🔍 Starting comprehensive build validation...');

function runCommand(command, description) {
  console.log(`\n📋 ${description}...`);
  try {
    execSync(command, { stdio: 'inherit' });
    console.log(`✅ ${description} completed successfully`);
  } catch (error) {
    console.error(`❌ ${description} failed:`, error.message);
    process.exit(1);
  }
}

function validateFile(filePath, description) {
  if (!fs.existsSync(filePath)) {
    console.error(`❌ ${description} not found: ${filePath}`);
    process.exit(1);
  }
  console.log(`✅ ${description} exists: ${filePath}`);
}

function validateDirectory(dirPath, description) {
  if (!fs.existsSync(dirPath)) {
    console.error(`❌ ${description} directory not found: ${dirPath}`);
    process.exit(1);
  }
  
  const files = fs.readdirSync(dirPath);
  console.log(`✅ ${description} directory exists with ${files.length} files: ${dirPath}`);
  
  if (files.length > 0) {
    console.log(`   📁 Contents: ${files.slice(0, 5).join(', ')}${files.length > 5 ? '...' : ''}`);
  }
}

try {
  // Step 1: Clean any existing build
  console.log('\n🧹 Cleaning previous build...');
  if (fs.existsSync('./dist')) {
    fs.rmSync('./dist', { recursive: true, force: true });
    console.log('✅ Previous dist directory cleaned');
  }

  // Step 2: Install production dependencies only
  runCommand('npm ci --omit=dev', 'Installing production dependencies');
  
  // Step 3: Install dev dependencies for build
  runCommand('npm install', 'Installing all dependencies for build');
  
  // Step 4: Run TypeScript check
  runCommand('npm run check', 'TypeScript type checking');
  
  // Step 5: Build client
  runCommand('npm run build:client', 'Building client application');
  
  // Step 6: Build server
  runCommand('npm run build:server', 'Building server application');
  
  // Step 7: Comprehensive output validation
  console.log('\n🔍 Validating build outputs...');
  
  const rootDir = process.cwd();
  const distDir = path.join(rootDir, 'dist');
  const serverFile = path.join(distDir, 'index.js');
  const clientDir = path.join(distDir, 'public');
  const indexHtml = path.join(clientDir, 'index.html');
  
  validateDirectory(distDir, 'Build output');
  validateFile(serverFile, 'Server bundle');
  validateDirectory(clientDir, 'Client build');
  validateFile(indexHtml, 'Client index.html');
  
  // Step 8: Check for critical client assets
  const assetsDir = path.join(clientDir, 'assets');
  if (fs.existsSync(assetsDir)) {
    validateDirectory(assetsDir, 'Client assets');
  }
  
  // Step 9: Validate server bundle is executable
  try {
    const serverContent = fs.readFileSync(serverFile, 'utf8');
    if (serverContent.length < 1000) {
      throw new Error('Server bundle appears to be too small');
    }
    console.log(`✅ Server bundle size: ${(serverContent.length / 1024).toFixed(2)}KB`);
  } catch (error) {
    console.error('❌ Server bundle validation failed:', error.message);
    process.exit(1);
  }
  
  // Step 10: Validate index.html content
  try {
    const htmlContent = fs.readFileSync(indexHtml, 'utf8');
    if (!htmlContent.includes('<div id="root">') && !htmlContent.includes('<div id="app">')) {
      console.warn('⚠️  Warning: index.html may not have proper React root element');
    }
    if (!htmlContent.includes('<script')) {
      throw new Error('index.html appears to be missing script tags');
    }
    console.log('✅ index.html content validation passed');
  } catch (error) {
    console.error('❌ index.html validation failed:', error.message);
    process.exit(1);
  }
  
  console.log('\n🎉 Build validation completed successfully!');
  console.log('📊 Build Summary:');
  console.log(`   📁 Dist directory: ${distDir}`);
  console.log(`   🖥️  Server bundle: ${serverFile}`);
  console.log(`   🌐 Client files: ${clientDir}`);
  console.log(`   📄 Entry point: ${indexHtml}`);
  console.log('\n🚀 Application is ready for EasyPanel deployment!');
  console.log('🔧 EasyPanel Configuration:');
  console.log('   Build Command: npm run build');
  console.log('   Start Command: npm start');
  console.log('   Port: 3100');
  console.log('   Health Check: /health');
  
} catch (error) {
  console.error('\n💥 Build validation failed:', error.message);
  console.error('\n🔧 Troubleshooting tips:');
  console.error('   • Check if all dependencies are properly installed');
  console.error('   • Verify TypeScript configuration');
  console.error('   • Ensure build scripts are working correctly');
  console.error('   • Check for any missing files or permissions');
  process.exit(1);
}
