import boldsign from "../../boldsign.app.mjs";

export default {
  key: "boldsign-list-template-id-options",
  name: "List Template ID Options",
  description: "Retrieves available options for the Template ID field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    boldsign,
  },
  async run({ $ }) {
    const results = [];
    let page = 0;
    while (true) {
      const options = await boldsign.propDefinitions.templateId.options
        .call(this.boldsign, {
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
