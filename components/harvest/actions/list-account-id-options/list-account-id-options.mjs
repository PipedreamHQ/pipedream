import harvest from "../../harvest.app.mjs";

export default {
  key: "harvest-list-account-id-options",
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
    harvest,
  },
  async run({ $ }) {
    const options = await harvest.propDefinitions.accountId.options.call(this.harvest);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
