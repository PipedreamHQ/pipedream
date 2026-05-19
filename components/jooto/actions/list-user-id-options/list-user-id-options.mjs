import jooto from "../../jooto.app.mjs";

export default {
  key: "jooto-list-user-id-options",
  name: "List Assigned Users IDs Options",
  description: "Retrieves available options for the Assigned Users IDs field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    jooto,
  },
  async run({ $ }) {
    const options = await jooto.propDefinitions.userId.options.call(this.jooto);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
