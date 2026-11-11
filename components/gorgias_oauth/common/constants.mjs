const channels = [
  "aircall",
  "api",
  "chat",
  "email",
  "facebook",
  "facebook-mention",
  "facebook-messenger",
  "facebook-recommendations",
  "help-center",
  "instagram-ad-comment",
  "instagram-comment",
  "instagram-mention",
  "instagram-direct-message",
  "internal-note",
  "phone",
  "sms",
  "twitter",
  "twitter-direct-message",
  "whatsapp",
  "yotpo-review",
];

const vias = [
  "help-center",
  "twitter",
  "self_service",
  "api",
  "form",
  "chat",
  "facebook",
  "yotpo-review",
  "twitter-direct-message",
  "rule",
  "twilio",
  "yotpo",
  "gorgias_chat",
  "facebook-messenger",
  "sms",
  "instagram-mention",
  "instagram-ad-comment",
  "facebook-mention",
  "aircall",
  "helpdesk",
  "zendesk",
  "facebook-recommendations",
  "instagram-comment",
  "instagram-direct-message",
  "internal-note",
  "shopify",
  "email",
  "phone",
  "instagram",
];

const sourceTypes = [
  "aircall",
  "api",
  "app",
  "chat",
  "chat-contact-form",
  "chat-offline-capture",
  "contact-form",
  "email",
  "facebook-comment",
  "facebook-message",
  "facebook-messenger",
  "facebook-post",
  "facebook-mention-post",
  "facebook-mention-comment",
  "facebook,facebook-review",
  "facebook-review-comment",
  "form",
  "help-center",
  "helpdesk",
  "instagram-ad-comment",
  "instagram-ad-media",
  "instagram-comment",
  "instagram-mention-comment",
  "instagram-media",
  "instagram-mention-media",
  "instagram",
  "instagram-direct-message",
  "internal-note",
  "ottspott-call",
  "phone",
  "rule",
  "self_service",
  "shopify",
  "sms",
  "system-message",
  "twilio",
  "yotpo-review",
  "yotpo-review-public-comment",
  "yotpo-review-private-comment",
  "twitter-tweet",
  "twitter-quoted-tweet",
  "twitter-mention-tweet",
  "twitter-direct-message",
  "help-center-contact-form",
  "whatsapp-message",
];

const macroIntents = [
  "discount/request",
  "exchange/request",
  "exchange/status",
  "feedback",
  "order/damaged",
  "order/cancel",
  "order/change",
  "order/wrong",
  "other/no_reply",
  "other/question",
  "other/thanks",
  "product/recommendation",
  "product/question",
  "refund/request",
  "refund/status",
  "return/request",
  "return/status",
  "shipping/change",
  "shipping/delivery-issue",
  "shipping/policy",
  "shipping/status",
  "stock/request",
  "subscription/cancel",
  "subscription/change",
];

// `type` filter values accepted by GET /api/integrations
const integrationTypes = [
  "aircall",
  "alloy",
  "app",
  "bigcommerce",
  "ecom",
  "email",
  "facebook",
  "gmail",
  "gorgias_chat",
  "http",
  "klaviyo",
  "magento2",
  "outlook",
  "phone",
  "recharge",
  "shopify",
  "smile",
  "sms",
  "smooch",
  "smooch_inside",
  "twitter",
  "whatsapp",
  "yotpo",
  "zendesk",
];

// Channels that deliver to a per-customer channel address instead of an email
const messagingChannels = [
  "chat",
  "facebook-messenger",
  "instagram-direct-message",
  "sms",
  "twitter-direct-message",
  "whatsapp",
];

// Max `limit` accepted by GET /api/messages
const MESSAGES_LIMIT_MAX = 100;

// `order_by` value for GET /api/messages
const MESSAGES_ORDER_NEWEST_FIRST = "created_datetime:desc";

// Max `limit` accepted by GET /api/integrations
const INTEGRATIONS_LIMIT_MAX = 100;

// `object_type` accepted by the Gorgias custom fields API
const CUSTOM_FIELD_OBJECT_TYPE_TICKET = "Ticket";

// `definition.data_type` values on a Gorgias custom field
const CUSTOM_FIELD_DATA_TYPE_BOOLEAN = "boolean";
const CUSTOM_FIELD_DATA_TYPE_NUMBER = "number";

// `definition.input_settings.input_type` value that carries a fixed list of `choices`
const CUSTOM_FIELD_INPUT_TYPE_DROPDOWN = "dropdown";

// Max `limit` accepted by GET /api/custom-fields
const CUSTOM_FIELDS_LIMIT_MAX = 100;

// Gorgias-managed ticket fields that only Gorgias itself may write
const UNSETTABLE_MANAGED_FIELD_TYPES = [
  "ai_intent",
  "ai_outcome",
  "call_status",
];

export default {
  channels,
  vias,
  sourceTypes,
  macroIntents,
  integrationTypes,
  messagingChannels,
  MESSAGES_LIMIT_MAX,
  MESSAGES_ORDER_NEWEST_FIRST,
  INTEGRATIONS_LIMIT_MAX,
  CUSTOM_FIELD_OBJECT_TYPE_TICKET,
  CUSTOM_FIELD_DATA_TYPE_BOOLEAN,
  CUSTOM_FIELD_DATA_TYPE_NUMBER,
  CUSTOM_FIELD_INPUT_TYPE_DROPDOWN,
  CUSTOM_FIELDS_LIMIT_MAX,
  UNSETTABLE_MANAGED_FIELD_TYPES,
};
