/** @type {import('next').NextConfig} */
import { createRequire  } from 'module';
const require = createRequire(import.meta.url);

const withNextIntl = require('next-intl/plugin')();
 
export default withNextIntl({
    reactStrictMode: false,
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "**",
            },
            {
                protocol: "http",
                hostname: "**",
            }
        ]
    },

    async headers() {
        return [
            {
                source: '/:path*',
                headers: [
                    { key: 'Referrer-Policy',  value: 'strict-origin-when-cross-origin'},
                    { key: 'X-Content-Type-Options', value: 'nosniff' },
                    { key: 'X-Frame-Options', value: 'DENY' }
                ]
            }
        ];
    }
});