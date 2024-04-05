/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  //reactStrictMode: false
  experimental: {
    missingSuspenseWithCSRBailout: false,
  },
};

export default nextConfig;
