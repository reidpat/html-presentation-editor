// vite.config.js
import { sveltekit } from '@sveltejs/kit/vite';
import path from 'path';

export default {
    plugins: [sveltekit()],
    server: {
        fs: {
            // Allow serving files from one level up to the project root
            allow: ['..', path.resolve('./static/slides')]
        }
    }
};
