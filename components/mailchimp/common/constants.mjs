export default {
  HTTP_PROTOCOL: "https://",
  BASE_URL: "api.mailchimp.com",
  VERSION_PATH: "/3.0",
  SEGMENT_MATCHES: [
    "any",
    "all",
  ],
  ALLOWED_TAG_KEYS: [
    "name",
    "status",
  ],
  CAMPAIGN_TYPE: [
    "regular",
    "plaintext",
    "absplit",
    "rss",
    "variate",
  ],
  ALLOWED_VARIATE_CONTENTS: [
    "archive",
    "template",
    "content_label",
    "plain_text",
    "html",
    "url",
  ],
  ALLOWED_ACTIONS: [
    "abuse",
    "bounce",
    "click",
    "open",
    "sent",
    "unsub",
    "ecomm",
  ],
  STATUS: [
    "subscribed",
    "unsubscribed",
    "cleaned",
    "pending",
    "transactional",
  ],
  EMAIL_TYPES: [
    "html",
    "text",
  ],
  SOCIAL_TITLES: [
    "active",
    "inactive",
  ],
  SORT_DIRECTIONS: [
    "ASC",
    "DESC",
  ],
  ARCHIVE_TYPES: [
    "zip",
    "tar.gz",
    "tar.bz2",
    "tar",
    "tgz",
    "tbz",
  ],
};
