import recharge from "../../recharge.app.mjs";
import {
  getCustomerData, getCustomerProps,
} from "../common/common-customer.mjs";

export default {
  key: "recharge-create-customer",
  name: "Create Customer",
  description: "Creates a customer. [See the documentation](https://developer.rechargepayments.com/2021-11/customers/customers_create)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    recharge,
    ...getCustomerProps(),
  },
  methods: {
    getCustomerData,
  },
  async run({ $ }) {
    const data = this.getCustomerData();
    const response = await this.recharge.createCustomer({
      $,
      data,
    });

    $.export("$summary", `Successfully created customer (ID: ${response?.customer?.id})`);
    return response;
  },
};
