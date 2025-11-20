import jira from "../../jira.app.mjs";

export default {
  key: "jira-get-issue",
  name: "Get Issue",
  description: "Gets the details for an issue. [See the documentation](https://developer.atlassian.com/cloud/jira/platform/rest/v3/api-group-issues/#api-rest-api-3-issue-issueidorkey-get)",
  version: "0.1.17",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    jira,
    cloudId: {
      propDefinition: [
        jira,
        "cloudId",
      ],
    },
    issueIdOrKey: {
      propDefinition: [
        jira,
        "issueIdOrKey",
        (c) => ({
          cloudId: c.cloudId,
        }),
      ],
    },
    fields: {
      type: "string",
      label: "Fields",
      description: "A list of fields to return for the issue. This parameter accepts a comma-separated list. Use it to retrieve a subset of fields.  All fields are returned by default. Allowed values:\n`*all` Returns all fields.\n`*navigable` Returns navigable fields.\nAny issue field, prefixed with a minus to exclude, as in `-description `.",
      optional: true,
    },
    fieldsByKeys: {
      type: "boolean",
      label: "Fields By Keys",
      description: "Whether `fields` in fields are referenced by keys rather than IDs. This parameter is useful where fields have been added by a connect app and a field's key may differ from its ID.",
      optional: true,
    },
    properties: {
      propDefinition: [
        jira,
        "properties",
      ],
      description: "A list of issue properties to return for the issue. This parameter accepts a comma-separated list. Allowed values:\n`*all` Returns all issue properties.\nAny issue property key, prefixed with a minus to exclude.",
    },
    updateHistory: {
      type: "boolean",
      label: "Update History",
      description: "Whether the project in which the issue is created is added to the user's Recently viewed project list, as shown under Projects in Jira",
      optional: true,
    },
    expand: {
      propDefinition: [
        jira,
        "expand",
      ],
      description: "Use expand to include additional information about the issues in the response. This parameter accepts a comma-separated list. Expand options include:\n`renderedFields` Returns field values rendered in HTML format.\n`names` Returns the display name of each field.\n`schema` Returns the schema describing a field type.\n`transitions` Returns all possible transitions for the issue.\n`editmeta` Returns information about how each field can be edited.\n`changelog` Returns a list of recent updates to an issue, sorted by date, starting from the most recent.\n`versionedRepresentations` Returns a JSON array for each version of a field's value, with the highest number representing the most recent version. Note: When included in the request, the fields parameter is ignored.",
    },
  },
  async run({ $ }) {
    let properties;
    try {
      properties = JSON.parse(this.properties);
    } catch (err) {
      //pass
    }
    const response = await this.jira.getIssue({
      $,
      cloudId: this.cloudId,
      issueIdOrKey: this.issueIdOrKey,
      params: {
        fields: this.fields,
        fieldsByKeys: this.fieldsByKeys,
        properties,
        updateHistory: this.updateHistory,
        expand: this.expand,
      },
    });
    $.export("$summary", `Successfully retrieved issue with ID(or key): ${this.issueIdOrKey}`);
    return response;
  },
};
