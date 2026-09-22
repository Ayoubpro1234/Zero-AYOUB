import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';
import {defineConfig, Plugin} from 'vite';

function apkServePlugin(): Plugin {
  return {
    name: 'apk-serve-plugin',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const rawUrl = req.url || '';
        const pathname = rawUrl.split('?')[0];
        if (pathname === '/zero-app-debug.apk' || pathname.endsWith('.apk') || pathname === '/download-apk') {
          const apkPath = path.resolve(__dirname, 'public/zero-app-debug.apk');
          if (fs.existsSync(apkPath)) {
            const stat = fs.statSync(apkPath);
            res.writeHead(200, {
              'Content-Type': 'application/vnd.android.package-archive',
              'Content-Disposition': 'attachment; filename="zero-app-debug.apk"',
              'Content-Length': stat.size.toString(),
              'Cache-Control': 'no-cache, no-store, must-revalidate',
              'Pragma': 'no-cache',
              'Expires': '0',
            });
            fs.createReadStream(apkPath).pipe(res);
            return;
          }
        }
        next();
      });
    },
    configurePreviewServer(server) {
      server.middlewares.use((req, res, next) => {
        const rawUrl = req.url || '';
        const pathname = rawUrl.split('?')[0];
        if (pathname === '/zero-app-debug.apk' || pathname.endsWith('.apk') || pathname === '/download-apk') {
          const apkPath = path.resolve(__dirname, 'public/zero-app-debug.apk');
          if (fs.existsSync(apkPath)) {
            const stat = fs.statSync(apkPath);
            res.writeHead(200, {
              'Content-Type': 'application/vnd.android.package-archive',
              'Content-Disposition': 'attachment; filename="zero-app-debug.apk"',
              'Content-Length': stat.size.toString(),
              'Cache-Control': 'no-cache, no-store, must-revalidate',
              'Pragma': 'no-cache',
              'Expires': '0',
            });
            fs.createReadStream(apkPath).pipe(res);
            return;
          }
        }
        next();
      });
    },
  };
}

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss(), apkServePlugin()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      hmr: process.env.DISABLE_HMR !== 'true',
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
