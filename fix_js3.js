const fs = require('fs');

const files = fs.readdirSync('.').filter(f => f.endsWith('.html'));

for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');

  // Because main.js is a module, its DOMContentLoaded event might fire before it loads!
  // Let's strip the `type="module"` off the script import so it executes immediately synchronously!
  content = content.replace('<script src="assets/js/main.js" type="module"></script>', '<script src="assets/js/main.js"></script>');
  content = content.replace("<script src='assets/js/main.js' type='module'></script>", "<script src='assets/js/main.js'></script>");
  
  fs.writeFileSync(file, content);
  console.log(`Removed type module from ${file}`);
}
