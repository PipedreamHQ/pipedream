import splynx from "../../splynx.app.mjs";

export default {
  key: "splynx-list-customers",
  name: "List Customers",
  description:
    "Get a list of your customers. [See the documentation](https://splynx.docs.apiary.io/#reference/customers/customers-collection/list-all-customers)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    splynx,
  },
  async run({ $ }) {
    const response = await this.splynx.listCustomers();
    $.export(
      "$summary",
      `Successfully listed ${response.length} customers`,
    );
    return response;
  },
};
