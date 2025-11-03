import drata from "../../drata.app.mjs";

const docsLink = "https://developers.drata.com/docs/openapi/reference/operation/VendorsPublicController_createVendor/";

export default {
  key: "drata-create-vendor",
  name: "Create Vendor",
  description: `Create a new Vendor. [See the documentation](${docsLink}).`,
  version: "0.0.4",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    drata,
    name: {
      type: "string",
      label: "Name",
      description: "The name of the vendor",
    },
    category: {
      type: "string",
      label: "Category",
      description: "The type of vendor",
      options: [
        "ENGINEERING",
        "PRODUCT",
        "MARKETING",
        "CS",
        "SALES",
        "FINANCE",
        "HR",
        "ADMINISTRATIVE",
        "SECURITY",
      ],
    },
    risk: {
      type: "string",
      label: "Risk",
      description: "The level of risk for customer data",
      options: [
        "NONE",
        "LOW",
        "MODERATE",
        "HIGH",
      ],
    },
    critical: {
      type: "boolean",
      label: "Critical",
      description: "Is this vendor is considered critical",
    },
    isSubProcessor: {
      type: "boolean",
      label: "Is Sub Processor",
      description: "Is this vendor is considered sub-processor",
    },
    isSubProcessorActive: {
      type: "boolean",
      label: "Is Sub Processor Active",
      description: "Is the subprocessor active",
    },
    userId: {
      propDefinition: [
        drata,
        "personnelId",
      ],
      label: "User ID",
      description: "The user ID of the person responsible for the compliance of this vendor",
    },
    url: {
      type: "string",
      label: "URL",
      description: "The URL of the vendor",
    },
    privacyUrl: {
      type: "string",
      label: "Privacy URL",
      description: "Vendor Privacy Policy URL",
    },
    termsUrl: {
      type: "string",
      label: "Terms URL",
      description: "Vendor Terms of Use URL",
    },
    servicesProvided: {
      type: "string",
      label: "Services Provided",
      description: "Describe vendor services",
    },
    dataStored: {
      type: "string",
      label: "Data Stored",
      description: "What type of data the vendor stores",
    },
    location: {
      type: "string",
      label: "Location",
      description: "The vendor location",
    },
    hasPii: {
      type: "boolean",
      label: "Has PII",
      description: "Does this vendor store any type of PII",
    },
    passwordPolicy: {
      type: "string",
      label: "Password Policy",
      description: "The vendor password policy",
      options: [
        "USERNAME_PASSWORD",
        "SSO",
        "LDAP",
      ],
    },
    passwordRequiresMinLength: {
      type: "boolean",
      label: "Password Requires Min Length",
      description: "Is there a minimum length for user passwords",
    },
    passwordRequiresNumber: {
      type: "boolean",
      label: "Password Requires Number",
      description: "Does a password require numbers",
    },
    passwordRequiresSymbol: {
      type: "boolean",
      label: "Password Requires Symbol",
      description: "Does a password require non-alpha-numeric characters",
    },
    passwordMfaEnabled: {
      type: "boolean",
      label: "Password MFA Enabled",
      description: "Is mult-factor authentication enabled for this vendor",
    },
    accountManagerName: {
      type: "string",
      label: "Account Manager Name",
      description: "The name of the corresponding account manager for this vendor",
    },
    accountManagerEmail: {
      type: "string",
      label: "Account Manager Email",
      description: "The email of the corresponding account manager for this vendor",
    },
    isComplianceReviewRequired: {
      type: "boolean",
      label: "Is Compliance Review Required",
      description: "Is vendor compliance report review required?",
    },
    passwordMinLength: {
      type: "integer",
      label: "Password Min Length",
      description: "Minimum character length for a password",
      optional: true,
    },
    renewalDate: {
      type: "string",
      label: "Renewal Date",
      description: "Vendor renewal ISO 8601 datetime. E.g. 2021-01-01T00:00:00.000Z",
      optional: true,
    },
    renewalScheduleType: {
      type: "string",
      label: "Renewal Schedule Type",
      description: "Vendor renewal schedule type",
      optional: true,
      options: [
        "ONE_MONTH",
        "TWO_MONTHS",
        "THREE_MONTHS",
        "SIX_MONTHS",
        "ONE_YEAR",
        "CUSTOM",
      ],
    },
    notes: {
      type: "string",
      label: "Notes",
      description: "Additional notes for vendor",
      optional: true,
    },
    confirmed: {
      type: "boolean",
      label: "Confirmed",
      description: "Is all vendor data confirmed?",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.drata.createVendor({
      $,
      data: {
        name: this.name,
        category: this.category,
        risk: this.risk,
        critical: this.critical,
        isSubProcessor: this.isSubProcessor,
        isSubProcessorActive: this.isSubProcessorActive,
        userId: this.userId,
        url: this.url,
        privacyUrl: this.privacyUrl,
        termsUrl: this.termsUrl,
        servicesProvided: this.servicesProvided,
        dataStored: this.dataStored,
        location: this.location,
        hasPii: this.hasPii,
        passwordPolicy: this.passwordPolicy,
        passwordRequiresMinLength: this.passwordRequiresMinLength,
        passwordRequiresNumber: this.passwordRequiresNumber,
        passwordRequiresSymbol: this.passwordRequiresSymbol,
        passwordMfaEnabled: this.passwordMfaEnabled,
        accountManagerName: this.accountManagerName,
        accountManagerEmail: this.accountManagerEmail,
        isComplianceReviewRequired: this.isComplianceReviewRequired,
        passwordMinLength: this.passwordMinLength,
        renewalDate: this.renewalDate,
        renewalScheduleType: this.renewalScheduleType,
        confirmed: this.confirmed,
      },
    });
    $.export("$summary", "Succesfully created vendor");
    return response;
  },
};
