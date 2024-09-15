import { defineConfig } from 'vite';
import solidPlugin from 'vite-plugin-solid';
import devtools from 'solid-devtools/vite';

export default defineConfig(({ mode }) => { return {
  plugins: [
    /* 
    Uncomment the following line to enable solid-devtools.
    For more info see https://github.com/thetarnav/solid-devtools/tree/main/packages/extension#readme
    */
    devtools({
      /* features options - all disabled by default */
      autoname: true, // e.g. enable autoname
      }),
    solidPlugin(),
  ],
  server: {
    port: 3000,
  },
  build: {
    target: 'esnext', 
    rollupOptions: {
      output: {
        entryFileNames: `[name].js`,
        chunkFileNames: `[name].js`,
        assetFileNames: `[name].[ext]`
      }
    }
  },
}});
