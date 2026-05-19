import nutshell from "../../nutshell.app.mjs";

export default {
  key: "nutshell-list-account-type-id-options",
  name: "List Account Type Id Options",
  description: "Retrieves available options for the Account Type Id field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    nutshell,
    page: {
      type: "integer",
      label: "Page",
      description: "The page of results to retrieve.",
      min: 0,
      default: 0,
    },
  },
  async run({ $ }) {
    const options = await nutshell.propDefinitions.accountTypeId.options.call(this.nutshell, {
      page: this.page,
    });
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
