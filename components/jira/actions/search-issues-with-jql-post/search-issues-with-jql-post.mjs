import app from "../../jira.app.mjs";

export default {
  key: "jira-search-issues-with-jql-post",
  name: "Search Issues with JQL (POST)",
  description: "Searches for issues using JQL with enhanced search capabilities. [See the documentation](https://developer.atlassian.com/cloud/jira/platform/rest/v3/api-group-issue-search/#api-rest-api-3-search-jql-post)",
  version: "0.0.2",
  type: "action",
  annotations: {
    readOnlyHint: true,
    destructiveHint: false,
    openWorldHint: true,
  },
  props: {
    app,
    cloudId: {
      propDefinition: [
        app,
        "cloudId",
      ],
    },
    jql: {
      type: "string",
      label: "JQL Query",
      description: "The JQL that defines the search. If no JQL expression is provided, all issues are returned. Note: `username` and `userkey` cannot be used as search terms due to privacy reasons. Use `accountId` instead",
    },
    maxResults: {
      type: "integer",
      label: "Max Results",
      description: "The maximum number of items to return per page",
      optional: true,
      default: 50,
      min: 1,
    },
    nextPageToken: {
      type: "string",
      label: "Next Page Token",
      description: "Token for pagination. Use the token from a previous response to get the next page of results",
      optional: true,
    },
    fields: {
      type: "string[]",
      label: "Fields",
      description: "A list of fields to return for each issue. Use it to retrieve a subset of fields. Examples: `summary,comment` or `*all,-comment`",
      optional: true,
    },
    expand: {
      type: "string[]",
      label: "Expand",
      description: "Use expand to include additional information about issues in the response",
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
          label: "Returns all possible operations for the issue",
          value: "operations",
        },
        {
          label: "Returns information about how each field can be edited",
          value: "editmeta",
        },
        {
          label: "Returns a list of recent updates to an issue",
          value: "changelog",
        },
        {
          label: "Returns versioned representations of field values",
          value: "versionedRepresentations",
        },
      ],
    },
    properties: {
      type: "string[]",
      label: "Properties",
      description: "A list of issue property keys for issue properties to include in the results. A maximum of 5 issue property keys can be specified",
      optional: true,
    },
    fieldsByKeys: {
      type: "boolean",
      label: "Fields By Keys",
      description: "Reference fields by their key (rather than ID)",
      optional: true,
      default: false,
    },
    reconcileIssues: {
      type: "string[]",
      label: "Reconcile Issues",
      description: "A list of issue IDs or keys to reconcile for read-after-write consistency. This ensures that recently created or updated issues are included in the search results",
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      app,
      cloudId,
      jql,
      maxResults,
      nextPageToken,
      fields,
      expand,
      properties,
      fieldsByKeys,
      reconcileIssues,
    } = this;

    const response = await app.postSearchIssues({
      $,
      cloudId,
      data: {
        jql,
        maxResults,
        nextPageToken,
        fields,
        expand,
        properties,
        fieldsByKeys,
        reconcileIssues,
      },
    });

    const isLast = response.isLast !== false;
    const resultSummary = `Successfully retrieved ${response.issues?.length || 0} issue(s)${!isLast
      ? " (more pages available)"
      : ""}`;
    $.export("$summary", resultSummary);
    return response;
  },
};
