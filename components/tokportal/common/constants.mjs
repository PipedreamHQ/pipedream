const BASE_URL = "https://app.tokportal.com/api/ext";
const CLIENT_HEADER = "pipedream-tokportal/0.1.0";
const DOCS_URL = "https://developers.tokportal.com";
const DEFAULT_LIMIT = 100;
const DEFAULT_SIGNATURE_TOLERANCE_SECONDS = 300;

const PLATFORM_OPTIONS = [
  {
    label: "TikTok",
    value: "tiktok",
  },
  {
    label: "Instagram",
    value: "instagram",
  },
];

const BUNDLE_TYPE_OPTIONS = [
  {
    label: "Account and Videos",
    value: "account_and_videos",
  },
  {
    label: "Account Only",
    value: "account_only",
  },
  {
    label: "Videos Only (existing account)",
    value: "videos_only",
  },
];

const BUNDLE_STATUS_OPTIONS = [
  "draft",
  "pending_setup",
  "published",
  "published_priority",
  "accepted",
  "completed",
  "cancelled",
  "archived",
];

const VIDEO_TYPE_OPTIONS = [
  {
    label: "Video",
    value: "video",
  },
  {
    label: "Carousel",
    value: "carousel",
  },
  {
    label: "Story",
    value: "story",
  },
];

const INSTAGRAM_CONTENT_TYPE_OPTIONS = [
  {
    label: "Reel",
    value: "reel",
  },
  {
    label: "Post",
    value: "post",
  },
];

const YOUTUBE_VISIBILITY_OPTIONS = [
  "public",
  "unlisted",
  "private",
];

const IMAGE_PURPOSE_OPTIONS = [
  {
    label: "Carousel slide",
    value: "carousel",
  },
  {
    label: "Profile picture",
    value: "profile_picture",
  },
];

const BAN_STATUS_OPTIONS = [
  {
    label: "Appeal Pending",
    value: "appeal_pending",
  },
  {
    label: "Appeal Accepted",
    value: "appeal_accepted",
  },
  {
    label: "Appeal Refused",
    value: "appeal_refused",
  },
  {
    label: "No Appeal, Banned",
    value: "no_appeal_banned",
  },
];

const BAN_RESOLUTION_OPTIONS = [
  {
    label: "Pending",
    value: "pending",
  },
  {
    label: "Refund",
    value: "refund",
  },
  {
    label: "Remake",
    value: "remake",
  },
  {
    label: "No Remake",
    value: "no_remake",
  },
];

// Fallback list, kept in sync with GET /webhooks/events (public endpoint).
const WEBHOOK_EVENTS = [
  "webhook.test",
  "bundle.created",
  "bundle.published",
  "bundle.cancelled",
  "bundle.archived",
  "account.configured",
  "account.in_review",
  "account.published",
  "account.pending_corrections",
  "account.finalized",
  "account.remade",
  "account.banned",
  "account.ban_appeal.submitted",
  "account.ban_appeal.resolved",
  "account.ban_resolution.decided",
  "account.revealed",
  "video.configured",
  "video.in_review",
  "video.published",
  "video.pending_corrections",
  "video.finalized",
  "warming.session_started",
  "warming.term_verified",
  "warming.session_completed",
  "subscription.renewed",
  "subscription.lapsed",
  "subscription.cancelled",
  "subscription.reactivated",
  "subscription.ended",
  "credits.restored",
];

export default {
  BASE_URL,
  CLIENT_HEADER,
  DOCS_URL,
  DEFAULT_LIMIT,
  DEFAULT_SIGNATURE_TOLERANCE_SECONDS,
  PLATFORM_OPTIONS,
  BUNDLE_TYPE_OPTIONS,
  BUNDLE_STATUS_OPTIONS,
  VIDEO_TYPE_OPTIONS,
  INSTAGRAM_CONTENT_TYPE_OPTIONS,
  YOUTUBE_VISIBILITY_OPTIONS,
  IMAGE_PURPOSE_OPTIONS,
  BAN_STATUS_OPTIONS,
  BAN_RESOLUTION_OPTIONS,
  WEBHOOK_EVENTS,
};
