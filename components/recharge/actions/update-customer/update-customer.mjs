import recharge from "../../recharge.app.mjs";
import {
  getCustomerData, getCustomerProps,
} from "../common/common-customer.mjs";

export default {
  key: "recharge-update-customer",
  name: "Update Customer",
  description: "Updates an existing customer's details. [See the documentation](https://developer.rechargepayments.com/2021-11/customers/customers_update)",
  version: "0.0.2",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    recharge,
    customerId: {
      propDefinition: [
        recharge,
        "customerId",
      ],
    },
    applyCreditToNextRecurringCharge: {
      propDefinition: [
        recharge,
        "applyCreditToNextRecurringCharge",
      ],
    },
    ...getCustomerProps(true),
  },
  methods: {
    getCustomerData,
  },
  async run({ $ }) {
    const data = this.getCustomerData();
    const response = await this.recharge.updateCustomer({
      $,
      customerId: this.customerId,
      data,
    });

    $.export("$summary", `Successfully updated customer ${this.customerId}`);
    return response;
  },
};
