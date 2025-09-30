import { ConfigurationError } from "@pipedream/platform";
import kustomer from "../../kustomer.app.mjs";

export default {
  key: "kustomer-get-custom-objects",
  name: "Get Custom Objects",
  description: "Gets custom objects in Kustomer. [See the documentation](https://developer.kustomer.com/kustomer-api-docs/reference/getkobjects)",
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
    fromDate: {
      type: "string",
      label: "From Date",
      description: "Date-time string in Internet Date/Time format (ISO 8601) E.g. `2025-07-25T00:00:00Z`",
      optional: true,
    },
  },
  async run({ $ }) {
    try {
      const response = await this.kustomer.listCustomObjects({
        $,
        klassName: this.klassName,
        params: {
          fromDate: this.fromDate,
        },
      });

      $.export("$summary", `Successfully retrieved ${response.data.length} custom objects`);
      return response;
    } catch ({ response }) {
      throw new ConfigurationError(response.data.errors[0].title);
    }
  },
};
