import jira from "../../jira.app.mjs";

export default {
  name: "Search Issues with JQL",
  description: "Search for issues using JQL (Jira Query Language). [See the documentation](https://developer.atlassian.com/cloud/jira/platform/rest/v3/api-group-issue-search/#api-rest-api-3-search-jql-get)",
  key: "jira-search-issues-with-jql",
  version: "0.0.4",
  type: "action",
  props: {
    jira,
    cloudId: {
      propDefinition: [
        jira,
        "cloudId",
      ],
    },
    jql: {
      type: "string",
      label: "JQL Query",
      description: "The [JQL](https://support.atlassian.com/jira-software-cloud/docs/what-is-advanced-search-in-jira-cloud/) query to search for issues",
    },
    maxResults: {
      type: "integer",
      label: "Max Results",
      description: "Maximum number of issues to return (default: 50, max: 100)",
      optional: true,
      default: 50,
      min: 1,
      max: 100,
    },
    fields: {
      type: "string",
      label: "Fields",
      description: "Comma-separated list of fields to return for each issue",
      default: "*all",
      optional: true,
    },
    expand: {
      type: "string[]",
      label: "Expand",
      description: "Use expand to include additional information about the issues in the response",
      optional: true,
      options: [
        {
          label: "Returns field values rendered in HTML format",
          value: "renderedFields",
        },
        {
          label: "Returns the display name of each field",
          value: "names",
        },
        {
          label: "Returns the schema describing a field type",
          value: "schema",
        },
        {
          label: "Returns all possible transitions for the issue",
          value: "transitions",
        },
        {
          label: "Returns information about how each field can be edited",
          value: "editmeta",
        },
        {
          label: "Returns a list of recent updates to an issue, sorted by date, starting from the most recent",
          value: "changelog",
        },
        {
          label: "Returns a JSON array for each version of a field's value, with the highest number representing the most recent version",
          value: "versionedRepresentations",
        },
      ],
    },
    properties: {
      type: "string",
      label: "Properties",
      description: "A list of up to 5 issue properties to include in the results. This parameter accepts a comma-separated list.",
      optional: true,
    },
    fieldsByKeys: {
      type: "boolean",
      label: "Fields by Keys",
      description: "Reference fields by their key (rather than ID). The default is `false`.",
      optional: true,
    },
    failFast: {
      type: "boolean",
      label: "Fail Fast",
      description: "Fail this request early if we can't retrieve all field data",
      optional: true,
    },
  },
  async run({ $ }) {
    try {
      const response = await this.jira.searchIssues({
        $,
        cloudId: this.cloudId,
        params: {
          jql: this.jql,
          maxResults: this.maxResults,
          fields: this.fields,
          expand: this.expand
            ? this.expand.join(",")
            : undefined,
          properties: this.properties,
          fieldsByKeys: this.fieldsByKeys,
          failFast: this.failFast,
        },
      });
      $.export("$summary", `Successfully retrieved ${response.issues.length} issues`);
      return response;
    } catch (error) {
      throw new Error(`Failed to search issues: ${error.message}`);
    }
  },
};
