import yutori from "../../yutori.app.mjs";

export default {
  key: "yutori-list-scouts",
  name: "List Scouts",
  description: "Retrieve a list of your Yutori Scouts (recurring web monitors). Returns scout IDs, names, status, and configuration. Useful for finding a scout ID to use in other actions. [See the documentation](https://docs.yutori.com/reference/scouting-list)",
  version: "0.0.1",
  type: "action",
  annotations: {
    openWorldHint: false,
    destructiveHint: false,
    readOnlyHint: true,
  },
  props: {
    yutori,
    pageSize: {
      type: "integer",
      label: "Limit",
      description: "Maximum number of scouts to return (1–100)",
      optional: true,
      default: 50,
      min: 1,
      max: 100,
    },
  },
  async run({ $ }) {
    const params = {};
    if (this.pageSize) params.page_size = this.pageSize;

    const result = await this.yutori.listScouts($, params);
    const scouts = result?.scouts ?? result ?? [];
    const count = Array.isArray(scouts) ? scouts.length : "?";

    $.export("$summary", `Retrieved ${count} scout${count === 1 ? "" : "s"}`);
    return result;
  },
};
