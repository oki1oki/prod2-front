import {defineConfig} from 'vite';
import {resolve} from 'path';

export default defineConfig({
    root: 'solution',
    build: {
        outDir: '../dist',
        emptyOutDir: true,
        rollupOptions: {
            input: {
                main: resolve(__dirname, 'solution/index.html'),
                test: resolve(__dirname, 'solution/test/index.html'),
            },
        },
    },
});
