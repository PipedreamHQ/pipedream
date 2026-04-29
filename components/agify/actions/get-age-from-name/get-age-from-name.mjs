import app from "../../agify.app.mjs";

export default {
  key: "agify-get-age-from-name",
  name: "Get Age From Name",
  description: "Estimate the age of a name. [See the documentation](https://agify.io/documentation)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    app,
    name: {
      propDefinition: [
        app,
        "name",
      ],
    },
    countryId: {
      propDefinition: [
        app,
        "countryId",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.app.getAgeFromName({
      $,
      params: {
        name: this.name,
        country_id: this.countryId,
      },
    });
    $.export("$summary", `Successfully sent the request. Result: ${response.age}`);
    return response;
  },
};
