import profitwell from "../../app/profitwell.app";
import { defineAction } from "@pipedream/types";
import { GetCustomerInfoParams } from "../../common/requestParams";

export default defineAction({
  name: "Get Customer Info",
  description:
    "Get data for a customer [See docs here](https://profitwellapiv2.docs.apiary.io/#/reference/customers/retrieving-a-customer-by-id)",
  key: "profitwell-get-customer-info",
  version: "0.0.1",
  type: "action",
  props: {
    profitwell,
    email: {
      type: "string",
      label: "Email Address",
      description: "The email address of the customer.",
    },
    customerId: {
      propDefinition: [profitwell, "customerId"],
    },
  },
  async run({ $ }): Promise<any> {
    const params: GetCustomerInfoParams = {
      $,
      params: {
        customer_id: this.customerId,
      },
    };
    const data = await this.profitwell.getCustomerInfo(params);

    $.export("$summary", "Obtained customer info successfully");

    return data;
  },
});
