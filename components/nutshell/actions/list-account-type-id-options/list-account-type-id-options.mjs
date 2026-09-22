import nutshell from "../../nutshell.app.mjs";

export default {
  key: "nutshell-list-account-type-id-options",
  name: "List Account Type Id Options",
  description: "Retrieves available options for the Account Type Id field.",
  version: "1.0.0",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    nutshell,
  },
  async run({ $ }) {
    const options = await nutshell.propDefinitions.accountTypeId.options.call(this.nutshell);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
