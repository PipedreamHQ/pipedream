import agiliron from "../../agiliron.app.mjs";

export default {
  key: "agiliron-list-contact-name-options",
  name: "List Contact Name Options",
  description: "Retrieves available options for the Contact Name field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    agiliron,
  },
  async run({ $ }) {
    const results = [];
    let page = 0;
    while (true) {
      const options = await agiliron.propDefinitions.contactName.options
        .call(this.agiliron, {
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
