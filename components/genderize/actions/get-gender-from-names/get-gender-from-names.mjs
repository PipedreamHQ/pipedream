import { ConfigurationError } from "@pipedream/platform";
import app from "../../genderize.app.mjs";

export default {
  key: "genderize-get-gender-from-names",
  name: "Get Gender From Names (Batch)",
  description: "Check the statistical probability of up to 10 names being male or female in a single batch request. [See the documentation](https://genderize.io/documentation#batch-usage)",
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
    const response = await this.app.getGenderFromNames({
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
