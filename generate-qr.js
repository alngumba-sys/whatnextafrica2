// QR Code Generator for Kenya Gov Admin Platform
// Usage: node generate-qr.js YOUR_DEPLOYED_URL

const https = require('https');
const fs = require('fs');

const args = process.argv.slice(2);

if (args.length === 0) {
  console.log('❌ Please provide your deployed URL');
  console.log('');
  console.log('Usage:');
  console.log('  node generate-qr.js https://your-app.vercel.app');
  console.log('');
  process.exit(1);
}

const url = args[0];

// Validate URL
try {
  new URL(url);
} catch (e) {
  console.log('❌ Invalid URL provided');
  console.log('Please provide a valid URL starting with http:// or https://');
  process.exit(1);
}

console.log('🎨 Generating QR Code...');
console.log('');
console.log('Target URL:', url);
console.log('');

// Using QR Server API (free, no API key needed)
const qrApiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=500x500&data=${encodeURIComponent(url)}&format=png&margin=20`;

// Download and save QR code
const file = fs.createWriteStream('qr-code.png');

https.get(qrApiUrl, (response) => {
  response.pipe(file);
  
  file.on('finish', () => {
    file.close();
    console.log('✅ QR Code generated successfully!');
    console.log('');
    console.log('📁 Saved as: qr-code.png');
    console.log('');
    console.log('📋 Next steps:');
    console.log('  1. Open qr-code.png');
    console.log('  2. Test it by scanning with your phone');
    console.log('  3. Use it in your video (intro/outro)');
    console.log('');
    console.log('💡 Tips:');
    console.log('  - Show QR code for at least 5 seconds in video');
    console.log('  - Place in top-right or bottom-right corner');
    console.log('  - Add text: "Scan to try the platform"');
    console.log('');
    
    // Also create an HTML file to view the QR code
    const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>QR Code - Kenya Gov Admin Platform</title>
  <style>
    body {
      font-family: system-ui, -apple-system, sans-serif;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      margin: 0;
      background: #66023C;
      padding: 20px;
    }
    .container {
      background: white;
      padding: 40px;
      border-radius: 20px;
      box-shadow: 0 20px 60px rgba(0,0,0,0.3);
      text-align: center;
      max-width: 600px;
    }
    h1 {
      color: #333;
      margin: 0 0 10px 0;
      font-size: 28px;
    }
    .subtitle {
      color: #666;
      margin: 0 0 30px 0;
      font-size: 16px;
    }
    .qr-container {
      background: #f5f5f5;
      padding: 30px;
      border-radius: 15px;
      margin: 20px 0;
      display: inline-block;
    }
    img {
      max-width: 100%;
      height: auto;
      display: block;
    }
    .url {
      color: #667eea;
      font-size: 14px;
      word-break: break-all;
      margin: 20px 0;
      padding: 15px;
      background: #f8f9fa;
      border-radius: 8px;
      font-family: monospace;
    }
    .instructions {
      text-align: left;
      margin: 20px 0;
      padding: 20px;
      background: #e8f5e9;
      border-radius: 8px;
      border-left: 4px solid #4caf50;
    }
    .instructions h3 {
      margin: 0 0 10px 0;
      color: #2e7d32;
      font-size: 18px;
    }
    .instructions ol {
      margin: 10px 0;
      padding-left: 20px;
    }
    .instructions li {
      margin: 8px 0;
      color: #333;
    }
    .kenya-flag {
      font-size: 40px;
      margin-bottom: 20px;
    }
    @media print {
      body {
        background: white;
      }
      .container {
        box-shadow: none;
      }
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="kenya-flag">🇰🇪</div>
    <h1>Kenya Government Admin Platform</h1>
    <p class="subtitle">Scan to access the live demo</p>
    
    <div class="qr-container">
      <img src="qr-code.png" alt="QR Code" />
    </div>
    
    <div class="url">${url}</div>
    
    <div class="instructions">
      <h3>📱 How to Use This QR Code</h3>
      <ol>
        <li><strong>Test it:</strong> Scan with your phone camera to verify it works</li>
        <li><strong>In your video:</strong> Show for at least 5 seconds at intro and outro</li>
        <li><strong>Position:</strong> Place in corner (top-right or bottom-right)</li>
        <li><strong>Size:</strong> Make it large enough to scan from screen</li>
        <li><strong>Print:</strong> You can also print this page for presentations</li>
      </ol>
    </div>
    
    <p style="color: #999; font-size: 12px; margin-top: 30px;">
      Generated for video walkthrough | ${new Date().toLocaleDateString()}
    </p>
  </div>
</body>
</html>
    `.trim();
    
    fs.writeFileSync('qr-code-preview.html', html);
    console.log('🌐 Also created: qr-code-preview.html');
    console.log('   Open this file in a browser to preview your QR code');
    console.log('');
  });
}).on('error', (err) => {
  console.error('❌ Error generating QR code:', err.message);
  fs.unlink('qr-code.png', () => {});
});
