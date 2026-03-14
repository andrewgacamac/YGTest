const fs = require('fs');
const files = fs.readdirSync('.').filter(f => f.endsWith('.html'));

for (const file of files) {
    let content = fs.readFileSync(file, 'utf8');

    // Create a regex to find all hardcoded `lucide.createIcons()` and replace with a safe check
    const searchStr = /^\s*lucide\.createIcons\(\);\s*$/gm;
    const replaceStr = "      if (window.lucide) { lucide.createIcons(); }";

    if (content.match(searchStr)) {
        content = content.replace(searchStr, replaceStr);
        fs.writeFileSync(file, content);
        console.log(`Patched lucide.createIcons() in ${file}`);
    }
}
