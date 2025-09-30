import plain from "../../plain.app.mjs";
import mutations from "../../common/mutations.mjs";

export default {
  key: "plain-create-customer-event",
  name: "Create Customer Event",
  description: "Creates an event with a customer. [See the documentation](https://www.plain.com/docs/api-reference/graphql/events/create-customer-event)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    plain,
    title: {
      type: "string",
      label: "Title",
      description: "Title of the event",
    },
    customerId: {
      propDefinition: [
        plain,
        "customerId",
      ],
    },
    text: {
      type: "string",
      label: "Text",
      description: "Description of the event",
    },
  },
  async run({ $ }) {
    const variables = {
      input: {
        title: this.title,
        customerIdentifier: {
          customerId: this.customerId,
        },
        components: [
          {
            componentText: {
              text: this.text,
            },
          },
        ],
      },
    };
    const { data } = await this.plain.post({
      $,
      data: {
        query: mutations.createCustomerEvent,
        variables,
      },
    });

    $.export("$summary", `Successfully created event for customer with ID ${this.customerId}`);

    return data;
  },
};
