import dub from "../../dub.app.mjs";

export default {
  key: "dub-list-project-slug-options",
  name: "List Project Slug Options",
  description: "Retrieves available options for the Project Slug field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    dub,
  },
  async run({ $ }) {
    const options = await dub.propDefinitions.projectSlug.options.call(this.dub);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
