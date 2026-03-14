const fs = require('fs');

// 1. Fix style.css
let style = fs.readFileSync('assets/css/style.css', 'utf8');
style = style.replace('position: fixed;\n  top: 0;\n  left: 0;\n  right: 0;\n  height: var(--header-height);\n  background: var(--white);', 'position: relative;\n  height: var(--header-height);\n  background: var(--white);');
// Remove padding-top from hero
style = style.replace('padding-top: var(--header-height);', '/* padding-top: var(--header-height); removed for relative header */');
fs.writeFileSync('assets/css/style.css', style);
console.log('Fixed style.css header positioning');

// 2. Fix quote.html inline styles
let quote = fs.readFileSync('quote.html', 'utf8');
quote = quote.replace('position: fixed;\n      top: 0;\n      left: 0;\n      right: 0;\n      height: 80px;\n      background: var(--white);', 'position: relative;\n      height: 80px;\n      background: var(--white);');
quote = quote.replace('margin-top: 80px;', 'margin-top: 0;');
// Also fix quote.html min-height
quote = quote.replace('min-height: calc(100vh - 80px);', 'min-height: calc(100vh - 80px); /* header height balanced */');
fs.writeFileSync('quote.html', quote);
console.log('Fixed quote.html header positioning');

// 3. Inject explicit SVG hamburger icon to all HTML files so it NEVER disappears
const files = fs.readdirSync('.').filter(f => f.endsWith('.html'));

const badMenuHTML1 = '<button aria-expanded="false" aria-label="Toggle Menu" class="mobile-menu-toggle" ><i data-lucide="menu"></i></button>';
const badMenuHTML2 = '<button aria-expanded="false" aria-label="Toggle Menu" class="mobile-menu-toggle"><i data-lucide="menu"></i></button>';
const badMenuHTML3 = '<button aria-expanded="false" aria-label="Toggle Menu" class="mobile-menu-toggle">\n        <i data-lucide="menu"></i></button>';
const badMenuHTML4 = '<button aria-expanded="false" aria-label="Toggle Menu" class="mobile-menu-toggle auto-style-1">\n        <i data-lucide="menu"></i></button>';

const goodMenuHTML = `<button aria-expanded="false" aria-label="Toggle Menu" class="mobile-menu-toggle">
    <svg width="28" height="28" fill="none" stroke="#2E7D32" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <line x1="4" x2="20" y1="12" y2="12"></line>
        <line x1="4" x2="20" y1="6" y2="6"></line>
        <line x1="4" x2="20" y1="18" y2="18"></line>
    </svg>
</button>`;

for (const file of files) {
    let content = fs.readFileSync(file, 'utf8');
    
    // Use regex to catch variations of the menu toggle button
    const regex = /<button[^>]*class="mobile-menu-toggle[^"]*"[^>]*>[\s\S]*?(?:<i data-lucide="menu"><\/i>|<\/button>)/gi;
    
    if (content.match(regex)) {
        content = content.replace(regex, goodMenuHTML);
        fs.writeFileSync(file, content);
        console.log(`Injected hardcoded SVG hamburger into ${file}`);
    }
}
