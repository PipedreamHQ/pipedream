import app from "../../eaccounting.app.mjs";

export default {
  key: "eaccounting-list-suppliers",
  name: "List Suppliers",
  description: "Retrieves a list of suppliers. [See the documentation](https://developer.vismaonline.com)",
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
    const response = await this.app.listSuppliers({
      $,
    });
    $.export("$summary", `Successfully retrieved ${response.data?.length || 0} suppliers`);
    return response;
  },
};
