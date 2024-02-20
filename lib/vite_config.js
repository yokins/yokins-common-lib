import { fileURLToPath, URL } from "node:url";
import vue from "@vitejs/plugin-vue";
import viteCompression from "vite-plugin-compression";
import legacy from "@vitejs/plugin-legacy";
import eslint from "vite-plugin-eslint";
import AutoImport from "unplugin-auto-import/vite";
import Components from "unplugin-vue-components/vite";
import vueSetupExtend from "vite-plugin-vue-setup-extend";

const generateViteConfig = (
    resolvers = [],
    imports = [],
    include = [],
    exclude = []
) => {
    return {
        plugins: [
            vue(),
            Components({
                resolvers: resolvers,
            }),
            AutoImport({
                imports: imports,
                eslintrc: {
                    enabled: true,
                    filepath: "./.eslintrc-auto-import.json",
                    globalsPropValue: true,
                },
            }),
            eslint(),
            viteCompression({
                threshold: 1024000,
            }),
            legacy({
                targets: ["defaults", "ie >= 11", "chrome 52", "android >= 7"], //需要兼容的目标列表，可以设置多个
                additionalLegacyPolyfills: ["regenerator-runtime/runtime"],
                renderLegacyChunks: false,
                polyfills: [
                    "es.symbol",
                    "es.array.filter",
                    "es.promise",
                    "es.promise.finally",
                    "es/map",
                    "es/set",
                    "es.array.for-each",
                    "es.object.define-properties",
                    "es.object.define-property",
                    "es.object.get-own-property-descriptor",
                    "es.object.get-own-property-descriptors",
                    "es.object.keys",
                    "es.object.to-string",
                    "web.dom-collections.for-each",
                    "esnext.global-this",
                    "esnext.string.match-all",
                ],
            }),
            vueSetupExtend(),
        ],
        resolve: {
            alias: {
                "@": fileURLToPath(new URL("./src", import.meta.url)),
            },
        },
        optimizeDeps: {
            include: include,
            exclude: exclude,
        },
    };
};

export { generateViteConfig };
