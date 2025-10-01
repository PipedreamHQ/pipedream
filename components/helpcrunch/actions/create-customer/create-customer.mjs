import helpcrunch from "../../helpcrunch.app.mjs";

export default {
  key: "helpcrunch-create-customer",
  name: "Create Customer",
  description: "Creates a new customer record within the Helpcrunch platform. [See the documentation](https://docs.helpcrunch.com/en/rest-api-v1/create-customer-v1)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    helpcrunch,
    name: {
      propDefinition: [
        helpcrunch,
        "name",
      ],
    },
    email: {
      propDefinition: [
        helpcrunch,
        "email",
      ],
    },
    company: {
      propDefinition: [
        helpcrunch,
        "company",
      ],
    },
    phone: {
      propDefinition: [
        helpcrunch,
        "phone",
      ],
    },
    notes: {
      propDefinition: [
        helpcrunch,
        "notes",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.helpcrunch.createCustomer({
      data: {
        name: this.name,
        email: this.email,
        company: this.company,
        phone: this.phone,
        notes: this.notes,
      },
      $,
    });
    if (response?.id) {
      $.export("$summary", `Successfully created customer with ID ${response.id}.`);
    }
    return response;
  },
};
