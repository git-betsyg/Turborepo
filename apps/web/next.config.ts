import type { NextConfig } from "next";
import withBundleAnalyzer from '@next/bundle-analyzer'

const nextConfig: NextConfig = {
    /* config options here */
    // 优化包导入
    experimental: {
        optimizePackageImports: [],
    },
    // 选择特定软件包不捆绑
    serverExternalPackages: [],
};

const withBundleAnalyzerConfig = withBundleAnalyzer({
    enabled: process.env.ANALYZE === 'true',
})

export default withBundleAnalyzerConfig(nextConfig)
