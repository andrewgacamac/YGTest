const fs = require('fs');

const files = fs.readdirSync('.').filter(f => f.endsWith('.html'));

const goodMenuHTML = `<button aria-expanded="false" aria-label="Toggle Menu" class="mobile-menu-toggle">
    <svg width="28" height="28" fill="none" stroke="#2E7D32" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <line x1="4" x2="20" y1="12" y2="12"></line>
        <line x1="4" x2="20" y1="6" y2="6"></line>
        <line x1="4" x2="20" y1="18" y2="18"></line>
    </svg>
</button>`;

for (const file of files) {
    let content = fs.readFileSync(file, 'utf8');

    // Replace the button entirely
    const buttonRegex = /<button[^>]*class="mobile-menu-toggle[^"]*"[^>]*>[\s\S]*?<\/button>/gi;
    content = content.replace(buttonRegex, goodMenuHTML);

    // Also fix quote.html header positioning
    if (file === 'quote.html') {
        content = content.replace('position: fixed;\n      top: 0;\n      left: 0;\n      right: 0;\n      height: 80px;\n      background: var(--white);', 'position: relative;\n      height: 80px;\n      background: var(--white);');
        content = content.replace('margin-top: 80px;', 'margin-top: 0;');
        content = content.replace('min-height: calc(100vh - 80px);', 'min-height: calc(100vh - 80px); /* fixed */');
    }

    fs.writeFileSync(file, content);
    console.log(`Processed ${file}`);
}
