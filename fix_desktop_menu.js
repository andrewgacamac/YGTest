const fs = require('fs');
let style = fs.readFileSync('assets/css/style.css', 'utf8');
style = style.replace('.mobile-menu-toggle {\n  display: flex !important;', '.mobile-menu-toggle {\n  display: none !important; /* hidden on desktop */\n}\n@media (max-width: 1024px) {\n.mobile-menu-toggle {\n   display: flex !important;');

if (!style.includes('display: none !important; /* hidden on desktop */')) {
    style = style.replace('.mobile-menu-toggle {\n  display: none;', '.mobile-menu-toggle {\n  display: none !important; /* hidden on desktop */');
}

fs.writeFileSync('assets/css/style.css', style);
