import aircall from "../../aircall.app.mjs";

export default {
  key: "aircall-list-call-options",
  name: "List Call Options",
  description: "Retrieves available options for the Call field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    aircall,
  },
  async run({ $ }) {
    const results = [];
    let page = 0;
    while (true) {
      const options = await aircall.propDefinitions.call.options
        .call(this.aircall, {
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
