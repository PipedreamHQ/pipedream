import esendex from "../../esendex.app.mjs";

export default {
  key: "esendex-list-account-reference-options",
  name: "List Account Reference Options",
  description: "Retrieves available options for the Account Reference field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    esendex,
  },
  async run({ $ }) {
    const options = await esendex.propDefinitions.accountReference.options.call(this.esendex);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
