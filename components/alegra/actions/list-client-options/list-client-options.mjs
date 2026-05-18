import alegra from "../../alegra.app.mjs";

export default {
  key: "alegra-list-client-options",
  name: "List Client Options",
  description: "Retrieves available options for the Client field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    alegra,
  },
  async run({ $ }) {
    const results = [];
    let page = 0;
    while (true) {
      const options = await alegra.propDefinitions.client.options
        .call(this.alegra, {
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
