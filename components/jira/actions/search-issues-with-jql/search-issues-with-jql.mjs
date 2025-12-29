import jira from "../../jira.app.mjs";

export default {
  name: "Search Issues with JQL",
  description: "Search for issues using JQL (Jira Query Language). [See the documentation](https://developer.atlassian.com/cloud/jira/platform/rest/v3/api-group-issue-search/#api-rest-api-3-search-jql-get)",
  key: "jira-search-issues-with-jql",
  version: "0.1.4",
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
    jql: {
      type: "string",
      label: "JQL Query",
      description: "The JQL query to search for issues. [See the documentation for syntax and examples](https://support.atlassian.com/jira-software-cloud/docs/what-is-advanced-search-in-jira-cloud/)",
    },
    maxResults: {
      type: "integer",
      label: "Max Results",
      description: "Maximum number of issues to return (default: 50)",
      optional: true,
      default: 50,
      min: 1,
      max: 5000,
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
  methods: {
    getMaxResultsPerPage() {
      return Math.min(this.maxResults, 1000);
    },
    async paginate({
      params, maxResults, ...otherArgs
    }) {
      const results = [];
      let nextPageToken;
      let response;

      do {
        response = await this.jira.searchIssues({
          ...otherArgs,
          params: {
            ...params,
            ...(nextPageToken && {
              nextPageToken,
            }),
          },
        });

        const pageResults = response.issues;
        const pageLength = pageResults?.length;
        if (!pageLength) {
          break;
        }

        // If maxResults is specified, only add what we need
        if (maxResults && results.length + pageLength > maxResults) {
          const remainingSlots = maxResults - results.length;
          results.push(...pageResults.slice(0, remainingSlots));
          break;
        } else {
          results.push(...pageResults);
        }

        // Also break if we've reached maxResults exactly
        if (maxResults && results.length >= maxResults) {
          break;
        }

        nextPageToken = response.nextPageToken;
      } while (nextPageToken && !response.isLast);

      return results;
    },
  },
  async run({ $ }) {
    try {
      const issues = await this.paginate({
        $,
        cloudId: this.cloudId,
        params: {
          jql: this.jql,
          maxResults: this.getMaxResultsPerPage(),
          fields: this.fields,
          expand: this.expand
            ? this.expand.join(",")
            : undefined,
          properties: this.properties,
          fieldsByKeys: this.fieldsByKeys,
          failFast: this.failFast,
        },
        maxResults: this.maxResults,
      });
      $.export("$summary", `Successfully retrieved ${issues.length} issues`);
      return {
        issues,
      };
    } catch (error) {
      throw new Error(`Failed to search issues: ${error.message}`);
    }
  },
};
