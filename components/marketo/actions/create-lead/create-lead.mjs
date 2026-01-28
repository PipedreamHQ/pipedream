import app from "../../marketo.app.mjs";

export default {
  key: "marketo-create-lead",
  name: "Create Lead",
  description: "Creates a new lead in Marketo. [See the documentation](https://developer.adobe.com/marketo-apis/api/mapi/#tag/Leads/operation/syncLeadUsingPOST)",
  version: "0.0.1",
  type: "action",
  props: {
    app,
    email: {
      type: "string",
      label: "Email",
      description: "The email address of the lead",
    },
    firstName: {
      type: "string",
      label: "First Name",
      description: "The first name of the lead",
    },
    lastName: {
      type: "string",
      label: "Last Name",
      description: "The last name of the lead",
    },
    company: {
      type: "string",
      label: "Company",
      description: "The company of the lead",
      optional: true,
    },
    phone: {
      type: "string",
      label: "Phone Number",
      description: "The phone number of the lead",
      optional: true,
    },
    annualRevenue: {
      type: "string",
      label: "Annual Revenue",
      description: "The annual revenue of the lead",
      optional: true,
    },
  },
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  async run({ $ }) {
    const {
      app,
      email,
      firstName,
      lastName,
      company,
      phone,
      annualRevenue,
    } = this;

    const input = [
      {
        email,
        firstName,
        lastName,
        ...(company && {
          company,
        }),
        ...(phone && {
          phone,
        }),
        ...(annualRevenue && {
          annualRevenue,
        }),
      },
    ];

    const response = await app.createLead({
      $,
      data: {
        action: "createOnly",
        input,
      },
    });

    $.export("$summary", `Successfully created lead with email: ${email}`);
    return response;
  },
};
