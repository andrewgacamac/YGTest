const fs = require('fs');

const file = 'assets/js/main.js';
let content = fs.readFileSync(file, 'utf8');
const search = `    const toggleBtn = document.querySelector('.mobile-menu-toggle');
    const headerNav = document.querySelector('.header__nav');`;

const replace = `    const toggleBtn = document.querySelector('.mobile-menu-toggle');
    const headerNav = document.querySelector('.header__nav');

    if (!toggleBtn) console.log("InitMobileMenu: toggleBtn not found");
    if (!headerNav) console.log("InitMobileMenu: headerNav not found");`;

content = content.replace(search, replace);
fs.writeFileSync(file, content);
