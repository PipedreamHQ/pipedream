import acymailing from "../../acymailing.app.mjs";

export default {
  key: "acymailing-list-emails-options",
  name: "List Emails Options",
  description: "Retrieves available options for the Emails field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    acymailing,
  },
  async run({ $ }) {
    const results = [];
    let page = 0;
    while (true) {
      const options = await acymailing.propDefinitions.emails.options
        .call(this.acymailing, {
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
