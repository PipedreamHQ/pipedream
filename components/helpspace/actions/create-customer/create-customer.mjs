import helpspace from "../../helpspace.app.mjs";

export default {
  key: "helpspace-create-customer",
  name: "Create Customer",
  description: "Creates a new customer in Helpspace. [See the documentation](https://documentation.helpspace.com/api-customers)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    helpspace,
    name: {
      propDefinition: [
        helpspace,
        "name",
      ],
    },
    email: {
      propDefinition: [
        helpspace,
        "email",
      ],
    },
    jobTitle: {
      propDefinition: [
        helpspace,
        "jobTitle",
      ],
    },
    address: {
      propDefinition: [
        helpspace,
        "address",
      ],
    },
    city: {
      propDefinition: [
        helpspace,
        "city",
      ],
    },
    state: {
      propDefinition: [
        helpspace,
        "state",
      ],
    },
    postalCode: {
      propDefinition: [
        helpspace,
        "postalCode",
      ],
    },
    country: {
      propDefinition: [
        helpspace,
        "country",
      ],
    },
  },
  async run({ $ }) {
    const { data } = await this.helpspace.createCustomer({
      $,
      data: {
        name: this.name,
        email: this.email,
        job_title: this.jobTitle,
        address: this.address,
        city: this.city,
        state: this.state,
        postal_code: this.postalCode,
        country: this.country,
      },
    });
    $.export("$summary", `Successfully created customer with ID: ${data.id}`);
    return data;
  },
};
