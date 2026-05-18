import acelle_mail from "../../acelle_mail.app.mjs";

export default {
  key: "acelle_mail-list-customer-id-options",
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
    acelle_mail,
  },
  async run({ $ }) {
    const results = [];
    let page = 0;
    while (true) {
      const options = await acelle_mail.propDefinitions.customerId.options
        .call(this.acelle_mail, {
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
