import woovi from "../../woovi.app.mjs";

export default {
  key: "woovi-list-customer-options",
  name: "List Customer Options",
  description: "Retrieves available options for the Customer field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    woovi,
  },
  async run({ $ }) {
    const options = await woovi.propDefinitions.customer.options.call(this.woovi);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
