import illumidesk from "../../illumidesk.app.mjs";

export default {
  key: "illumidesk-list-campus-slug-options",
  name: "List Campus Slug Options",
  description: "Retrieves available options for the Campus Slug field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    illumidesk,
  },
  async run({ $ }) {
    const options = await illumidesk.propDefinitions.campusSlug.options.call(this.illumidesk);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
