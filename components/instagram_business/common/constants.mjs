const USER_INSIGHT_METRICS = [
  "audience_city",
  "audience_country",
  "audience_gender_age",
  "audience_locale",
  "email_contacts",
  "follower_count",
  "get_directions_clicks",
  "impressions",
  "online_followers",
  "phone_call_clicks",
  "profile_views",
  "reach",
  "text_message_clicks",
  "website_clicks",
];

const USER_INSIGHT_PERIODS = {
  lifetime: [
    "audience_city",
    "audience_country",
    "audience_gender_age",
    "audience_locale",
    "online_followers",
  ],
  day: [
    "email_contacts",
    "follower_count",
    "get_directions_clicks",
    "impressions",
    "phone_call_clicks",
    "profile_views",
    "reach",
    "text_message_clicks",
    "website_clicks",
  ],
  week: [
    "impressions",
    "reach",
  ],
  days_28: [
    "impressions",
    "reach",
  ],
};

const MEDIA_INSIGHT_METRICS = {
  CAROUSEL_ALBUM: [
    "carousel_album_engagement",
    "carousel_album_impressions",
    "carousel_album_reach",
    "carousel_album_saved",
    "carousel_album_video_views",
  ],
  IMAGE: [
    "engagement",
    "impressions",
    "reach",
    "saved",
  ],
  VIDEO: [
    "engagement",
    "impressions",
    "reach",
    "saved",
    "video_views",
  ],
  REELS: [
    "comments",
    "likes",
    "plays",
    "reach",
    "saved",
    "shares",
    "total_interactions",
  ],
  STORY: [
    "exits",
    "impressions",
    "reach",
    "replies",
    "taps_forward",
    "taps_back",
  ],
};

const MEDIA_TYPE_OPTIONS = [
  {
    label: "image",
    value: "IMAGE",
  },
  {
    label: "video",
    value: "VIDEO",
  },
  {
    label: "reel",
    value: "REELS",
  },
];

const MEDIA_FIELDS_OPTIONS = [
  "comments_count",
  "id",
  "like_count",
  "media_type",
  "media_product_type",
  "media_url",
  "owner",
  "permalink",
  "timestamp",
  "username",
];

const COMMENT_FIELDS_OPTIONS = [
  "from",
  "hidden",
  "id",
  "like_count",
  "media",
  "parent_id",
  "replies",
  "text",
  "timestamp",
  "user",
  "username",
];

export default {
  USER_INSIGHT_METRICS,
  USER_INSIGHT_PERIODS,
  MEDIA_INSIGHT_METRICS,
  MEDIA_TYPE_OPTIONS,
  MEDIA_FIELDS_OPTIONS,
  COMMENT_FIELDS_OPTIONS,
};
