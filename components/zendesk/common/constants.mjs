const SUBDOMAIN_PLACEHOLDER = "{subdomain}";
const BASE_URL = `https://${SUBDOMAIN_PLACEHOLDER}.zendesk.com`;
const VERSION_PATH = "/api/v2";
const WEBHOOK_ID = "webhookId";
const TRIGGER_ID = "triggerId";
const PAGE_SIZE_PARAM = "page[size]";
const PAGE_AFTER_PARAM = "page[after]";
const SORT_BY_POSITION_ASC = "position";
const SORT_BY_UPDATED_AT_DESC = "-updated_at";
const X_ZENDESK_WEBHOOK_SIGNATURE_HEADER = "x-zendesk-webhook-signature";
const X_ZENDESK_WEBHOOK_SIGNATURE_TIMESTAMP_HEADER = "x-zendesk-webhook-signature-timestamp";
const SIGNING_SECRET = "signingSecret";
const SIGNING_SECRET_ALGORITHM = "sha256";
const BASE_64 = "base64";
const DEFAULT_LIMIT = 20;
const DEFAULT_TIMEOUT = 10000;

const TICKET_PRIORITY_OPTIONS = {
  URGENT: "urgent",
  HIGH: "high",
  NORMAL: "normal",
  LOW: "low",
};

const TICKET_STATUS_OPTIONS = {
  NEW: "new",
  OPEN: "open",
  PENDING: "pending",
  HOLD: "hold",
  SOLVED: "solved",
  CLOSED: "closed",
};

const TICKET_FIELD_OPTIONS = [
  {
    label: "Current User Details",
    value: "{{current_user.details}}",
  },
  {
    label: "Current User Email",
    value: "{{current_user.email}}",
  },
  {
    label: "Current User External ID",
    value: "{{current_user.external_id}}",
  },
  {
    label: "Current User First Name",
    value: "{{current_user.first_name}}",
  },
  {
    label: "Current User Language",
    value: "{{current_user.language}}",
  },
  {
    label: "Current User Name",
    value: "{{current_user.name}}",
  },
  {
    label: "Current User Notes",
    value: "{{current_user.notes}}",
  },
  {
    label: "Current User Organization Details",
    value: "{{current_user.organization.details}}",
  },
  {
    label: "Current User Organization Name",
    value: "{{current_user.organization.name}}",
  },
  {
    label: "Current User Organization Notes",
    value: "{{current_user.organization.notes}}",
  },
  {
    label: "Current User Phone",
    value: "{{current_user.phone}}",
  },
  {
    label: "Satisfaction Current Comment",
    value: "{{satisfaction.current_comment",
  },
  {
    label: "Satisfaction Current Rating",
    value: "{{satisfaction.current_rating}}",
  },
  {
    label: "Ticket Account",
    value: "{{ticket.account}}",
  },
  {
    label: "Ticket Assignee Email",
    value: "{{ticket.assignee.email}}",
  },
  {
    label: "Ticket Assignee First Name",
    value: "{{ticket.assignee.first_name}}",
  },
  {
    label: "Ticket Assignee Last Name",
    value: "{{ticket.assignee.last_name}}",
  },
  {
    label: "Ticket Name",
    value: "{{ticket.name}}",
  },
  {
    label: "Ticket Brand Name",
    value: "{{ticket.brand.name}}",
  },
  {
    label: "Ticket CC Names",
    value: "{{ticket.cc_names}}",
  },
  {
    label: "Ticket CSS",
    value: "{{ticket.css}}",
  },
  {
    label: "Ticket Current Holiday Name",
    value: "{{ticket.current_holiday_name}}",
  },
  {
    label: "Ticket Description",
    value: "{{ticket.description}}",
  },
  {
    label: "Ticket Due Date",
    value: "{{ticket.due_date}}",
  },
  {
    label: "Ticket External ID",
    value: "{{ticket.external_id}}",
  },
  {
    label: "Ticket Group Name",
    value: "{{ticket.group.name}}",
  },
  {
    label: "Ticket Latest Comment HTML",
    value: "{{ticket.latest_comment_html}}",
  },
  {
    label: "Ticket Latest Public Comment HTML",
    value: "{{ticket.latest_public_comment_html}}",
  },
  {
    label: "Ticket Organization Details",
    value: "{{ticket.organization.details}}",
  },
  {
    label: "Ticket Organization External ID",
    value: "{{ticket.organization.external_id}}",
  },
  {
    label: "Ticket Organization Name",
    value: "{{ticket.organization.name}}",
  },
  {
    label: "Ticket Organization Notes",
    value: "{{ticket.organization.notes}}",
  },
  {
    label: "Ticket Priority",
    value: "{{ticket.priority}}",
  },
  {
    label: "Ticket Requester Details",
    value: "{{ticket.requester.details}}",
  },
  {
    label: "Ticket Requester Email",
    value: "{{ticket.requester.email}}",
  },
  {
    label: "Ticket Requester External ID",
    value: "{{ticket.requester.external_id}}",
  },
  {
    label: "Ticket Requester First Name",
    value: "{{ticket.requester.first_name}}",
  },
  {
    label: "Ticket Requester Language",
    value: "{{ticket.requester.language}}",
  },
  {
    label: "Ticket Requester Last Name",
    value: "{{ticket.requester.last_name}}",
  },
  {
    label: "Ticket Requester Name",
    value: "{{ticket.requester.name}}",
  },
  {
    label: "Ticket Requester Phone",
    value: "{{ticket.requester.phone}}",
  },
  {
    label: "Ticket Status",
    value: "{{ticket.status}}",
  },
  {
    label: "Ticket Tags",
    value: "{{ticket.tags}}",
  },
  {
    label: "Ticket Title",
    value: "{{ticket.title}}",
  },
  {
    label: "Ticket Type",
    value: "{{ticket.ticket_type}}",
  },
  {
    label: "Ticket URL",
    value: "{{ticket.url}}",
  },
  {
    label: "Ticket Via",
    value: "{{ticket.via}}",
  },
];

