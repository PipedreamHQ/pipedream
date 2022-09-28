import liveagent from "../../liveagent.app.mjs";

export default {
  name: "Add Customer To Group",
  version: "0.0.14",
  key: "liveagent-add-customer-to-group",
  description: "Add customer to a group. [See docs here](https://pipedream.ladesk.com/docs/api/v3/#/contacts/patchContact)",
  type: "action",
  props: {
    liveagent,
    customerId: {
      propDefinition: [
        liveagent,
        "customerId",
      ],
    },
    groupId: {
      propDefinition: [
        liveagent,
        "groupId",
      ],
    },
    email: {
      label: "Email",
      description: "The customer email",
      type: "string",
    },
  },
  async run({ $ }) {
    const response = await this.liveagent.updateCustomer({
      $,
      data: {
        groups: [
          this.groupId,
        ],
        emails: [
          this.email,
        ],
      },
    });

    if (response) {
      $.export("$summary", `Successfully updated customer with id ${response.id}`);
    }

    return response;
  },
};
