import type { NextConfig } from "next";

/*
 * NEXT_DIST_DIR lets CI/Docker sandboxes run a production build into an
 * isolated directory (e.g. `.next-prod`) without touching the running dev
 * server's `.next`. Defaults to the standard `.next`.
 */
const distDir = process.env.NEXT_DIST_DIR || ".next";

const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-DNS-Prefetch-Control", value: "off" },
  // NOTE: no X-Frame-Options / frame-ancestors here on purpose — SELLR.AI is
  // an embeddable Whop app and runs inside sandbox preview iframes. Framing
  // is governed by Supabase/Whop embedding requirements (see docs/SECURITY.md).
];

const nextConfig: NextConfig = {
  output: "standalone",
  distDir,
  /* Prisma 7 runs on the pg driver adapter — keep pg unbundled server-side. */
  serverExternalPackages: ["pg", "@prisma/adapter-pg"],
  /*
   * TypeScript errors fail the build (PART 11 rule 7). App code must stay
   * type-clean; non-app demo folders (examples/, skills/) are excluded in
   * tsconfig.json instead of being silently ignored here.
   */
  typescript: {
    ignoreBuildErrors: false,
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
    ];
  },
  reactStrictMode: false,
};

export default nextConfig;
