import type { NextConfig } from "next";
import withBundleAnalyzer from "@next/bundle-analyzer";
import createMDX from "@next/mdx";

const cspHeader = `
    default-src 'self';
    script-src 'self' 'unsafe-eval' 'unsafe-inline';
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
    // @ts-expect-error
    remarkPlugins: ["remark-gfm"],
    // @ts-expect-error
    rehypePlugins: [["rehype-katex", { strict: true, throwOnError: true }]],
  },
});

const withBundleAnalyzerConfig = withBundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
});

export default withBundleAnalyzerConfig(withMDX(nextConfig));
