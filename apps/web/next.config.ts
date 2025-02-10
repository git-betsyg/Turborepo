import type { NextConfig } from "next";
import withBundleAnalyzer from "@next/bundle-analyzer";
import createMDX from "@next/mdx";
import remarkGfm from "remark-gfm";
import rehypeKatex from "rehype-katex";

const cspHeader = `
    default-src 'self';
    script-src 'self' 'unsafe-eval' 'unsafe-inline' https://www.googletagmanager.com;
    style-src 'self' 'unsafe-inline';
    img-src 'self' blob: data:;
    font-src 'self';
    object-src 'none';
    base-uri 'self';
    form-action 'self';
    frame-ancestors 'none';
    upgrade-insecure-requests;
`;

const nextConfig: NextConfig = {
  /* config options here */
  // 优化包导入
  experimental: {
    optimizePackageImports: [],
  },
  // 选择特定软件包不捆绑
  serverExternalPackages: [],
  // Configure `pageExtensions` to include markdown and MDX files
  pageExtensions: ["js", "jsx", "md", "mdx", "ts", "tsx"],
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Content-Security-Policy",
            value: cspHeader.replace(/\n/g, ""),
          },
        ],
      },
    ];
  },
};

const withMDX = createMDX({
  // Add markdown plugins here, as desired
  options: {
    remarkPlugins: [remarkGfm],
    rehypePlugins: [[rehypeKatex, { strict: true, throwOnError: true }]],
  },
});

const withPWA = require("next-pwa")({
  dest: "public",
});

const withBundleAnalyzerConfig = withBundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
});

export default withMDX(withPWA(withBundleAnalyzerConfig(nextConfig)));
