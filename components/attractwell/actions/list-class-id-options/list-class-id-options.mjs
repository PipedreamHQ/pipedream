import attractwell from "../../attractwell.app.mjs";

export default {
  key: "attractwell-list-class-id-options",
  name: "List Class ID Options",
  description: "Retrieves available options for the Class ID field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    attractwell,
  },
  async run({ $ }) {
    const results = [];
    let page = 0;
    while (true) {
      const options = await attractwell.propDefinitions.classId.options
        .call(this.attractwell, {
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
