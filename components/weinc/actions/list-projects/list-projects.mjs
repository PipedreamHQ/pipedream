import weinc from "../../weinc.app.mjs";

export default {
  key: "weinc-list-projects",
  name: "List Projects",
  description: "Retrieves a list of projects. [See the documentation](https://my.we.inc/api/v1/docs)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    weinc,
    status: {
      type: "string",
      label: "Status",
      description: "Filter projects by status",
      optional: true,
    },
    limit: {
      type: "integer",
      label: "Limit",
      description: "Number of records to return (max 100)",
      optional: true,
      default: 50,
      max: 100,
    },
    offset: {
      type: "integer",
      label: "Offset",
      description: "Number of records to skip",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.weinc.listProjects({
      $,
      params: {
        status: this.status,
        limit: this.limit,
        offset: this.offset,
      },
    });
    $.export("$summary", `Successfully retrieved ${response.projects?.length ?? 0} project(s)`);
    return response;
  },
};
