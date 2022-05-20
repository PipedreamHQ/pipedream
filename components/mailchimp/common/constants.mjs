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
};
