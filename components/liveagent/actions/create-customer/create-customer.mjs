import liveagent from "../../liveagent.app.mjs";

export default {
  name: "Create Customer",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  key: "liveagent-create-customer",
  description: "Creates a customer. [See the documentation](https://support.liveagent.com/911737-API-v3)",
  type: "action",
  props: {
    liveagent,
    groupId: {
      propDefinition: [
        liveagent,
        "groupId",
      ],
    },
    firstName: {
      label: "First Name",
      description: "The first name of the customer",
      type: "string",
    },
    lastName: {
      label: "Last Name",
      description: "The last name of the customer",
      type: "string",
    },
    email: {
      label: "Email",
      description: "The email of the customer",
      type: "string",
    },
  },
  async run({ $ }) {
    const response = await this.liveagent.createCustomer({
      $,
      data: {
        firstname: this.firstName,
        lastname: this.lastName,
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
