import { ConfigurationError } from "@pipedream/platform";
import lusha from "../../lusha.app.mjs";

export default {
  key: "lusha-get-signal-options",
  name: "Get Signal Options",
  description: "Retrieve available signal options for a specific entity type (contact or company). This endpoint returns the list of signal types you can filter by when enriching contacts or companies. [See the documentation](https://docs.lusha.com/apis/openapi/signal-filters/getsignaloptions)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    lusha,
    objectType: {
      type: "string",
      label: "Object Type",
      description: "The type of object to get signal options for.",
      options: [
        "contact",
        "company",
      ],
    },
  },
  async run({ $ }) {
    try {
      const response = await this.lusha.getSignalOptions({
        $,
        objectType: this.objectType,
      });
      $.export("$summary", `Successfully retrieved signal options for ${this.objectType}`);

      return response;
    } catch ({ response }) {
      throw new ConfigurationError(response?.data?.message);
    }
  },
};
