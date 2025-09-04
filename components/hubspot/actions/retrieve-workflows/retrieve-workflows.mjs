import hubspot from "../../hubspot.app.mjs";

export default {
  key: "hubspot-retrieve-workflows",
  name: "Retrieve Workflows",
  description: "Retrieve a list of all workflows. [See the documentation](https://developers.hubspot.com/docs/api-reference/automation-automation-v4-v4/workflows/get-automation-v4-flows)",
  version: "0.0.1",
  type: "action",
  props: {
    hubspot,
    after: {
      type: "string",
      label: "After",
      description: "The paging cursor token of the last successfully read resource will be returned as the `paging.next.after` JSON property of a paged response containing more results.",
      optional: true,
    },
    limit: {
      type: "integer",
      label: "Limit",
      description: "The maximum number of results to display per page.",
      default: 100,
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.hubspot.listWorkflows({
      $,
      params: {
        after: this.after,
        limit: this.limit,
      },
    });

    $.export("$summary", `Successfully retrieved ${response.results.length} workflows`);
    return response;
  },
};
