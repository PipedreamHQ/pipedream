import orshot from "../../orshot.app.mjs";

export default {
  key: "orshot-list-workflows",
  name: "List Workflows",
  description: "List the workflows in your Orshot workspace, with the IDs used by **Run Workflow**. The Workflows API is available on the Enterprise plan. [See the documentation](https://orshot.com/docs/api-reference/workflows-list)",
  version: "0.0.1",
  ai: "optimized",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    orshot,
    status: {
      type: "string",
      label: "Status",
      description: "Only return workflows with this status, e.g. `active`",
      options: [
        "draft",
        "active",
        "paused",
        "archived",
      ],
      optional: true,
    },
    limit: {
      propDefinition: [
        orshot,
        "limit",
      ],
      description: "Maximum number of workflows to return, from 1 to 200, e.g. `50`",
      max: 200,
    },
    offset: {
      type: "integer",
      label: "Offset",
      description: "Number of workflows to skip, for paging, e.g. `50`",
      min: 0,
      optional: true,
    },
  },
  async run({ $ }) {
    const params = {};
    if (this.status) {
      params.status = this.status;
    }
    if (this.limit !== undefined) {
      params.limit = this.limit;
    }
    if (this.offset !== undefined) {
      params.offset = this.offset;
    }
    const response = await this.orshot.listWorkflows({
      $,
      params,
    });
    const count = response?.workflows?.length ?? 0;
    $.export("$summary", `Retrieved ${count} workflow${count === 1
      ? ""
      : "s"}`);
    return response;
  },
};
