import { ConfigurationError } from "@pipedream/platform";
import vryno from "../../vryno.app.mjs";

export default {
  key: "vryno-create-unique-lead",
  name: "Create Unique Lead",
  description: "Creates a unique lead in the Vryno system, ensuring no duplication of lead details. [See the documentation](https://vrynotest.ti2.in/docs/api-documentation/how-to-create-a-record-in-any-module-in-vryno-crm/)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    vryno,
    firstName: {
      type: "string",
      label: "First Name",
      description: "The lead's first name.",
      optional: true,
    },
    name: {
      type: "string",
      label: "Last Name",
      description: "The lead's last name.",
    },
    email: {
      type: "string",
      label: "Email",
      description: "The lead's email.",
      optional: true,
    },
    phoneNumber: {
      type: "string",
      label: "Phone Number",
      description: "The lead's phone number.",
      optional: true,
    },
    company: {
      type: "string",
      label: "Company",
      description: "The company the lead works for.",
      optional: true,
    },
    website: {
      type: "string",
      label: "Website",
      description: "The lead's website.",
      optional: true,
    },
    ownerId: {
      type: "string",
      label: "Owner Id",
      description: "The user Id related to the lead.You can find the user IDs in your account -> settings -> users & controls -> users, click on some user and the ID will be in URL.",
    },
    score: {
      type: "integer",
      label: "Score",
      description: "The lead's score.",
      optional: true,
    },
    expectedRevenue: {
      type: "integer",
      label: "Expected Revenue",
      description: "Expected revenue for the lead.",
      optional: true,
    },
    numberOfEmployees: {
      type: "integer",
      label: "Number Of Employees",
      description: "Number of employees at the lead company.",
      optional: true,
    },
    billingAddress: {
      type: "string",
      label: "Billing Address",
      description: "The lead's billing address.",
      optional: true,
    },
    billingCity: {
      type: "string",
      label: "Billing City",
      description: "The lead's billing city.",
      optional: true,
    },
    billingState: {
      type: "string",
      label: "Billing State",
      description: "The lead's billing state.",
      optional: true,
    },
    billingCountry: {
      type: "string",
      label: "Billing Country",
      description: "The lead's billing country.",
      optional: true,
    },
    billingZipcode: {
      type: "string",
      label: "Billing Zipcode",
      description: "The lead's billing zipcode",
      optional: true,
    },
    shippingAddress: {
      type: "string",
      label: "Shipping Address",
      description: "The lead's shipping address.",
      optional: true,
    },
    shippingCity: {
      type: "string",
      label: "Shipping City",
      description: "The lead's shipping city.",
      optional: true,
    },
    shippingState: {
      type: "string",
      label: "Shipping State",
      description: "The lead's shipping state.",
      optional: true,
    },
    shippingCountry: {
      type: "string",
      label: "Shipping Country",
      description: "The lead's shipping country.",
      optional: true,
    },
    shippingZipcode: {
      type: "string",
      label: "Shipping Zipcode",
      description: "The lead's shipping zipcode",
      optional: true,
    },
    description: {
      type: "string",
      label: "Description",
      description: "A brief description about the lead.",
      optional: true,
    },
  },
  async run({ $ }) {
    if (!this.email && !this.phoneNumber) {
      throw new ConfigurationError("You must provide at least either **Email** or **Phone Number**.");
    }
    const duplicateCheck = await this.vryno.post({
      data: {
        query: `query {
          fetchLead(filters:[${this.email
    ? `{name: "email", operator:"eq",value:["${this.email}"]},`
    : ""}${this.phoneNumber
  ? `{name: "phoneNumber", operator:"eq",value:["${this.phoneNumber}"]}`
  : ""}],
  expression:"( ( a ) and b)"){
                code
                status
                message
                messageKey
                count
                data {
                  id
                } 
            }
        }`,
      },
    });

    if (duplicateCheck.data?.fetchLead?.data?.length) {
      $.export("$summary", "A lead with the same email and phone number already exists.");
      return duplicateCheck.data;
    }

    const {
      vryno,
      ...data
    } = this;

    let query = `mutation {
      createLead(input: {
        `;

    for (const [
      field,
      value,
    ] of Object.entries(data)) {
      query += `${field}:`;
      if ([
        "score",
        "expectedRevenue",
        "numberOfEmployees",
      ].includes(field)) {
        query += ` ${value}
        `;
      } else {
        query += ` "${value}"
        `;
      }
    }

    query += `}) {
        code
        message
        status
        messageKey
        data {
          id
        }
        errors
      }
    }`;

    const response = await vryno.post({
      $,
      data: {
        query,
      },
    });

    if (response.data.createLead.code != 200) {
      throw new ConfigurationError(response.data.createLead.message);
    }

    $.export("$summary", `Successfully created new lead with Id: ${response.data.createLead.data.id}`);
    return response;
  },
};
