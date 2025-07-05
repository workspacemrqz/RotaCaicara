
#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔍 Verificando arquivos de build...');

// Verificar se os arquivos essenciais existem
const requiredFiles = [
  'dist/index.js',
  'dist/public/index.html'
];

let allFilesExist = true;

requiredFiles.forEach(file => {
  if (fs.existsSync(file)) {
    console.log(`✅ ${file} existe`);
  } else {
    console.error(`❌ ${file} não encontrado`);
    allFilesExist = false;
  }
});

if (allFilesExist) {
  console.log('✅ Build verificado com sucesso!');
  process.exit(0);
} else {
  console.error('❌ Falha na verificação do build');
  process.exit(1);
}
