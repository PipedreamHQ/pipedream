import accredible from "../../accredible.app.mjs";

export default {
  key: "accredible-list-group-id-options",
  name: "List Group ID Options",
  description: "Retrieves available options for the Group ID field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    accredible,
  },
  async run({ $ }) {
    const results = [];
    let page = 0;
    while (true) {
      const options = await accredible.propDefinitions.groupId.options
        .call(this.accredible, {
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
