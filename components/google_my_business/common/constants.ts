// https://developers.google.com/my-business/reference/rest/v4/accounts.locations.localPosts#LocalPostTopicType
export const LOCAL_POST_TOPIC_TYPES = [
  {
    label: "Post contains basic information, like summary and images.",
    value: "STANDARD",
  },
  {
    label: "Post contains basic information and an event.",
    value: "EVENT",
  },
  {
    label:
      "Post contains basic information, an event and offer related content (e.g. coupon code)",
    value: "OFFER",
  },
  {
    label:
      "High-priority, and timely announcements related to an ongoing event. These types of posts are not always available for authoring.",
    value: "ALERT",
  },
];

// https://developers.google.com/my-business/reference/rest/v4/accounts.locations.localPosts#AlertType
export const LOCAL_POST_ALERT_TYPES = [
  {
    label: "No alert is specified.",
    value: "ALERT_TYPE_UNSPECIFIED",
  },
  {
    label: "Alerts related to the 2019 Coronavirus Disease pandemic. Covid posts only support a summary field and a call to action field. When these alerts are no longer relevant, new Alert post creation for type COVID-19 will be disabled. However, merchant will still be able to manage their existing COVID-19 posts.",
    value: "COVID_19",
  },
];

// https://developers.google.com/my-business/reference/rest/v4/accounts.locations.media#MediaItem.MediaFormat
export const MEDIA_FORMAT_OPTIONS = [
  // {
  //   label: "Format unspecified.",
  //   value: "MEDIA_FORMAT_UNSPECIFIED",
  // },
  {
    label: "Media item is a photo. In this version, only photos are supported.",
    value: "PHOTO",
  },
  {
    label: "Media item is a video.",
    value: "VIDEO",
  },
];

// https://developers.google.com/my-business/reference/rest/v4/accounts.locations.reviews/list
// https://developers.google.com/my-business/reference/rest/v4/accounts.locations/batchGetReviews
// Ascending `updateTime` and any `createTime` ordering are rejected with HTTP 400.
export const REVIEW_ORDER_BY_OPTIONS = [
  {
    label: "Most recently updated first (default)",
    value: "updateTime desc",
  },
  {
    label: "Lowest rating first",
    value: "rating",
  },
  {
    label: "Highest rating first",
    value: "rating desc",
  },
];

// Max `pageSize` accepted by reviews.list and batchGetReviews
export const REVIEWS_PAGE_SIZE = 50;

// Max `pageSize` accepted by localPosts.list
// https://developers.google.com/my-business/reference/rest/v4/accounts.locations.localPosts/list
export const POSTS_PAGE_SIZE = 100;

// https://developers.google.com/my-business/reference/performance/rest/v1/DailyMetric
// BUSINESS_CONVERSATIONS and BUSINESS_FOOD_ORDERS are deprecated and left out.
export const DAILY_METRIC_OPTIONS = [
  {
    label: "Profile views on Google Maps, desktop",
    value: "BUSINESS_IMPRESSIONS_DESKTOP_MAPS",
  },
  {
    label: "Profile views on Google Search, desktop",
    value: "BUSINESS_IMPRESSIONS_DESKTOP_SEARCH",
  },
  {
    label: "Profile views on Google Maps, mobile",
    value: "BUSINESS_IMPRESSIONS_MOBILE_MAPS",
  },
  {
    label: "Profile views on Google Search, mobile",
    value: "BUSINESS_IMPRESSIONS_MOBILE_SEARCH",
  },
  {
    label: "Direction requests",
    value: "BUSINESS_DIRECTION_REQUESTS",
  },
  {
    label: "Call button clicks",
    value: "CALL_CLICKS",
  },
  {
    label: "Website clicks",
    value: "WEBSITE_CLICKS",
  },
  {
    label: "Messaging button clicks (e.g. WhatsApp)",
    value: "MESSAGING_CLICKS",
  },
  {
    label: "Bookings made via Reserve with Google",
    value: "BUSINESS_BOOKINGS",
  },
  {
    label: "Menu clicks",
    value: "BUSINESS_FOOD_MENU_CLICKS",
  },
];

export const PERFORMANCE_API_URL = "https://businessprofileperformance.googleapis.com/v1";

// Max `pageSize` accepted by searchkeywords.impressions.monthly.list
// https://developers.google.com/my-business/reference/performance/rest/v1/locations.searchkeywords.impressions.monthly/list
export const KEYWORDS_PAGE_SIZE = 100;
