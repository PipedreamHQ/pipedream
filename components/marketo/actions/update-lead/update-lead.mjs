import app from "../../marketo.app.mjs";

export default {
  key: "marketo-update-lead",
  name: "Update Lead",
  description: "Updates the information of an existing lead in Marketo. [See the documentation](https://developer.adobe.com/marketo-apis/api/mapi/#tag/Leads/operation/syncLeadUsingPOST)",
  version: "0.0.1",
  type: "action",
  props: {
    app,
    leadId: {
      propDefinition: [
        app,
        "leadId",
      ],
    },
    email: {
      type: "string",
      label: "Email",
      description: "The new email address of the lead",
      optional: true,
    },
    firstName: {
      type: "string",
      label: "First Name",
      description: "The new first name of the lead",
      optional: true,
    },
    lastName: {
      type: "string",
      label: "Last Name",
      description: "The new last name of the lead",
      optional: true,
    },
    company: {
      type: "string",
      label: "Company",
      description: "The new company of the lead",
      optional: true,
    },
    phone: {
      type: "string",
      label: "Phone Number",
      description: "The new phone number of the lead",
      optional: true,
    },
    annualRevenue: {
      type: "string",
      label: "Annual Revenue",
      description: "The new annual revenue of the lead",
      optional: true,
    },
  },
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  async run({ $ }) {
    const {
      app,
      leadId,
      email,
      firstName,
      lastName,
      company,
      phone,
      annualRevenue,
    } = this;

    const input = [
      {
        id: leadId,
        ...(email && {
          email,
        }),
        ...(firstName && {
          firstName,
        }),
        ...(lastName && {
          lastName,
        }),
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

    const response = await app.updateLead({
      $,
      data: {
        action: "updateOnly",
        input,
      },
    });

    $.export("$summary", `Successfully updated lead ${leadId}`);
    return response;
  },
};
