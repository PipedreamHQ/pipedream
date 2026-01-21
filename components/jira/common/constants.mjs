// Jira schema type to Pipedream type mapping
const TYPE = {
  date: "string",
  string: "string",
  array: "string[]",
  user: "string",
  issuelink: "string",
  issuetype: "string",
  option: "string",
};

const FIELD_KEY = {
  ISSUETYPE: "issuetype",
  PROJECT: "project",
  DESCRIPTION: "description",
  ENVIRONMENT: "environment",
  REPORTER: "reporter",
  ASSIGNEE: "assignee",
  PARENT: "parent",
  LABELS: "labels",
};

const FIELD_TYPE = {
  TEXTAREA: "textarea",
};

const SCHEMA = {
  user: {
    mapping: ({
      displayName: label, accountId: value,
    }) => ({
      label,
      value,
    }),
  },
};

const DEFAULT_LIMIT = 50;

export default {
  TYPE,
  FIELD_KEY,
  FIELD_TYPE,
  SCHEMA,
  DEFAULT_LIMIT,
};
