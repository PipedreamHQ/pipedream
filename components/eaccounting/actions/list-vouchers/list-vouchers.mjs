import app from "../../eaccounting.app.mjs";

export default {
  key: "eaccounting-list-vouchers",
  name: "List Vouchers",
  description: "Retrieves a list of vouchers. [See the documentation](https://developer.vismaonline.com)",
  version: "0.0.1",
  type: "action",
  props: {
    app,
  },
  annotations: {
    readOnlyHint: true,
    destructiveHint: false,
    openWorldHint: true,
  },
  async run({ $ }) {
    const response = await this.app.listVouchers({
      $,
    });
    $.export("$summary", `Successfully retrieved ${response.data?.length || 0} vouchers`);
    return response;
  },
};
