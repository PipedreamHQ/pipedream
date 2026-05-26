import mailgenius from "../../mailgenius.app.mjs";

export default {
  key: "mailgenius-list-slug-options",
  name: "List Model Options",
  description: "Retrieves available options for the Model field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    mailgenius,
  },
  async run({ $ }) {
    const options = await mailgenius.propDefinitions.slug.options.call(this.mailgenius);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