const SORT_BY_OPTIONS = [
  "assignee",
  "assignee.name",
  "created_at",
  "group",
  "id",
  "requester",
  "requester.name",
  "status",
  "subject",
  "updated_at",
];

const ACCESS_OPTIONS = [
  "personal",
  "agents",
  "shared",
  "account",
];

const INCLUDE_OPTIONS = [
  {
    label: "The app installation that requires each macro, if present",
    value: "app_installation",
  },
  {
    label: "The macro categories",
    value: "categories",
  },
  {
    label: "The permissions for each macro",
    value: "permissions",
  },
  {
    label: "The number of times each macro has been used in the past hour",
    value: "usage_1h",
  },
  {
    label: "The number of times each macro has been used in the past day",
    value: "usage_24h",
  },
  {
    label: "The number of times each macro has been used in the past week",
    value: "usage_7d",
  },
  {
    label: "The number of times each macro has been used in the past thirty days",
    value: "usage_30d",
  },
];

export default {
  SUBDOMAIN_PLACEHOLDER,
  BASE_URL,
  VERSION_PATH,
  WEBHOOK_ID,
  TRIGGER_ID,
  PAGE_SIZE_PARAM,
  PAGE_AFTER_PARAM,
  SORT_BY_POSITION_ASC,
  SORT_BY_UPDATED_AT_DESC,
  X_ZENDESK_WEBHOOK_SIGNATURE_HEADER,
  X_ZENDESK_WEBHOOK_SIGNATURE_TIMESTAMP_HEADER,
  SIGNING_SECRET,
  SIGNING_SECRET_ALGORITHM,
  BASE_64,
  DEFAULT_LIMIT,
  DEFAULT_TIMEOUT,
  TICKET_PRIORITY_OPTIONS,
  TICKET_STATUS_OPTIONS,
  TICKET_FIELD_OPTIONS,
  SORT_BY_OPTIONS,
  ACCESS_OPTIONS,
  INCLUDE_OPTIONS,
};
