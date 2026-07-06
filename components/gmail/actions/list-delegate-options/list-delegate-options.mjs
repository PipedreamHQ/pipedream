import gmail from "../../gmail.app.mjs";

export default {
  key: "gmail-list-delegate-options",
  name: "List Send as a Delegate Options",
  description: "Retrieves available options for the Send as a Delegate field.",
  version: "0.0.3",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    gmail,
  },
  async run({ $ }) {
    const options = await gmail.propDefinitions.delegate.options.call(this.gmail);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
