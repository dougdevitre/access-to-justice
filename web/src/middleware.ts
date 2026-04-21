import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

export default createMiddleware(routing);

export const config = {
  // Run middleware on root (to redirect / → /en) and every path that's not a
  // static file, Next internals, or an API/service-worker/manifest asset.
  matcher: [
    "/",
    "/((?!api|_next|_vercel|favicon.svg|icon-192.svg|icon-512.svg|icon-maskable-512.svg|manifest.webmanifest|sw.js|.*\\..*).*)",
  ],
};
