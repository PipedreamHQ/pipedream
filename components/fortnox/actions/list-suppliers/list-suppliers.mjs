import app from "../../fortnox.app.mjs";

export default {
  key: "fortnox-list-suppliers",
  name: "List Suppliers",
  description: "List all suppliers in Fortnox. [See the documentation](https://api.fortnox.se/apidocs#tag/fortnox_Suppliers/operation/list_40)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    app,
  },
  async run({ $ }) {
    const { Suppliers } = await this.app.listSuppliers({
      $,
    });

    $.export("$summary", `Successfully retrieved ${Suppliers.length} supplier${Suppliers.length === 1
      ? ""
      : "s"}`);
    return Suppliers;
  },
};
