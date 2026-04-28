import app from "../../nationalize.app.mjs";

export default {
  key: "nationalize-get-nationality-from-name",
  name: "Get Nationality From Name",
  description: "Estimate the nationality of a name. [See the documentation](https://nationalize.io/documentation)",
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
    const response = await this.app.getNationalityFromName({
      $,
      params: {
        name: this.name,
        country_id: this.countryId,
      },
    });
    $.export("$summary", `Successfully sent the request. Top result: ${response.country?.[0]?.country_id ?? "no match"}`);
    return response;
  },
};
