import morningmate from "../../morningmate.app.mjs";

export default {
  key: "morningmate-list-user-id-options",
  name: "List User ID Options",
  description: "Retrieves available options for the User ID field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    morningmate,
  },
  async run({ $ }) {
    const options = await morningmate.propDefinitions.userId.options.call(this.morningmate);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
