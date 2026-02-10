import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
    build: {
        rollupOptions: {
            input: {
                main: resolve(__dirname, 'index.html'),
                about: resolve(__dirname, 'about.html'),
                artificial_turf_mississauga: resolve(__dirname, 'artificial-turf-mississauga.html'),
                faq: resolve(__dirname, 'faq.html'),
                gallery: resolve(__dirname, 'gallery.html'),
                get_3d_design: resolve(__dirname, 'get-3d-design.html'),
                how_it_works: resolve(__dirname, 'how-it-works.html'),
                packages: resolve(__dirname, 'packages.html'),
                partner_program: resolve(__dirname, 'partner-program.html'),
                privacy: resolve(__dirname, 'privacy.html'),
                quote: resolve(__dirname, 'quote.html'),
                strategy_presentation: resolve(__dirname, 'strategy_presentation.html'),
                terms: resolve(__dirname, 'terms.html'),
            },
        },
    },
});
