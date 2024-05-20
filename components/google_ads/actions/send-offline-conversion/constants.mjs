export const CONVERSION_TYPE_OPTIONS = [
  {
    label:
      "Conversions that occur when a user clicks on an ad's call extension.",
    value: "AD_CALL",
  },

  {
    label:
      "Conversions that occur when a user on a mobile device clicks a phone number.",
    value: "CLICK_TO_CALL",
  },

  {
    label:
      "Conversions that occur when a user downloads a mobile app from the Google Play Store.",
    value: "GOOGLE_PLAY_DOWNLOAD",
  },

  {
    label:
      "Conversions that occur when a user makes a purchase in an app through Android billing.",
    value: "GOOGLE_PLAY_IN_APP_PURCHASE",
  },

  {
    label: "Call conversions that are tracked by the advertiser and uploaded.",
    value: "UPLOAD_CALLS",
  },

  {
    label:
      "Conversions that are tracked by the advertiser and uploaded with attributed clicks.",
    value: "UPLOAD_CLICKS",
  },

  {
    label: "Conversions that occur on a webpage.",
    value: "WEBPAGE",
  },

  {
    label:
      "Conversions that occur when a user calls a dynamically-generated phone number from an advertiser's website.",
    value: "WEBSITE_CALL",
  },

  {
    label:
      "Store Sales conversion based on first-party or third-party merchant data uploads. Only customers on the allowlist can use store sales direct upload types.",
    value: "STORE_SALES_DIRECT_UPLOAD",
  },

  {
    label:
      "Store Sales conversion based on first-party or third-party merchant data uploads and/or from in-store purchases using cards from payment networks. Only customers on the allowlist can use store sales types. Read only.",
    value: "STORE_SALES",
  },

  {
    label: "Android app first open conversions tracked through Firebase.",
    value: "FIREBASE_ANDROID_FIRST_OPEN",
  },

  {
    label: "Android app in app purchase conversions tracked through Firebase.",
    value: "FIREBASE_ANDROID_IN_APP_PURCHASE",
  },

  {
    label: "Android app custom conversions tracked through Firebase.",
    value: "FIREBASE_ANDROID_CUSTOM",
  },

  {
    label: "iOS app first open conversions tracked through Firebase.",
    value: "FIREBASE_IOS_FIRST_OPEN",
  },

  {
    label: "iOS app in app purchase conversions tracked through Firebase.",
    value: "FIREBASE_IOS_IN_APP_PURCHASE",
  },

  {
    label: "iOS app custom conversions tracked through Firebase.",
    value: "FIREBASE_IOS_CUSTOM",
  },

  {
    label:
      "Android app first open conversions tracked through Third Party App Analytics.",
    value: "THIRD_PARTY_APP_ANALYTICS_ANDROID_FIRST_OPEN",
  },

  {
    label:
      "Android app in app purchase conversions tracked through Third Party App Analytics.",
    value: "THIRD_PARTY_APP_ANALYTICS_ANDROID_IN_APP_PURCHASE",
  },

  {
    label:
      "Android app custom conversions tracked through Third Party App Analytics.",
    value: "THIRD_PARTY_APP_ANALYTICS_ANDROID_CUSTOM",
  },

  {
    label:
      "iOS app first open conversions tracked through Third Party App Analytics.",
    value: "THIRD_PARTY_APP_ANALYTICS_IOS_FIRST_OPEN",
  },

  {
    label:
      "iOS app in app purchase conversions tracked through Third Party App Analytics.",
    value: "THIRD_PARTY_APP_ANALYTICS_IOS_IN_APP_PURCHASE",
  },

  {
    label:
      "iOS app custom conversions tracked through Third Party App Analytics.",
    value: "THIRD_PARTY_APP_ANALYTICS_IOS_CUSTOM",
  },

  {
    label:
      "Conversions that occur when a user pre-registers a mobile app from the Google Play Store. Read only.",
    value: "ANDROID_APP_PRE_REGISTRATION",
  },

  {
    label:
      "Conversions that track all Google Play downloads which aren't tracked by an app-specific type. Read only.",
    value: "ANDROID_INSTALLS_ALL_OTHER_APPS",
  },

  {
    label:
      "Floodlight activity that counts the number of times that users have visited a particular webpage after seeing or clicking on one of an advertiser's ads. Read only.",
    value: "FLOODLIGHT_ACTION",
  },

  {
    label:
      "Floodlight activity that tracks the number of sales made or the number of items purchased. Can also capture the total value of each sale. Read only.",
    value: "FLOODLIGHT_TRANSACTION",
  },

  {
    label:
      "Conversions that track local actions from Google's products and services after interacting with an ad. Read only.",
    value: "GOOGLE_HOSTED",
  },

  {
    label: "Conversions reported when a user submits a lead form. Read only.",
    value: "LEAD_FORM_SUBMIT",
  },

  {
    label: "Conversions that come from Salesforce. Read only.",
    value: "SALESFORCE",
  },

  {
    label:
      "Conversions imported from Search Ads 360 Floodlight data. Read only.",
    value: "SEARCH_ADS_360",
  },

  {
    label:
      "Call conversions that occur on Smart campaign Ads without call tracking setup, using Smart campaign custom criteria. Read only.",
    value: "SMART_CAMPAIGN_AD_CLICKS_TO_CALL",
  },

  {
    label:
      "The user clicks on a call element within Google Maps. Smart campaign only. Read only.",
    value: "SMART_CAMPAIGN_MAP_CLICKS_TO_CALL",
  },

  {
    label:
      "The user requests directions to a business location within Google Maps. Smart campaign only. Read only.",
    value: "SMART_CAMPAIGN_MAP_DIRECTIONS",
  },

  {
    label:
      "Call conversions that occur on Smart campaign Ads with call tracking setup, using Smart campaign custom criteria. Read only.",
    value: "SMART_CAMPAIGN_TRACKED_CALLS",
  },

  {
    label:
      "Conversions that occur when a user visits an advertiser's retail store. Read only.",
    value: "STORE_VISITS",
  },

  {
    label:
      "Conversions created from website events (such as form submissions or page loads), that don't use individually coded event snippets. Read only.",
    value: "WEBPAGE_CODELESS",
  },

  {
    label: "Conversions that come from linked Universal Analytics goals.",
    value: "UNIVERSAL_ANALYTICS_GOAL",
  },

  {
    label:
      "Conversions that come from linked Universal Analytics transactions.",
    value: "UNIVERSAL_ANALYTICS_TRANSACTION",
  },

  {
    label:
      "Conversions that come from linked Google Analytics 4 custom event conversions.",
    value: "GOOGLE_ANALYTICS_4_CUSTOM",
  },

  {
    label:
      "Conversions that come from linked Google Analytics 4 purchase conversions.",
    value: "GOOGLE_ANALYTICS_4_PURCHASE",
  },
];
