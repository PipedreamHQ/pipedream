import smartroutes from "../../smartroutes.app.mjs";

export default {
  key: "smartroutes-list-customer-account-options",
  name: "List Customer Account Number Options",
  description: "Retrieves available options for the Customer Account Number field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    smartroutes,
  },
  async run({ $ }) {
    const options = await smartroutes.propDefinitions.customerAccount.options
      .call(this.smartroutes);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
