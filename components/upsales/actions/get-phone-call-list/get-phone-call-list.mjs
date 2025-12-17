import app from "../../upsales.app.mjs";

export default {
  key: "upsales-get-phone-call-list",
  name: "Get Phone Call List",
  description: "Retrieves a list of phone calls from Upsales. [See the documentation](https://api.upsales.com/#61bbc6c1-04b9-4776-8073-aff47b69d302)",
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
    const response = await this.app.listPhoneCalls({
      $,
    });

    $.export("$summary", `Successfully retrieved ${response.data?.length || 0} phone call(s)`);
    return response;
  },
};

