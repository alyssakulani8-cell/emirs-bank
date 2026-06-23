const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

async function main() {
  const svg = fs.readFileSync(path.join(__dirname, '..', 'assets', 'eagle-icon.svg'), 'utf8');
  
  // Try using sharp via npx to convert svg to png
  console.log('Converting SVG to PNG...');
  
  // Write a small Node script that uses sharp if available
  const sizes = {
    'icon.png': 1024,
    'adaptive-icon.png': 1024,
    'splash.png': 1284,
    'favicon.png': 48
  };

  // Create a simple solid color PNG with the eagle as data URL fallback
  // Since we need sharp but might not have it, let's create the files differently
  
  // For now, just create proper PNGs by trying to install sharp
  const cp = spawn('npm', ['install', 'sharp', '--no-save'], {
    cwd: path.join(__dirname, '..'),
    stdio: 'inherit',
    shell: true
  });
  
  cp.on('close', (code) => {
    if (code === 0) {
      console.log('Sharp installed, generating PNGs...');
      try {
        const sharp = require('sharp');
        for (const [name, size] of Object.entries(sizes)) {
          const filePath = path.join(__dirname, '..', 'assets', name);
          sharp(Buffer.from(svg)).resize(size, size).png().toFile(filePath)
            .then(() => console.log(`Generated ${name} ${size}x${size}`))
            .catch(e => console.error(`Error generating ${name}:`, e));
        }
      } catch (e) {
        console.error('Error:', e.message);
      }
    } else {
      console.error('Failed to install sharp');
    }
  });
}

main();
