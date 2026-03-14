const fs = require('fs');

let content = fs.readFileSync('index.html', 'utf8');
const targetStr = 'style="display: none; background: none; border: none; cursor: pointer;"';
if (content.includes(targetStr)) {
  content = content.replace(targetStr, '');
  fs.writeFileSync('index.html', content);
  console.log(`Updated index.html`);
}

let aboutStr = fs.readFileSync('about.html', 'utf8');
if (aboutStr.includes(targetStr)) {
  aboutStr = aboutStr.replace(targetStr, '');
  fs.writeFileSync('about.html', aboutStr);
}
