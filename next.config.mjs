/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // All images are now served from /public — no remote patterns needed.
    // Next.js Image automatically converts PNGs to WebP and resizes them.
    formats: ['image/webp', 'image/avif'],
    // The 3 destination PNGs are 2752×1536 — allow up to that width.
    deviceSizes: [390, 640, 768, 1080, 1280, 1920, 2752],
    imageSizes: [16, 32, 64, 96, 128, 256, 384, 640, 900],
    minimumCacheTTL: 60 * 60 * 24 * 365, // 1 year
  },
}

export default nextConfig
