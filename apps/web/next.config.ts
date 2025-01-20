import type { NextConfig } from "next";
import withBundleAnalyzer from "@next/bundle-analyzer";
import createMDX from "@next/mdx";

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
