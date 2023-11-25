import basicSsl from "@vitejs/plugin-basic-ssl";
import laravel, { refreshPaths } from 'laravel-vite-plugin';
import { defineConfig } from 'vite';

export default defineConfig({
    server: {
        https: true,
        host: '0.0.0.0',
        hmr: {
            host: 'localhost',
        }
    },
    plugins: [
        basicSsl(),
        laravel({
            input: [
                'resources/css/app.css',
                'resources/js/app.js',
            ],
            refresh: [
                ...refreshPaths,
                'app/Livewire/**',
            ],
            detectTls: true
        }),
    ],
});
