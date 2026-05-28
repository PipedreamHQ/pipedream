import mailerlite from "../../mailerlite.app.mjs";

export default {
  key: "mailerlite-list-fields-options",
  name: "List Fields Options",
  description: "Retrieves available options for the Fields field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    mailerlite,
  },
  async run({ $ }) {
    const options = await mailerlite.propDefinitions.fields.options.call(this.mailerlite);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
