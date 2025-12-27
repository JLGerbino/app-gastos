import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";


export default defineConfig({
  base: "/app-gastos/",
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["logo.png", "favicon.ico"],
      manifest: {
        name: "Vamo&Vamo",
        short_name: "Vamo",
        description: "La manera más fácil de compartir gastos",
        theme_color: "#ADC1c0",
        background_color: "#ADC1c0",
        display: "standalone",
        start_url: "/app-gastos/",
        icons: [
          {
            src: "/app-gastos/pwa-192x192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "/app-gastos/pwa-512x512.png",
            sizes: "512x512",
            type: "image/png",
          },
        ],
      },
    }),
  ],
});


// export default defineConfig({
//   base: "/gastos-vacaciones/", // 👈 nombre EXACTO del repo
//   plugins: [
//     react(),
//     VitePWA({
//       registerType: "autoUpdate",
//       includeAssets: ["favicon.ico"],
//       manifest: {
//         name: "Vamo&Vamo",
//         short_name: "Vamo",
//         description: "La manera más fácil de compartir gastos",
//         theme_color: "#ADC1c0",
//         background_color: "#ADC1c0",
//         display: "standalone",
//         start_url: "/gastos-vacaciones/",
//         scope: "/gastos-vacaciones/",
//         icons: [
//           {
//             src: "/gastos-vacaciones/pwa-192x192.png",
//             sizes: "192x192",
//             type: "image/png",
//           },
//           {
//             src: "/gastos-vacaciones/pwa-512x512.png",
//             sizes: "512x512",
//             type: "image/png",
//           },
//         ],
//       },
//     }),
//   ],
// });



// export default defineConfig({
//   plugins: [
//     react(),
//     VitePWA({
//       registerType: "autoUpdate",
//       includeAssets: ["logo.png", "favicon.ico"],
//       manifest: {
//         name: "Vamo&Vamo",
//         short_name: "Vamo",
//         description: "La manera más fácil de compartir gastos",
//         theme_color: "#ADC1c0",
//         background_color: "#ADC1c0",
//         display: "standalone",
//         start_url: "/",
//         icons: [
//           {
//             src: "/pwa-192x192.png",
//             sizes: "192x192",
//             type: "image/png",
//           },
//           {
//             src: "/pwa-512x512.png",
//             sizes: "512x512",
//             type: "image/png",
//           }
//         ],
//       },
//     }),
//   ],
// });








// import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react'

// // https://vite.dev/config/
// export default defineConfig({
//   base: "/app-gastos/",
//   plugins: [react()],
// })

