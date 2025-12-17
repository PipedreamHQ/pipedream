import plain from "../../plain.app.mjs";
import mutations from "../../common/mutations.mjs";

export default {
  key: "plain-add-customer-to-group",
  name: "Add Customer to Group",
  description: "Adds a customer to a customer group. [See the documentation](https://www.plain.com/docs/api-reference/graphql/customers/customer-groups#add-a-customer-to-groups)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    plain,
    customerId: {
      propDefinition: [
        plain,
        "customerId",
      ],
    },
    groupKey: {
      propDefinition: [
        plain,
        "groupKey",
      ],
    },
  },
  async run({ $ }) {
    const variables = {
      input: {
        customerId: this.customerId,
        customerGroupIdentifiers: [
          {
            customerGroupKey: this.groupKey,
          },
        ],
      },
    };
    const { data } = await this.plain.post({
      $,
      data: {
        query: mutations.addCustomerToCustomerGroup,
        variables,
      },
    });

    $.export("$summary", `Successfully added customer with ID ${this.customerId} to group ${this.groupKey}`);

    return data;
  },
};
