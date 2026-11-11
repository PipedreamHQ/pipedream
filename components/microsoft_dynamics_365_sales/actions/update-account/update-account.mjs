import { ConfigurationError } from "@pipedream/platform";
import microsoft from "../../microsoft_dynamics_365_sales.app.mjs";

const GUID_REGEX =
  /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;

/**
 * Validate a Dynamics record identifier and return the bare GUID.
 * A single balanced surrounding brace pair (`{...}`) is accepted and
 * stripped; unmatched braces or otherwise malformed values are rejected.
 * @param {unknown} value Raw prop value
 * @param {string} label Human-readable field name for the error message
 * @returns {string} Bare GUID (no surrounding braces)
 */
function assertGuid(value, label) {
  let guid = typeof value === "string"
    ? value.trim()
    : "";
  if (guid.startsWith("{") && guid.endsWith("}")) {
    guid = guid.slice(1, -1);
  }
  if (!GUID_REGEX.test(guid)) {
    throw new ConfigurationError(`${label} must be a valid GUID (for example \`00000000-0000-0000-0000-000000000001\`)`);
  }
  return guid;
}

export default {
  key: "microsoft_dynamics_365_sales-update-account",
  name: "Update Account",
  description: "Update an existing account; only the fields you supply are sent. See the [account entity reference](https://learn.microsoft.com/en-us/power-apps/developer/data-platform/webapi/reference/account) for the full list of updatable fields. [See the documentation](https://learn.microsoft.com/en-us/power-apps/developer/data-platform/webapi/update-delete-entities-using-web-api)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  ai: "optimized",
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
    address1Line1: {
      type: "string",
      label: "Address: Street 1",
      description: "First line of the primary address",
      optional: true,
    },
    address1City: {
      type: "string",
      label: "Address: City",
      description: "City of the primary address",
      optional: true,
    },
    address1Stateorprovince: {
      type: "string",
      label: "Address: State/Province",
      description: "State or province of the primary address",
      optional: true,
    },
    address1Postalcode: {
      type: "string",
      label: "Address: ZIP/Postal Code",
      description: "ZIP or postal code of the primary address",
      optional: true,
    },
    address1Country: {
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
      description: "Contact to set as the primary contact for the account. Provide the contact's GUID (for example `00000000-0000-0000-0000-000000000001`) — the `contactid` value copied from the contact record in Dynamics or returned by the **Find Contact** action.",
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
    const accountId = assertGuid(this.accountId, "Account ID");

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
      address1_line1: this.address1Line1,
      address1_city: this.address1City,
      address1_stateorprovince: this.address1Stateorprovince,
      address1_postalcode: this.address1Postalcode,
      address1_country: this.address1Country,
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
      const revenueValue = this.revenue.trim();
      const revenue = Number(revenueValue);
      if (!revenueValue || !Number.isFinite(revenue)) {
        throw new ConfigurationError("Annual Revenue must be a valid number");
      }
      patchBody.revenue = revenue;
    }

    if (this.primaryContactId !== undefined) {
      const contactId = assertGuid(this.primaryContactId, "Primary Contact");
      patchBody["primarycontactid@odata.bind"] = `/contacts(${contactId})`;
    }

    if (!Object.keys(patchBody).length) {
      throw new ConfigurationError("Provide at least one field to update");
    }

    const account = await this.microsoft.patchAccount({
      $,
      accountId,
      data: patchBody,
    });

    $.export("$summary", `Updated account ${accountId}`);

    return account;
  },
};
