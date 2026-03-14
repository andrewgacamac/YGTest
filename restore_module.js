const fs = require('fs');

const files = fs.readdirSync('.').filter(f => f.endsWith('.html'));

for (const file of files) {
    let content = fs.readFileSync(file, 'utf8');

    // Add type="module" back
    content = content.replace('<script src="assets/js/main.js"></script>', '<script src="assets/js/main.js" type="module"></script>');
    content = content.replace("<script src='assets/js/main.js'></script>", "<script src='assets/js/main.js' type='module'></script>");

    fs.writeFileSync(file, content);
    console.log(`Added type module to ${file}`);
}
