import wildapricot from "../../wildapricot.app.mjs";

export default {
  key: "wildapricot-list-account-id-options",
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
    wildapricot,
  },
  async run({ $ }) {
    const options = await wildapricot.propDefinitions.accountId.options.call(this.wildapricot);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
