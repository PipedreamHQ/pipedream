import rydoo from "../../rydoo.app.mjs";

export default {
  key: "rydoo-update-user-profile",
  name: "Update User Profile",
  description: "Modifies existing user details like names, nationality, or status. [See the documentation](https://developers.rydoo.com/reference/v2userupdateuser)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    rydoo,
    userId: {
      propDefinition: [
        rydoo,
        "userId",
      ],
    },
    email: {
      type: "string",
      label: "Email",
      description: "New email address. Must be unique within the company account",
      optional: true,
    },
    firstName: {
      type: "string",
      label: "First Name",
      description: "New first name of the user",
      optional: true,
    },
    lastName: {
      type: "string",
      label: "Last Name",
      description: "New last name of the user",
      optional: true,
    },
    enabled: {
      type: "boolean",
      label: "Enabled",
      description: "When `true`, activates the account and sends a verification email",
      optional: true,
    },
    refId: {
      type: "string",
      label: "Reference ID",
      description: "External reference identifier, often used for employee or vendor numbers in ERP systems",
      optional: true,
    },
    authentication: {
      propDefinition: [
        rydoo,
        "authentication",
      ],
      optional: true,
    },
    country: {
      type: "string",
      label: "Country",
      description: "3-letter country code per ISO 3166 (e.g., `FRA`, `DEU`, `USA`)",
      optional: true,
    },
    languageCountryCode: {
      propDefinition: [
        rydoo,
        "languageCountryCode",
      ],
      optional: true,
    },
    accountNumber: {
      type: "string",
      label: "Account Number",
      description: "Direct deposit account number for expense reimbursements",
      optional: true,
    },
    customFields: {
      type: "string[]",
      label: "Custom Fields",
      description: "Custom field values for the user. Each entry must be a JSON object with `key`, `value`, and optionally `valueCode` properties (e.g., `{\"key\": \"department\", \"value\": \"Engineering\"}`)",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.rydoo.updateUser({
      $,
      userId: this.userId,
      data: {
        email: this.email,
        firstName: this.firstName,
        lastName: this.lastName,
        enabled: this.enabled,
        refId: this.refId,
        authentication: this.authentication,
        country: this.country,
        languageCountryCode: this.languageCountryCode,
        accountNumber: this.accountNumber,
        customFields: this.customFields?.map((f) => JSON.parse(f)),
      },
    });

    $.export("$summary", `Successfully updated user ${this.userId}.`);
    return response;
  },
};
