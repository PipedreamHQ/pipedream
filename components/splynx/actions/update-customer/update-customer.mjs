import common from "../common/common-create-update.mjs";

const {
  splynx, ...props
} = common.props;

export default {
  ...common,
  key: "splynx-update-customer",
  name: "Update Customer",
  description:
    "Updates information of an existing customer. [See the documentation](https://splynx.docs.apiary.io/#reference/customers/customer/update-a-customer)",
  version: "0.0.2",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    splynx,
    customerId: {
      propDefinition: [
        splynx,
        "customerId",
      ],
    },
    ...Object.fromEntries(
      Object.entries(props).map(([
        key,
        value,
      ]) => [
        key,
        {
          ...value,
          optional: true,
        },
      ]),
    ),
  },
  async run({ $ }) {
    const response = await this.splynx.updateCustomer({
      $,
      customerId: this.customerId,
      data: this.getData(),
    });
    $.export("$summary", `Successfully updated customer ${this.customerId}`);
    return response;
  },
};
