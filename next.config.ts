import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'krqlnwbfiqlfhslwxssg.supabase.co',
        port: '',
        pathname: '/**', // Allow all paths from this supabase instance
      },
    ],
  },
};

export default nextConfig;
