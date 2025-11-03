import leaddyno from "../../leaddyno.app.mjs";

export default {
  key: "leaddyno-create-lead",
  name: "Create Lead",
  description: "Creates a new lead in LeadDyno. [See the documentation](https://app.theneo.io/leaddyno/leaddyno-rest-api/leaddyno-api#POSTCreate-a-lead)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    leaddyno,
    email: {
      type: "string",
      label: "Email",
      description: "The email address of the lead",
    },
    firstName: {
      type: "string",
      label: "First Name",
      description: "The first name of the lead",
      optional: true,
    },
    lastName: {
      type: "string",
      label: "Last Name",
      description: "The last name of the lead",
      optional: true,
    },
    address1: {
      type: "string",
      label: "Address 1",
      description: "The first line of the address of the lead",
      optional: true,
    },
    address2: {
      type: "string",
      label: "Address 2",
      description: "The second line of the address of the lead",
      optional: true,
    },
    city: {
      type: "string",
      label: "City",
      description: "The city of the lead",
      optional: true,
    },
    state: {
      type: "string",
      label: "State",
      description: "The state of the lead",
      optional: true,
    },
    zipcode: {
      type: "string",
      label: "Zipcode",
      description: "The zipcode of the lead",
      optional: true,
    },
    country: {
      type: "string",
      label: "Country",
      description: "The country of the lead",
      optional: true,
    },
    phone: {
      type: "string",
      label: "Phone",
      description: "The phone number of the lead",
      optional: true,
    },
    affiliate: {
      propDefinition: [
        leaddyno,
        "affiliate",
      ],
      optional: true,
    },
    customStatus: {
      type: "string",
      label: "Custom Status",
      description: "The custom status of the lead",
      optional: true,
    },
  },
  async run({ $ }) {

    const response = await this.leaddyno.createLead({
      $,
      data: {
        email: this.email,
        first_name: this.firstName,
        last_name: this.lastName,
        address1: this.address1,
        address2: this.address2,
        city: this.city,
        state: this.state,
        zipcode: this.zipcode,
        country: this.country,
        phone: this.phone,
        affiliate: this.affiliate,
        custom_status: this.customStatus,
      },
    });

    $.export("$summary", `Successfully created lead with email ${this.email}`);

    return response;
  },
};
