import plain from "../../plain.app.mjs";
import mutations from "../../common/mutations.mjs";

export default {
  key: "plain-upsert-customer",
  name: "Upsert Customer",
  description: "Creates or updates customer with customer details. [See the documentation](https://www.plain.com/docs/api-reference/graphql/customers/upsert)",
  version: "0.0.2",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    plain,
    email: {
      type: "string",
      label: "Email",
      description: "Email address of the customer",
    },
    name: {
      type: "string",
      label: "Name",
      description: "Full name of the customer",
    },
  },
  async run({ $ }) {
    const variables = {
      input: {
        identifier: {
          emailAddress: this.email,
        },
        onCreate: {
          fullName: this.name,
          email: {
            email: this.email,
            isVerified: true,
          },
        },
        onUpdate: {
          fullName: this.name
            ? {
              value: this.name,
            }
            : undefined,
          email: {
            email: this.email,
            isVerified: true,
          },
        },
      },
    };
    const { data } = await this.plain.post({
      $,
      data: {
        query: mutations.upsertCustomer,
        variables,
      },
    });

    const result = data.upsertCustomer.result;
    if (result === "NOOP") {
      $.export("$summary", "Customer already exists and the values being updated are the same.");
    } else {
      $.export("$summary", `Successfully ${result} customer with ID ${data.upsertCustomer.customer.id}`);
    }

    return data;
  },
};
