export const SHARED_SET_TYPES = [
  {
    label: "Negative Keywords",
    value: "NEGATIVE_KEYWORDS",
  },
  {
    label: "Negative Placements",
    value: "NEGATIVE_PLACEMENTS",
  },
];

export const CREATE_REMOVE_OPERATION_TYPES = [
  {
    label: "Create",
    value: "create",
  },
  {
    label: "Remove",
    value: "remove",
  },
];

export const CAMPAIGN_OPERATION_TYPES = [
  {
    label: "Create",
    value: "create",
  },
  {
    label: "Update",
    value: "update",
  },
  {
    label: "Remove",
    value: "remove",
  },
];

export const CAMPAIGN_STATUSES = [
  "ENABLED",
  "PAUSED",
  "REMOVED",
];

export const ADVERTISING_CHANNEL_TYPES = [
  {
    label: "Search",
    value: "SEARCH",
  },
  {
    label: "Display",
    value: "DISPLAY",
  },
  {
    label: "Shopping",
    value: "SHOPPING",
  },
  {
    label: "Hotel",
    value: "HOTEL",
  },
  {
    label: "Video",
    value: "VIDEO",
  },
  {
    label: "Multi-Channel (App)",
    value: "MULTI_CHANNEL",
  },
  {
    label: "Local",
    value: "LOCAL",
  },
  {
    label: "Smart",
    value: "SMART",
  },
  {
    label: "Performance Max",
    value: "PERFORMANCE_MAX",
  },
  {
    label: "Local Services",
    value: "LOCAL_SERVICES",
  },
  {
    label: "Discovery",
    value: "DISCOVERY",
  },
  {
    label: "Travel",
    value: "TRAVEL",
  },
  {
    label: "Demand Gen",
    value: "DEMAND_GEN",
  },
];

export const KEYWORD_MATCH_TYPES = [
  {
    label: "Exact",
    value: "EXACT",
  },
  {
    label: "Phrase",
    value: "PHRASE",
  },
  {
    label: "Broad",
    value: "BROAD",
  },
];

export const AD_GROUP_STATUSES = [
  "ENABLED",
  "PAUSED",
  "REMOVED",
];

export const AD_GROUP_TYPES = [
  {
    label: "Search Standard",
    value: "SEARCH_STANDARD",
  },
  {
    label: "Display Standard",
    value: "DISPLAY_STANDARD",
  },
  {
    label: "Shopping Product Ads",
    value: "SHOPPING_PRODUCT_ADS",
  },
  {
    label: "Hotel Ads",
    value: "HOTEL_ADS",
  },
  {
    label: "Shopping Smart Ads",
    value: "SHOPPING_SMART_ADS",
  },
  {
    label: "Video Bumper",
    value: "VIDEO_BUMPER",
  },
  {
    label: "Video TrueView In-Stream",
    value: "VIDEO_TRUE_VIEW_IN_STREAM",
  },
  {
    label: "Video TrueView In-Display",
    value: "VIDEO_TRUE_VIEW_IN_DISPLAY",
  },
  {
    label: "Video Non-Skippable In-Stream",
    value: "VIDEO_NON_SKIPPABLE_IN_STREAM",
  },
  {
    label: "Video Outstream",
    value: "VIDEO_OUTSTREAM",
  },
  {
    label: "Search Dynamic Ads",
    value: "SEARCH_DYNAMIC_ADS",
  },
  {
    label: "Shopping Comparison Listing Ads",
    value: "SHOPPING_COMPARISON_LISTING_ADS",
  },
  {
    label: "Promoted Hotel Ads",
    value: "PROMOTED_HOTEL_ADS",
  },
  {
    label: "Video Responsive",
    value: "VIDEO_RESPONSIVE",
  },
  {
    label: "Video Efficient Reach",
    value: "VIDEO_EFFICIENT_REACH",
  },
  {
    label: "Smart Campaign Ads",
    value: "SMART_CAMPAIGN_ADS",
  },
  {
    label: "Travel Ads",
    value: "TRAVEL_ADS",
  },
];

export const AD_ROTATION_MODES = [
  {
    label: "Optimize",
    value: "OPTIMIZE",
  },
  {
    label: "Rotate Forever",
    value: "ROTATE_FOREVER",
  },
];

export const BUDGET_DELIVERY_METHODS = [
  {
    label: "Standard",
    value: "STANDARD",
  },
  {
    label: "Accelerated",
    value: "ACCELERATED",
  },
];

export const BUDGET_PERIODS = [
  {
    label: "Daily",
    value: "DAILY",
  },
  {
    label: "Custom Period",
    value: "CUSTOM_PERIOD",
  },
];

export const ASSET_AUTOMATION_STATUSES = [
  {
    label: "Opted In",
    value: "OPTED_IN",
  },
  {
    label: "Opted Out",
    value: "OPTED_OUT",
  },
];

export const PORTFOLIO_BIDDING_STRATEGY_TYPES = [
  {
    label: "Target CPA",
    value: "TARGET_CPA",
  },
  {
    label: "Target ROAS",
    value: "TARGET_ROAS",
  },
  {
    label: "Target Spend",
    value: "TARGET_SPEND",
  },
  {
    label: "Maximize Conversions",
    value: "MAXIMIZE_CONVERSIONS",
  },
  {
    label: "Maximize Conversion Value",
    value: "MAXIMIZE_CONVERSION_VALUE",
  },
  {
    label: "Target Impression Share",
    value: "TARGET_IMPRESSION_SHARE",
  },
  {
    label: "Enhanced CPC",
    value: "ENHANCED_CPC",
  },
  {
    label: "Percent CPC",
    value: "PERCENT_CPC",
  },
];

export const CORE_DATE_SEGMENTS = [
  "segments.date",
  "segments.week",
  "segments.month",
  "segments.quarter",
  "segments.year",
];

export const DATE_RANGE_OPTIONS = [
  {
    value: "CUSTOM",
    label: "Specify a custom date range",
  },
  {
    value: "TODAY",
    label: "Today only",
  },
  {
    value: "YESTERDAY",
    label: "Yesterday only",
  },
  {
    value: "LAST_7_DAYS",
    label: "The last 7 days not including today",
  },
  {
    value: "LAST_BUSINESS_WEEK",
    label:
      "The 5 day business week, Monday through Friday, of the previous business week",
  },
  {
    value: "THIS_MONTH",
    label: "All days in the current month",
  },
  {
    value: "LAST_MONTH",
    label: "All days in the previous month",
  },
  {
    value: "LAST_14_DAYS",
    label: "The last 14 days not including today",
  },
  {
    value: "LAST_30_DAYS",
    label: "The last 30 days not including today",
  },
  {
    value: "THIS_WEEK_SUN_TODAY",
    label: "The period between the previous Sunday and the current day",
  },
  {
    value: "THIS_WEEK_MON_TODAY",
    label: "The period between the previous Monday and the current day",
  },
  {
    value: "LAST_WEEK_SUN_SAT",
    label: "The 7-day period starting with the previous Sunday",
  },
  {
    value: "LAST_WEEK_MON_SUN",
    label: "The 7-day period starting with the previous Monday",
  },
];
