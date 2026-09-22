import app from "../../upsales.app.mjs";

export default {
  key: "upsales-get-activity-list",
  name: "Get Activity List",
  description: "Retrieves a list of activities from Upsales. [See the documentation](https://api.upsales.com/#ae3a30c0-dcc6-4abc-9be4-6ffe725f989f)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    app,
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
    const response = await this.app.listActivities({
      $,
      params: {
        limit: this.limit,
        offset: this.offset,
      },
    });

    $.export("$summary", `Successfully retrieved ${response.data?.length || 0} activit${response.data?.length === 1
      ? "y"
      : "ies"}`);
    return response;
  },
};

