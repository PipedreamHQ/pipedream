import app from "../../repairshopr.app.mjs";

export default {
  key: "repairshopr-create-lead",
  name: "Create Lead",
  description: "Create a new lead. [See the docs here](https://api-docs.repairshopr.com/#/Lead/post_leads)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    businessName: {
      propDefinition: [
        app,
        "businessName",
      ],
      description: "The business name of the lead.",
    },
    firstName: {
      propDefinition: [
        app,
        "firstName",
      ],
      description: "The first name of the lead.",
    },
    lastName: {
      propDefinition: [
        app,
        "lastName",
      ],
      description: "The last name of the lead.",
    },
    email: {
      propDefinition: [
        app,
        "email",
      ],
      description: "The email address of the lead.",
    },
    phone: {
      propDefinition: [
        app,
        "phone",
      ],
      description: "The phone number of the lead.",
    },
    mobile: {
      propDefinition: [
        app,
        "mobile",
      ],
      description: "The mobile number of the lead.",
    },
    address: {
      propDefinition: [
        app,
        "address",
      ],
      description: "The address of the lead.",
    },
    city: {
      propDefinition: [
        app,
        "city",
      ],
      description: "The city of the lead.",
    },
    state: {
      propDefinition: [
        app,
        "state",
      ],
      description: "The state of the lead.",
    },
    zip: {
      propDefinition: [
        app,
        "zip",
      ],
      description: "The zip code of the lead.",
    },
    converted: {
      type: "boolean",
      label: "Converted",
      description: "Whether the lead has been converted to a customer.",
      optional: true,
    },
  },
  async run({ $ }) {
    const data = {
      business_name: this.businessName,
      first_name: this.firstName,
      last_name: this.lastName,
      email: this.email,
      phone: this.phone,
      mobile: this.mobile,
      address: this.address,
      city: this.city,
      state: this.state,
      zip: this.zip,
      converted: this.converted,
    };
    const res = await this.app.createLead(data, this);
    $.export("$summary", "Lead successfully created");
    return res?.lead;
  },
};
