const fs = require('fs');

const files = fs.readdirSync('.').filter(f => f.endsWith('.html'));

const activeRules = `
      .header__nav.active {
        display: flex;
        flex-direction: column;
        position: absolute;
        top: 100%;
        left: 0;
        right: 0;
        background: var(--white);
        padding: 20px;
        box-shadow: 0 4px 10px rgba(0,0,0,0.1);
        align-items: flex-start;
        z-index: 1001;
      }
      
      .nav-link {
        width: 100%;
        padding: 12px 16px;
        border-bottom: 1px solid var(--border);
      }
      
      .nav-link:last-child {
        border-bottom: none;
      }
`;

for (const file of files) {
    let content = fs.readFileSync(file, 'utf8');

    // We are looking for the "@media (max-width: 1023px) {" block that usually contains:
    // .header__nav { display: none; }

    // If the file does not have .header__nav.active defined, inject it right after .header__nav { display: none; }
    if (content.includes('.header__nav {') && content.includes('display: none;') && !content.includes('.header__nav.active {') && !content.includes('href="assets/css/style.css"')) {

        // We will look for this exact sequence:
        const searchStr1 = `.header__nav {
          display: none;
        }`;
        const searchStr2 = `.header__nav {
        display: none;
      }`;

        let replaced = false;

        if (content.includes(searchStr1)) {
            content = content.replace(searchStr1, searchStr1 + '\n' + activeRules);
            replaced = true;
        } else if (content.includes(searchStr2)) {
            content = content.replace(searchStr2, searchStr2 + '\n' + activeRules);
            replaced = true;
        }

        if (replaced) {
            fs.writeFileSync(file, content);
            console.log(`Injected missing active CSS rules into ${file}`);
        }
    }
}
