import profitwell from "../../app/profitwell.app";
import { defineAction } from "@pipedream/types";
import { GetCustomerInfoParams } from "../../common/requestParams";
import { Customer } from "../../common/responseSchemas";

export default defineAction({
  name: "Get Customer Info",
  description:
    "Get data for a customer [See docs here](https://profitwellapiv2.docs.apiary.io/#/reference/customers/retrieving-a-customer-by-id)",
  key: "profitwell-get-customer-info",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    profitwell,
    email: {
      type: "string",
      label: "Email Address",
      description: "The email address to search for customers with.",
    },
    customerId: {
      propDefinition: [
        profitwell,
        "customerId",
        ({ email }: {email: string;}) => ({
          email,
        }),
      ],
    },
  },
  async run({ $ }): Promise<Customer> {
    const params: GetCustomerInfoParams = {
      $,
      customerId: this.customerId,
    };
    const data: Customer = await this.profitwell.getCustomerInfo(params);

    $.export("$summary", `Successfully obtained customer info for ${data.email}`);

    return data;
  },
});
