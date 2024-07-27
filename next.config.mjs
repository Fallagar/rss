/** @type {import('next').NextConfig} */
const nextConfig = {
    async redirects() {
        return [
            {
                source: "/",
                destination: "/feed",
                permanent: true,
            },
        ];
    },
    experimental: { instrumentationHook: true },
};
export default nextConfig;
