import freshbooks from "../../freshbooks.app.mjs";

export default {
  key: "freshbooks-list-account-id-options",
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
    freshbooks,
  },
  async run({ $ }) {
    const options = await freshbooks.propDefinitions.accountId.options.call(this.freshbooks);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
