import app from "../../upsales.app.mjs";

export default {
  key: "upsales-get-nps",
  name: "Get NPS",
  description: "Retrieves a single NPS record by ID from Upsales. [See the documentation](https://api.upsales.com/#176e076b-ec7b-424d-afe2-32b2a652afc5)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    app,
    npsId: {
      propDefinition: [
        app,
        "npsId",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.app.getNps({
      $,
      npsId: this.npsId,
    });

    $.export("$summary", `Successfully retrieved NPS record: ${response.data?.id || this.npsId}`);
    return response;
  },
};

