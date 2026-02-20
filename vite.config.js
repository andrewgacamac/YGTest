import { defineConfig } from 'vite';
import { resolve, basename, extname } from 'path';
import fs from 'fs';

// Get all html files in the current directory
const files = fs.readdirSync(__dirname).filter(file => file.endsWith('.html'));
const input = {};

files.forEach(file => {
    // skip backups or unnecessary html files if desired
    if (!file.includes('_backup')) {
        const name = basename(file, extname(file));
        input[name] = resolve(__dirname, file);
    }
});

export default defineConfig({
    build: {
        rollupOptions: {
            input,
        },
    },
});
