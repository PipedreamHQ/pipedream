import bamboohr from "../../bamboohr.app.mjs";

export default {
  key: "bamboohr-list-application-id-options",
  name: "List Application ID Options",
  description: "Retrieves available options for the Application ID field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    bamboohr,
  },
  async run({ $ }) {
    const results = [];
    let page = 0;
    while (true) {
      const options = await bamboohr.propDefinitions.applicationId.options
        .call(this.bamboohr, {
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
