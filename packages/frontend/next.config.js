/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['localhost', 's3.amazonaws.com', 'your-s3-bucket.s3.amazonaws.com'],
  },
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
  },
}

module.exports = nextConfig
