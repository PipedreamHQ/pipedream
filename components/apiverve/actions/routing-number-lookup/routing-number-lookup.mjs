import apiverve from "../../apiverve.app.mjs";

export default {
  key: "apiverve-routing-number-lookup",
  name: "Routing Number Lookup",
  description: "Lookup routing number information for USA Banks. [See the documentation](https://docs.apiverve.com/api/routinglookup)",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    apiverve,
    routing: {
      type: "string",
      label: "Routing Number",
      description: "The routing number to lookup information about (e.g., 121000358)",
    },
  },
  async run({ $ }) {
    const response = await this.apiverve.routingNumberLookup({
      $,
      params: {
        routing: this.routing,
      },
    });
    if (response?.status === "ok") {
      $.export("$summary", `Successfully retrieved routing number information for ${this.routing}`);
    }
    return response;
  },
};
