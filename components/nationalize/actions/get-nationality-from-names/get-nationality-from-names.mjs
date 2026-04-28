import { ConfigurationError } from "@pipedream/platform";
import app from "../../nationalize.app.mjs";

export default {
  key: "nationalize-get-nationality-from-names",
  name: "Get Nationality From Names (Batch)",
  description: "Estimate the nationality of up to 10 names in a single batch request. [See the documentation](https://nationalize.io/documentation#batch-usage)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    app,
    names: {
      propDefinition: [
        app,
        "names",
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
    if (this.names.length > 10) {
      throw new ConfigurationError("Maximum 10 names per batch request");
    }
    const response = await this.app.getNationalityFromNames({
      $,
      params: {
        "name[]": this.names,
        "country_id": this.countryId,
      },
    });
    $.export("$summary", `Successfully sent the request. ${response.length} results returned.`);
    return response;
  },
};
