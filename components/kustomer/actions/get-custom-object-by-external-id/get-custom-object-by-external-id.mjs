import { ConfigurationError } from "@pipedream/platform";
import kustomer from "../../kustomer.app.mjs";

export default {
  key: "kustomer-get-custom-object-by-external-id",
  name: "Get Custom Object by External ID",
  description: "Gets a custom object by external ID in Kustomer. [See the documentation](https://developer.kustomer.com/kustomer-api-docs/reference/get-klasses-name-externalid-externalid)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    kustomer,
    klassName: {
      propDefinition: [
        kustomer,
        "klassName",
      ],
    },
    externalId: {
      type: "string",
      label: "External ID",
      description: "The external ID of the custom object to retrieve",
    },
  },
  async run({ $ }) {
    try {
      const response = await this.kustomer.getCustomObjectByExternalId({
        $,
        klassName: this.klassName,
        externalId: this.externalId,
      });

      $.export("$summary", `Successfully retrieved custom object with external ID ${this.externalId}`);
      return response;
    } catch ({ response }) {
      throw new ConfigurationError(response.data.errors[0].title);
    }
  },
};
