import billbee from "../../billbee.app.mjs";

export default {
  key: "billbee-list-customer-id-options",
  name: "List Customer ID Options",
  description: "Retrieves available options for the Customer ID field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    billbee,
  },
  async run({ $ }) {
    const results = [];
    let page = 0;
    while (true) {
      const options = await billbee.propDefinitions.customerId.options
        .call(this.billbee, {
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
