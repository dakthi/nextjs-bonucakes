/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'cdn.chartedconsultants.com',
                port: "",
                pathname: '/**',
            },
            {
                protocol: 'https',
                hostname: 'thielts.chartedconsultants.com',
                pathname: '/**',
            },
            {
                protocol: 'https',
                hostname: 'bonucakes.com',
                pathname: '/**',
            },
            {
                protocol: 'https',
                hostname: 'static.bonucakes.com',
                pathname: '/**',
            }
        ],
        unoptimized: false,
    },
    webpack: (config) => {
        config.module.rules.push({
            test: /\.(mp4|webm)$/,
            use: {
                loader: 'file-loader',
                options: {
                    publicPath: '/_next/static/media/',
                    outputPath: 'static/media/',
                    name: '[name].[hash].[ext]',
                },
            },
        });
        return config;
    },
    async headers() {
        return [
            {
                // Apply security headers to all routes
                source: '/:path*',
                headers: [
                    {
                        key: 'Strict-Transport-Security',
                        value: 'max-age=31536000; includeSubDomains; preload',
                    },
                    {
                        key: 'X-DNS-Prefetch-Control',
                        value: 'on',
                    },
                ],
            },
        ];
    },
};

module.exports = nextConfig;
