export default {
  PAGE_SIZE: 1000,
  CAMPAIGN_TYPES: [
    "regular",
    "plaintext",
    "absplit",
    "rss",
    "variate",
  ],
  CAMPAIGN_STATUSES: [
    "created",
    "sent",
  ],
  FILE_TYPES: [
    "image",
    "file",
    "all",
  ],
  SEGMENT_WATCH_TYPES: [
    "Created",
    "Updated",
  ],
  ORDER_HAS_OUTREACH_CHOICES: [
    "Yes",
    "No",
    "Both",
  ],
  EVENT_TYPES: [
    {
      label: "Subscribes",
      value: "subscribe",
    },
    {
      label: "Unsubscribes",
      value: "unsubscribe",
    },
    {
      label: "Profile Updates",
      value: "profile",
    },
    {
      label: "Cleaned Email",
      value: "cleaned",
    },
    {
      label: "Email Address Changes",
      value: "upemail",
    },
    {
      label: "Campaign sending status",
      value: "campaign",
    },
  ],
};
