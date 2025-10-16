import { ConfigurationError } from "@pipedream/platform";
import kustomer from "../../kustomer.app.mjs";

export default {
  key: "kustomer-get-custom-object-by-id",
  name: "Get Custom Object by ID",
  description: "Gets a custom object by ID in Kustomer. [See the documentation](https://developer.kustomer.com/kustomer-api-docs/reference/getkobject)",
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
    customObjectId: {
      propDefinition: [
        kustomer,
        "customObjectId",
        ({ klassName }) => ({
          klassName,
        }),
      ],
    },
  },
  async run({ $ }) {
    try {
      const response = await this.kustomer.getCustomObjectById({
        $,
        klassName: this.klassName,
        customObjectId: this.customObjectId,
      });

      $.export("$summary", `Successfully retrieved custom object with ID ${this.customObjectId}`);
      return response;
    } catch ({ response }) {
      throw new ConfigurationError(response.data.errors[0].title);
    }
  },
};
