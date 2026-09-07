import monta from "../../monta.app.mjs";

export default {
  key: "monta-list-inbounds",
  name: "List Inbounds",
  description: "List inbound shipments expected at the warehouse. Use this to review incoming stock, paging forward with the Since ID cursor to walk through large result sets; relate to **List Inbound Forecast Groups** for grouped forecast data. [See the documentation](https://api-v6.monta.nl/index.html#tag/Inbounds/paths/~1inbounds/get)",
  version: "0.0.2",
  type: "action",
  ai: "optimized",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    monta,
    sinceId: {
      type: "integer",
      label: "Since ID",
      description: "Only return inbounds with an ID greater than this value",
      optional: true,
    },
  },
  async run({ $ }) {
    const inbounds = await this.monta.listInbounds({
      $,
      params: {
        sinceid: this.sinceId,
      },
    });

    $.export("$summary", `Successfully retrieved ${inbounds.length} inbound${inbounds.length === 1
      ? ""
      : "s"}`);

    return inbounds;
  },
};
