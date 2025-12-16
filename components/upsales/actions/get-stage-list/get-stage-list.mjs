import app from "../../upsales.app.mjs";

export default {
  key: "upsales-get-stage-list",
  name: "Get Stage List",
  description: "Retrieves a list of order stages from Upsales. [See the documentation](https://api.upsales.com/#3e8b5e8d-3f4a-4e8e-8b5e-8d3f4a4e8e8b)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    app,
  },
  async run({ $ }) {
    const response = await this.app.listStages({
      $,
    });

    $.export("$summary", `Successfully retrieved ${response.length || 0} stage(s)`);
    return response;
  },
};

