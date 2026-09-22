import mailcheck from "../../mailcheck.app.mjs";

export default {
  key: "mailcheck-list-operation-name-options",
  name: "List Operation Name Options",
  description: "Retrieves available options for the Operation Name field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    mailcheck,
  },
  async run({ $ }) {
    const options = await mailcheck.propDefinitions.operationName.options.call(this.mailcheck);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
