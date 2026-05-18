import bol_com from "../../bol_com.app.mjs";

export default {
  key: "bol_com-list-shipment-id-options",
  name: "List Shipment ID Options",
  description: "Retrieves available options for the Shipment ID field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    bol_com,
  },
  async run({ $ }) {
    const results = [];
    let page = 0;
    while (true) {
      const options = await bol_com.propDefinitions.shipmentId.options
        .call(this.bol_com, {
          page,
        });
      if (!options?.length) break;
      results.push(...options);
      page++;
    }
    $.export("$summary", `Successfully retrieved ${results.length} option${results.length === 1
      ? ""
      : "s"}`);
    return results;
  },
};
