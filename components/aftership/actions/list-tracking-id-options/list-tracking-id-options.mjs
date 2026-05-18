import aftership from "../../aftership.app.mjs";

export default {
  key: "aftership-list-tracking-id-options",
  name: "List Tracking ID Options",
  description: "Retrieves available options for the Tracking ID field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    aftership,
  },
  async run({ $ }) {
    const results = [];
    let page = 0;
    while (true) {
      const options = await aftership.propDefinitions.trackingId.options
        .call(this.aftership, {
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
