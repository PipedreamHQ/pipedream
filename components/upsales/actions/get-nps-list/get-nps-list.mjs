import app from "../../upsales.app.mjs";

export default {
  key: "upsales-get-nps-list",
  name: "Get NPS List",
  description: "Retrieves a list of NPS records from Upsales. [See the documentation](https://api.upsales.com/#def8b39a-95dc-4285-b2eb-992d9923dfdd)",
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
    const response = await this.app.listNps({
      $,
    });

    $.export("$summary", `Successfully retrieved ${response.data?.length || 0} NPS record(s)`);
    return response;
  },
};

