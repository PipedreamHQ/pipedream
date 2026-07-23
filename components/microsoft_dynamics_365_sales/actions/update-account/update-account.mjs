import microsoft from "../../microsoft_dynamics_365_sales.app.mjs";

export default {
  key: "microsoft_dynamics_365_sales-update-account",
  name: "Update Account",
  description: "Update an existing account; only the fields you supply are sent. [See the documentation](https://learn.microsoft.com/en-us/power-apps/developer/data-platform/webapi/update-delete-entities-using-web-api) and the [account entity reference](https://learn.microsoft.com/en-us/power-apps/developer/data-platform/webapi/reference/account)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    microsoft,
    accountId: {
      propDefinition: [
        microsoft,
        "accountId",
      ],
      optional: false,
    },
    name: {
      type: "string",
      label: "Account Name",
      description: "Company or business name of the account",
      optional: true,
    },
    telephone1: {
      type: "string",
      label: "Main Phone",
      description: "Main phone number for the account",
      optional: true,
    },
    emailaddress1: {
      type: "string",
      label: "Email",
      description: "Primary email address for the account",
      optional: true,
    },
    websiteurl: {
      type: "string",
      label: "Website",
      description: "Website URL for the account (for example `https://www.example.com`)",
      optional: true,
    },
    fax: {
      type: "string",
      label: "Fax",
      description: "Fax number for the account",
      optional: true,
    },
    description: {
      type: "string",
      label: "Description",
      description: "Additional information describing the account",
      optional: true,
    },
    numberofemployees: {
      type: "integer",
      label: "Number of Employees",
      description: "Number of employees at the account",
      optional: true,
    },
    revenue: {
      type: "string",
      label: "Annual Revenue",
      description: "Annual revenue for the account, in the base currency (numeric, for example `1500000`)",
      optional: true,
    },
    address1_line1: {
      type: "string",
      label: "Address: Street 1",
      description: "First line of the primary address",
      optional: true,
    },
    address1_city: {
      type: "string",
      label: "Address: City",
      description: "City of the primary address",
      optional: true,
    },
    address1_stateorprovince: {
      type: "string",
      label: "Address: State/Province",
      description: "State or province of the primary address",
      optional: true,
    },
    address1_postalcode: {
      type: "string",
      label: "Address: ZIP/Postal Code",
      description: "ZIP or postal code of the primary address",
      optional: true,
    },
    address1_country: {
      type: "string",
      label: "Address: Country/Region",
      description: "Country or region of the primary address",
      optional: true,
    },
    primaryContactId: {
      propDefinition: [
        microsoft,
        "contactId",
      ],
      label: "Primary Contact",
      description: "Contact to set as the primary contact for the account",
      optional: true,
    },
    additionalProperties: {
      type: "object",
      label: "Additional Fields",
      description: "Any other account attributes to update, keyed by their Dynamics logical name (for example `{ \"industrycode\": 1 }`). Values are sent as-is. Use `attribute@odata.bind` keys to set lookups. [See the account entity reference](https://learn.microsoft.com/en-us/power-apps/developer/data-platform/webapi/reference/account)",
      optional: true,
    },
  },
  async run({ $ }) {
    const patchBody = {
      ...(this.additionalProperties ?? {}),
    };

    const directFields = {
      name: this.name,
      telephone1: this.telephone1,
      emailaddress1: this.emailaddress1,
      websiteurl: this.websiteurl,
      fax: this.fax,
      description: this.description,
      numberofemployees: this.numberofemployees,
      address1_line1: this.address1_line1,
      address1_city: this.address1_city,
      address1_stateorprovince: this.address1_stateorprovince,
      address1_postalcode: this.address1_postalcode,
      address1_country: this.address1_country,
    };
    for (const [
      field,
      value,
    ] of Object.entries(directFields)) {
      if (value !== undefined) {
        patchBody[field] = value;
      }
    }

    if (this.revenue !== undefined) {
      const revenue = Number(this.revenue);
      if (!Number.isFinite(revenue)) {
        throw new Error("Annual Revenue must be a valid number");
      }
      patchBody.revenue = revenue;
    }

    if (this.primaryContactId !== undefined) {
      patchBody["primarycontactid@odata.bind"] = `/contacts(${this.primaryContactId})`;
    }

    if (!Object.keys(patchBody).length) {
      throw new Error("Provide at least one field to update");
    }

    const account = await this.microsoft.patchAccount({
      $,
      accountId: this.accountId,
      data: patchBody,
    });

    $.export("$summary", `Updated account ${this.accountId}`);

    return account;
  },
};
