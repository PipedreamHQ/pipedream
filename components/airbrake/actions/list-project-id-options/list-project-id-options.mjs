import airbrake from "../../airbrake.app.mjs";

export default {
  key: "airbrake-list-project-id-options",
  name: "List Project ID Options",
  description: "Retrieves available options for the Project ID field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    airbrake,
  },
  async run({ $ }) {
    const results = [];
    let page = 0;
    while (true) {
      const options = await airbrake.propDefinitions.projectId.options
        .call(this.airbrake, {
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
