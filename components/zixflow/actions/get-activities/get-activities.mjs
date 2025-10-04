import app from "../../zixflow.app.mjs";

export default {
  key: "zixflow-get-activities",
  name: "Get Activities",
  description: "Retrieve a list of activities. [See the documentation](https://docs.zixflow.com/api-reference/activity-list/get#body)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    app,
    filter: {
      propDefinition: [
        app,
        "filter",
      ],
    },
    sort: {
      propDefinition: [
        app,
        "sort",
      ],
    },
    limit: {
      propDefinition: [
        app,
        "limit",
      ],
    },
    offset: {
      propDefinition: [
        app,
        "offset",
      ],
    },
  },
  async run({ $ }) {
    const filter = typeof this.filter === "string"
      ? JSON.parse(this.filter)
      : this.filter;

    const sort = typeof this.sort === "string"
      ? JSON.parse(this.sort)
      : this.sort;

    const response = await this.app.getActivities({
      $,
      data: {
        sort,
        filter,
        limit: this.limit,
        offset: this.offset,
      },
    });
    $.export("$summary", `Successfully retrieved ${response.data.length} activities`);

    return response;
  },
};
