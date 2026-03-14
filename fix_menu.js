const fs = require('fs');
const files = fs.readdirSync('.').filter(f => f.endsWith('.html'));

const targetStr1 = 'style="display: none; background: none; border: none; cursor: pointer;"';
const targetStr2 = 'style="display: none; background: none; border: none; cursor: pointer"';
const targetStr3 = 'style="display: none; background: none; border: none; cursor: pointer; "';

for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');
  let original = content;
  content = content.replaceAll(targetStr1, '');
  content = content.replaceAll(targetStr2, '');
  content = content.replaceAll(targetStr3, '');
  if (content !== original) {
    fs.writeFileSync(file, content);
    console.log(`Updated ${file}`);
  }
}
