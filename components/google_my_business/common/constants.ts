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

export const PERFORMANCE_BASE_URL = "https://businessprofileperformance.googleapis.com/v1";

// https://developers.google.com/my-business/reference/performance/rest/v1/DailyMetric
export const DAILY_METRIC_OPTIONS = [
  {
    label: "Business Impressions - Desktop Maps",
    value: "BUSINESS_IMPRESSIONS_DESKTOP_MAPS",
  },
  {
    label: "Business Impressions - Desktop Search",
    value: "BUSINESS_IMPRESSIONS_DESKTOP_SEARCH",
  },
  {
    label: "Business Impressions - Mobile Maps",
    value: "BUSINESS_IMPRESSIONS_MOBILE_MAPS",
  },
  {
    label: "Business Impressions - Mobile Search",
    value: "BUSINESS_IMPRESSIONS_MOBILE_SEARCH",
  },
  {
    label: "Business Conversations",
    value: "BUSINESS_CONVERSATIONS",
  },
  {
    label: "Business Direction Requests",
    value: "BUSINESS_DIRECTION_REQUESTS",
  },
  {
    label: "Call Clicks",
    value: "CALL_CLICKS",
  },
  {
    label: "Website Clicks",
    value: "WEBSITE_CLICKS",
  },
  {
    label: "Business Bookings",
    value: "BUSINESS_BOOKINGS",
  },
  {
    label: "Business Food Orders (deprecated by Google)",
    value: "BUSINESS_FOOD_ORDERS",
  },
  {
    label: "Business Food Menu Clicks",
    value: "BUSINESS_FOOD_MENU_CLICKS",
  },
];

export const SEARCH_KEYWORDS_PAGE_SIZE = 100;
