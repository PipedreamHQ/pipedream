const WEBHOOK_ID = "webhookId";
const LINEAR_DELIVERY_HEADER = "linear-delivery";
const DEFAULT_LIMIT = 100;
const DEFAULT_MAX_RECORDS = 200;
const DEFAULT_NO_QUERY_LIMIT = 20;

const ACTION = {
  CREATE: "create",
  UPDATE: "update",
};

const RESOURCE_TYPE = {
  COMMENT: "Comment",
  ISSUE: "Issue",
  ISSUE_LABEL: "IssueLabel",
  PROJECT: "Project",
  PROJECT_UPDATE: "ProjectUpdate",
  CYCLE: "Cycle",
  REACTION: "Reaction",
};

const RESOURCE_TYPES = Object.values(RESOURCE_TYPE);

// https://developers.linear.app/docs/graphql/webhooks#how-does-a-webhook-work
// To make sure a Webhook POST is truly created by Linear, check the request
// that originates from one of the following IPs:
const CLIENT_IPS = [
  "35.231.147.226",
  "35.243.134.228",
];

const FIELD = {
  CREATED_AT: "createdAt",
  UPDATED_AT: "updatedAt",
};

const ORDER_BY_OPTIONS = [
  {
    label: "Created at",
    value: FIELD.CREATED_AT,
  },
  {
    label: "Updated at",
    value: FIELD.UPDATED_AT,
  },
];

export default {
  WEBHOOK_ID,
  LINEAR_DELIVERY_HEADER,
  DEFAULT_LIMIT,
  DEFAULT_MAX_RECORDS,
  DEFAULT_NO_QUERY_LIMIT,
  ACTION,
  RESOURCE_TYPE,
  RESOURCE_TYPES,
  CLIENT_IPS,
  ORDER_BY_OPTIONS,
  FIELD,
};
