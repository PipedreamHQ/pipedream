import donedone from "../../donedone.app.mjs";

export default {
  key: "donedone-list-account-id-options",
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
    donedone,
  },
  async run({ $ }) {
    const options = await donedone.propDefinitions.accountId.options.call(this.donedone);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
