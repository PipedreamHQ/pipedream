import firmao from "../../firmao.app.mjs";

export default {
  key: "firmao-list-customers-options",
  name: "List Customers Options",
  description: "Retrieves available options for the Customers field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    firmao,
  },
  async run({ $ }) {
    const options = await firmao.propDefinitions.customers.options.call(this.firmao, {});
    $.export("$summary", `Successfully retrieved ${options.length} option${
      options.length === 1
        ? ""
        : "s"
    }`);
    return options;
  },
};
