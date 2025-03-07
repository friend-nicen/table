import {defineConfig} from 'vite';
import path from 'path';
import vue from '@vitejs/plugin-vue';
import Components from 'unplugin-vue-components/vite';
import autoprefixer from 'autoprefixer';
import {AntDesignVueResolver} from 'unplugin-vue-components/resolvers';
import {AndDesignVueResolve, createStyleImportPlugin} from 'vite-plugin-style-import';

export default defineConfig({
    plugins: [
        vue(),
        Components({
            resolvers: [
                AntDesignVueResolver({
                    importStyle: 'less'
                })
            ],
        }),
        createStyleImportPlugin({
            resolves: [AndDesignVueResolve()],
        })
    ],

    build: {
        sourcemap: false,
        cssTarget: "chrome61",
        outDir: "dist"
    },
    css: {
        preprocessorOptions: {
            less: {
                javascriptEnabled: true
            },
        },
        postcss: {
            plugins: [
                autoprefixer({
                    overrideBrowserslist: [
                        "Android 4.1",
                        "iOS 7.1",
                        "Chrome > 31",
                        "ff > 31",
                        "ie >= 8",
                        "last 10 versions"
                    ],
                    grid: true,
                })
            ]
        }
    },
    server: {
        host: "0.0.0.0",
        port: 8081,
        hmr: {
            path: "/ws"
        }
    },
    resolve: {
        alias: {
            '@': path.join(__dirname, 'src')
        }
    }
})


