import okta from "../../okta.app.mjs";

export default {
  key: "okta-list-type-id-options",
  name: "List Type Id Options",
  description: "Retrieves available options for the Type Id field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    okta,
  },
  async run({ $ }) {
    const options = await okta.propDefinitions.typeId.options.call(this.okta);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
