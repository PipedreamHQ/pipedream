const WEBHOOK_ID = "webhookId";
const LINEAR_DELIVERY_HEADER = "linear-delivery";

const ACTION = {
  CREATE: "create",
  UPDATE: "update",
};

const RESOURCE_TYPE = {
  COMMENT: "Comment",
  ISSUE: "Issue",
  ISSUE_LABEL: "IssueLabel",
  PROJECT: "Project",
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

export default {
  WEBHOOK_ID,
  LINEAR_DELIVERY_HEADER,
  ACTION,
  RESOURCE_TYPE,
  RESOURCE_TYPES,
  CLIENT_IPS,
};
