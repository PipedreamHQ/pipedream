import postnl from "../../postnl.app.mjs";

export default {
  key: "postnl-list-customer-code-options",
  name: "List Customer Code Options",
  description: "Retrieves available options for the Customer Code field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    postnl,
  },
  async run({ $ }) {
    const options = await postnl.propDefinitions.customerCode.options.call(this.postnl);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
