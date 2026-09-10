/** @type {import('next').NextConfig} */

// Avatars and target pictures are served straight out of the project's
// Supabase storage bucket, and `next/image` will only optimize a remote host
// that is named here. Read from the env var rather than hardcoded so a
// different Supabase project — or a local one — needs no code change.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;

const remotePatterns = supabaseUrl
  ? [
      {
        protocol: "https",
        hostname: new URL(supabaseUrl).hostname,
        // Narrowed to the public storage prefix so the image optimizer can't
        // be pointed at anything else on the host.
        pathname: "/storage/v1/object/public/**",
      },
    ]
  : [];

const nextConfig = {
  images: {
    remotePatterns,
  },
};

export default nextConfig;
