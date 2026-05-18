import accelo from "../../accelo.app.mjs";

export default {
  key: "accelo-list-contact-id-options",
  name: "List Contact ID Options",
  description: "Retrieves available options for the Contact ID field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    accelo,
  },
  async run({ $ }) {
    const results = [];
    let page = 0;
    while (true) {
      const options = await accelo.propDefinitions.contactId.options
        .call(this.accelo, {
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
