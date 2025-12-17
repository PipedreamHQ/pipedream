import common from "../common/common-create-update.mjs";

export default {
  ...common,
  key: "splynx-create-customer",
  name: "Create Customer",
  description:
    "Creates a new customer with the provided details. [See the documentation](https://splynx.docs.apiary.io/#reference/customers/customers-collection/create-a-customer)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  async run({ $ }) {
    const response = await this.splynx.createCustomer({
      $,
      data: this.getData(),
    });
    $.export(
      "$summary",
      `Successfully created customer "${this.name}" (ID: ${response.id})`,
    );
    return response;
  },
};
