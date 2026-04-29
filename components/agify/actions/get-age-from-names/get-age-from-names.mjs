import { ConfigurationError } from "@pipedream/platform";
import app from "../../agify.app.mjs";

export default {
  key: "agify-get-age-from-names",
  name: "Get Age From Names (Batch)",
  description: "Estimate the age of up to 10 names in a single batch request. [See the documentation](https://agify.io/documentation#batch-usage)",
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
    const response = await this.app.getAgeFromNames({
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
