/** @type {import('next').NextConfig} */
const nextConfig = {
    serverExternalPackages: ['cheerio'],
    env: {
        GOOGLE_API_KEY: process.env.GOOGLE_API_KEY,
        OPENAI_API_KEY: process.env.OPENAI_API_KEY,
        ANTHROPIC_API_KEY: process.env.ANTHROPIC_API_KEY,
    },
};
export default nextConfig;
