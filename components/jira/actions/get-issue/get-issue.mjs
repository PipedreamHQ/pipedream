import base from "../common/base.mjs";

const { jira } = base.props;

export default {
  ...base,
  key: "jira-get-issue",
  name: "Get Issue",
  description: "Gets the details for an issue. [See docs here](https://developer.atlassian.com/cloud/jira/platform/rest/v3/api-group-issues/#api-rest-api-3-issue-issueidorkey-get)",
  version: "0.2.0",
  type: "action",
  props: {
    ...base.props,
    issueId: {
      propDefinition: [
        jira,
        "issueId",
        (c) => ({
          cloudId: c.cloudId,
        }),
      ],
    },
    fields: {
      label: "Fields",
      description: "A list of fields to return for the issue. This parameter accepts a comma-separated list. Use it to retrieve a subset of fields.  All fields are returned by default. Allowed values:\n\n`*all` Returns all fields.\n`*navigable` Returns navigable fields.\nAny issue field, prefixed with a minus to exclude, as in `-description `.",
      type: "string",
      optional: true,
    },
    fieldsByKeys: {
      label: "Fields By Keys",
      description: "Whether `fields` in fields are referenced by keys rather than IDs. This parameter is useful where fields have been added by a connect app and a field's key may differ from its ID.",
      type: "boolean",
      optional: true,
    },
    expand: {
      propDefinition: [
        jira,
        "expand",
      ],
    },
    properties: {
      label: "Properties",
      description: "A list of issue properties to return for the issue.",
      type: "string",
      optional: true,
    },
    updateHistory: {
      label: "Update History",
      description: "Whether the project in which the issue is created is added to the user's *Recently viewed* project list, as shown under *Projects* in Jira.",
      type: "string",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.jira.getIssue({
      $,
      cloudId: this.cloudId,
      issueId: this.issueId,
      params: {
        fields: this.fields,
        fieldsByKeys: this.fieldsByKeys,
        expand: this.expand,
        properties: this.properties,
        updateHistory: this.updateHistory,
      },
    });

    $.export("$summary", "Successfully retrieved issue");

    return response;
  },
};
