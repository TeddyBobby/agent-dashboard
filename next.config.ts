import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Double-invoke renders/effects in development to surface impure components
  // and stale-closure bugs early. No effect in production builds.
  reactStrictMode: true,

  // React Compiler (stabilized in Next.js 16) auto-memoizes components and
  // hooks, removing the need to hand-write useMemo/useCallback. Next.js pairs
  // it with a SWC pass that only compiles files with JSX/hooks, so the build
  // cost stays small. Requires `babel-plugin-react-compiler` (devDependency).
  reactCompiler: true,

  // Harden every response against the most common passive attacks:
  //   - nosniff stops MIME-type confusion (stops browsers guessing content type)
  //   - DENY blocks clickjacking (page can't be framed by a third party)
  //   - strict-origin-when-cross-origin limits Referrer leakage to same-origin
  headers: async () => [
    {
      source: "/:path*",
      headers: [
        { key: "X-Content-Type-Options", value: "nosniff" },
        { key: "X-Frame-Options", value: "DENY" },
        { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
      ],
    },
  ],
};

export default nextConfig;
