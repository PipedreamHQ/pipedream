import amilia from "../../amilia.app.mjs";

export default {
  key: "amilia-list-account-options",
  name: "List Account Options",
  description: "Retrieves available options for the Account field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    amilia,
  },
  async run({ $ }) {
    const results = [];
    let page = 0;
    while (true) {
      const options = await amilia.propDefinitions.account.options
        .call(this.amilia, {
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
