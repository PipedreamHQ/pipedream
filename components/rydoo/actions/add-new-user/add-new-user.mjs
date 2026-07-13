import rydoo from "../../rydoo.app.mjs";

export default {
  key: "rydoo-add-new-user",
  name: "Add New User",
  description: "Creates a new employee record in the company directory. [See the documentation](https://developers.rydoo.com/reference/v2useradduser)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    rydoo,
    email: {
      type: "string",
      label: "Email",
      description: "Email address of the user. Must be unique within the company account",
    },
    firstName: {
      type: "string",
      label: "First Name",
      description: "First name of the user",
    },
    lastName: {
      type: "string",
      label: "Last Name",
      description: "Last name of the user",
    },
    enabled: {
      type: "boolean",
      label: "Enabled",
      description: "When `true`, the user receives an activation email. Defaults to inactive if not provided",
      optional: true,
    },
    groupId: {
      propDefinition: [
        rydoo,
        "groupId",
      ],
      description: "The group to assign to the user",
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
    const response = await this.rydoo.addUser({
      $,
      data: {
        email: this.email,
        firstName: this.firstName,
        lastName: this.lastName,
        enabled: this.enabled,
        groupId: this.groupId,
        refId: this.refId,
        authentication: this.authentication,
        country: this.country,
        languageCountryCode: this.languageCountryCode,
        accountNumber: this.accountNumber,
        customFields: this.customFields?.map((f) => JSON.parse(f)),
      },
    });

    $.export("$summary", `Successfully created user ${this.firstName} ${this.lastName} (${this.email}).`);
    return response;
  },
};
