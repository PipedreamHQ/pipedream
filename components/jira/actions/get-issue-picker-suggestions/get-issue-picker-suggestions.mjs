import app from "../../jira.app.mjs";

export default {
  key: "jira-get-issue-picker-suggestions",
  name: "Get Issue Picker Suggestions",
  description: "Returns lists of issues matching a query string. [See the documentation](https://developer.atlassian.com/cloud/jira/platform/rest/v3/api-group-issue-search/#api-rest-api-3-issue-picker-get)",
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
    query: {
      type: "string",
      label: "Query",
      description: "A string to match against text fields in the issue such as title, description, or comments",
      optional: true,
    },
    currentJQL: {
      type: "string",
      label: "Current JQL",
      description: "A JQL query defining a list of issues to search for the query term. Note that `username` and `userkey` cannot be used as search terms for this parameter, due to privacy reasons. Use `accountId` instead",
      optional: true,
    },
    currentIssueKey: {
      type: "string",
      label: "Current Issue Key",
      description: "The key of an issue to exclude from search results. For example, the issue the user is viewing when they perform this query",
      optional: true,
    },
    currentProjectId: {
      label: "Current Project ID",
      description: "The ID of a project that suggested issues must belong to",
      propDefinition: [
        app,
        "projectID",
        ({ cloudId }) => ({
          cloudId,
        }),
      ],
    },
    showSubTasks: {
      type: "boolean",
      label: "Show Sub Tasks",
      description: "Indicate whether to include subtasks in the suggestions list",
      optional: true,
    },
    showSubTaskParent: {
      type: "boolean",
      label: "Show Sub Task Parent",
      description: "When `currentIssueKey` is a subtask, whether to include the parent issue in the suggestions if it matches the query",
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      app,
      cloudId,
      query,
      currentJQL,
      currentIssueKey,
      currentProjectId,
      showSubTasks,
      showSubTaskParent,
    } = this;

    const response = await app.getIssuePickerSuggestions({
      $,
      cloudId,
      params: {
        query,
        currentJQL,
        currentIssueKey,
        currentProjectId,
        showSubTasks,
        showSubTaskParent,
      },
    });

    $.export("$summary", `Successfully retrieved issue picker suggestions for query: "${query || "all"}"`);
    return response;
  },
};
