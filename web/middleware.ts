import createMiddleware from "next-intl/middleware";
import { routing } from "./src/i18n/routing";

export default createMiddleware(routing);

export const config = {
  // Match all paths except static files, API routes, service worker, and
  // the PWA manifest.
  matcher: [
    "/((?!api|_next|_vercel|favicon.svg|icon-192.svg|icon-512.svg|icon-maskable-512.svg|manifest.webmanifest|sw.js|.*\\..*).*)",
  ],
};
