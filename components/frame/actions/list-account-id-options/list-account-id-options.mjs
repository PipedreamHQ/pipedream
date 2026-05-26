import frame from "../../frame.app.mjs";

export default {
  key: "frame-list-account-id-options",
  name: "List Account ID Options",
  description: "Retrieves available options for the Account ID field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    frame,
  },
  async run({ $ }) {
    const options = await frame.propDefinitions.accountId.options.call(this.frame);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
