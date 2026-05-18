import attractwell from "../../attractwell.app.mjs";

export default {
  key: "attractwell-list-lesson-id-options",
  name: "List Lesson ID Options",
  description: "Retrieves available options for the Lesson ID field.",
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
      const options = await attractwell.propDefinitions.lessonId.options
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
