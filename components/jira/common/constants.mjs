// Jira schema type to Pipedream type mapping
const TYPE = {
  date: "string",
  string: "string",
  array: "string[]",
  user: "string",
  issuelink: "string",
  issuetype: "string",
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

export default {
  TYPE,
  FIELD_KEY,
  FIELD_TYPE,
  SCHEMA,
};
