"use client";

import { useEffect } from "react";

export default function ServiceWorkerRegister() {
  useEffect(() => {
    // Nunca en desarrollo: un service worker registrado en localhost queda
    // pegado entre sesiones de `npm run dev` y sirve versiones viejas
    // cacheadas, lo que causo confusion varias veces durante pruebas.
    if (process.env.NODE_ENV === "production" && "serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch(() => {});
    }
  }, []);

  return null;
}
