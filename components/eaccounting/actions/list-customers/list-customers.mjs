import app from "../../eaccounting.app.mjs";

export default {
  key: "eaccounting-list-customers",
  name: "List Customers",
  description: "Retrieves a list of customers. [See the documentation](https://developer.vismaonline.com)",
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
    const response = await this.app.listCustomers({
      $,
    });
    $.export("$summary", `Successfully retrieved ${response.data?.length || 0} customers`);
    return response;
  },
};
