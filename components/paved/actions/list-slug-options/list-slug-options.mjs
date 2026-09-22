import paved from "../../paved.app.mjs";

export default {
  key: "paved-list-slug-options",
  name: "List Newsletter Slug Options",
  description: "Retrieves available options for the Newsletter Slug field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    paved,
  },
  async run({ $ }) {
    const options = await paved.propDefinitions.slug.options.call(this.paved);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
