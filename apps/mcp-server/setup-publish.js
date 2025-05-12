import fs from 'fs';
import path from 'path';
const __dirname = import.meta.dirname;

// Define paths
const srcPackageJsonPath = path.resolve(__dirname, 'package.json');
const distDir = path.resolve(__dirname, './dist');

// Copy package.json without nx property
console.log('Copying package.json to dist folder...');
const packageJson = JSON.parse(fs.readFileSync(srcPackageJsonPath, 'utf8'));
delete packageJson.nx;
fs.writeFileSync(
  path.resolve(distDir, 'package.json'),
  JSON.stringify(packageJson, null, 2) + '\n'
);

// Add shebang to main.js if needed
const distMainJsPath = path.resolve(distDir, 'main.js');
const mainJsContent = fs.readFileSync(distMainJsPath, 'utf8');
const shebang = '#!/usr/bin/env node\n';

if (!mainJsContent.startsWith(shebang)) {
  fs.writeFileSync(distMainJsPath, shebang + mainJsContent);
  console.log('Shebang added');
}

console.log('Setup completed successfully!');
