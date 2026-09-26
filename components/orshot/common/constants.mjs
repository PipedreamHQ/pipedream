export const RENDER_FORMATS = [
  {
    label: "PNG",
    value: "png",
  },
  {
    label: "JPG",
    value: "jpg",
  },
  {
    label: "WebP",
    value: "webp",
  },
  {
    label: "AVIF",
    value: "avif",
  },
  {
    label: "PDF",
    value: "pdf",
  },
  {
    label: "MP4 (video)",
    value: "mp4",
  },
  {
    label: "WebM (video)",
    value: "webm",
  },
  {
    label: "MOV (video)",
    value: "mov",
  },
  {
    label: "MKV (video)",
    value: "mkv",
  },
  {
    label: "GIF (animated)",
    value: "gif",
  },
];

export const IMAGE_FORMATS = [
  "png",
  "jpg",
  "webp",
  "avif",
];

export const VIDEO_FORMATS = [
  "mp4",
  "webm",
  "mov",
  "mkv",
  "gif",
];

// Smart Resize presets accepted by response.size and response.extraSizes
export const SIZE_PRESETS = [
  {
    label: "A4 Document (2480x3508)",
    value: "a4-document",
  },
  {
    label: "Blog Header (1200x630)",
    value: "blog-header",
  },
  {
    label: "Business Card (1050x600)",
    value: "business-card",
  },
  {
    label: "Email Header (600x200)",
    value: "email-header",
  },
  {
    label: "Facebook Cover (851x315)",
    value: "facebook-cover",
  },
  {
    label: "Facebook Post (1200x630)",
    value: "facebook-post",
  },
  {
    label: "Facebook Story (1080x1920)",
    value: "facebook-story",
  },
  {
    label: "Instagram Post Landscape (1080x566)",
    value: "instagram-post-landscape",
  },
  {
    label: "Instagram Post Portrait (1080x1350)",
    value: "instagram-post-portrait",
  },
  {
    label: "Instagram Post Square (1080x1080)",
    value: "instagram-post",
  },
  {
    label: "Instagram Story / Reel (1080x1920)",
    value: "instagram-story",
  },
  {
    label: "Leaderboard Ad (728x90)",
    value: "leaderboard-ad",
  },
  {
    label: "LinkedIn Banner (1584x396)",
    value: "linkedin-banner",
  },
  {
    label: "LinkedIn Post (1200x627)",
    value: "linkedin-post",
  },
  {
    label: "Medium Rectangle Ad (300x250)",
    value: "medium-rectangle-ad",
  },
  {
    label: "Open Graph Image (1200x630)",
    value: "og-image",
  },
  {
    label: "Pinterest Pin (1000x1500)",
    value: "pinterest-pin",
  },
  {
    label: "Presentation 16:9 (1920x1080)",
    value: "presentation-16-9",
  },
  {
    label: "TikTok Video (1080x1920)",
    value: "tiktok-video",
  },
  {
    label: "Twitter/X Header (1500x500)",
    value: "twitter-header",
  },
  {
    label: "Twitter/X Post (1200x675)",
    value: "twitter-post",
  },
  {
    label: "US Letter (2550x3300)",
    value: "us-letter",
  },
  {
    label: "Website Banner (1920x600)",
    value: "website-banner",
  },
  {
    label: "WhatsApp Status (1080x1920)",
    value: "whatsapp-status",
  },
  {
    label: "YouTube Short (1080x1920)",
    value: "youtube-short",
  },
  {
    label: "YouTube Thumbnail (1280x720)",
    value: "youtube-thumbnail",
  },
  {
    label: "Zoom Background (1920x1080)",
    value: "zoom-background",
  },
];

export const SOCIAL_POST_STATUSES = [
  {
    label: "Publish now",
    value: "published",
  },
  {
    label: "Save as draft",
    value: "draft",
  },
  {
    label: "Schedule",
    value: "scheduled",
  },
];

export const WORKFLOW_STATUSES = [
  "draft",
  "active",
  "paused",
  "archived",
];

export const SOURCE = "orshot-pipedream";
