import tmetric from "../../tmetric.app.mjs";

export default {
  key: "tmetric-list-account-id-options",
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
    tmetric,
  },
  async run({ $ }) {
    const options = await tmetric.propDefinitions.accountId.options.call(this.tmetric);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
