import leadfeeder from "../../leadfeeder.app.mjs";

export default {
  key: "leadfeeder-list-account-id-options",
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
    leadfeeder,
  },
  async run({ $ }) {
    const options = await leadfeeder.propDefinitions.accountId.options.call(this.leadfeeder);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
