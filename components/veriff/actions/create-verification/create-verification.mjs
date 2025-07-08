import constants from "../../common/constants.mjs";
import { parseObject } from "../../common/utils.mjs";
import app from "../../veriff.app.mjs";

export default {
  key: "veriff-create-verification",
  name: "Create Verification Session",
  description: "Creates a new verification session [See the documentation](https://devdocs.veriff.com/apidocs/v1sessions)",
  version: "0.0.1",
  type: "action",
  props: {
    app,
    callback: {
      type: "string",
      label: "Callback URL",
      description: "The callback URL to where the end-user is redirected after the verification session is completed. Default is visible in the Veriff Customer Portal > Settings. Changing the value in this request body will overwrite the default callback URL, but it will not change the callback URL that is visible in the Customer Portal.",
      optional: true,
    },
    firstName: {
      type: "string",
      label: "First Name",
      description: "Person's first name",
      optional: true,
    },
    lastName: {
      type: "string",
      label: "Last Name",
      description: "Person's last name",
      optional: true,
    },
    idNumber: {
      type: "string",
      label: "ID Number",
      description: "Person's national identification number",
      optional: true,
    },
    phoneNumber: {
      type: "string",
      label: "Phone Number",
      description: "Person's phone number",
      optional: true,
    },
    gender: {
      type: "string",
      label: "Gender",
      description: "Person's gender",
      options: constants.GENDER_OPTIONS,
      optional: true,
    },
    dateOfBirth: {
      type: "string",
      label: "Date of Birth",
      description: "Person's date of birth (YYYY-MM-DD)",
      optional: true,
    },
    email: {
      type: "string",
      label: "Email",
      description: "Person's email address",
      optional: true,
    },
    maritalStatus: {
      type: "string",
      label: "Marital Status",
      description: "Person's marital status",
      options: constants.MARITAL_STATUS_OPTIONS,
      optional: true,
    },
    isDeceased: {
      type: "boolean",
      label: "Is Deceased",
      description: "Person's deceased status",
      optional: true,
    },
    number: {
      type: "string",
      label: "Document Number",
      description: "Document number, [a-zA-Z0-9] characters only",
      optional: true,
    },
    country: {
      type: "string",
      label: "Country",
      description: "Document issuing country (ISO 3166-1 alpha-2)",
      optional: true,
    },
    type: {
      type: "string",
      label: "Document Type",
      description: "Type of document to verify",
      options: constants.DOCUMENT_TYPE_OPTIONS,
      optional: true,
    },
    firstIssue: {
      type: "string",
      label: "First Issue",
      description: "Date of first issue of the document (YYYY-MM-DD)",
      optional: true,
    },
    fullAddress: {
      type: "string",
      label: "Address",
      description: "Full address (mandatory only for UK DIATF M1B profile flow)",
      optional: true,
    },
    vendorData: {
      type: "string",
      label: "Vendor Data",
      description: "The unique identifier that you created for your end-user. It can be max 1,000 characters long and contain only non-semantic data that can not be resolved or used outside your systems or environments. Veriff returns it unmodified in webhooks and API response payloads, or as null if not provided",
      optional: true,
    },
    endUserId: {
      type: "string",
      label: "End User ID",
      description: "The `UUID` that you created for your end-user, that can not be resolved or used outside your systems or environments. Veriff returns it unmodified in webhooks and API response payloads, or as `null` if not provided",
      optional: true,
    },
    consents: {
      type: "string[]",
      label: "Consents",
      description: "Array of objects listing the type of consent given. Optional, should be only included for features that require consent",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.app.createVerificationSession({
      $,
      data: {
        verification: {
          callback: this.callback,
          person: {
            firstName: this.firstName,
            lastName: this.lastName,
            idNumber: this.idNumber,
            phoneNumber: this.phoneNumber,
            gender: this.gender,
            dateOfBirth: this.dateOfBirth,
            email: this.email,
            maritalStatus: this.maritalStatus,
            isDeceased: this.isDeceased,
          },
          document: {
            number: this.number,
            country: this.country,
            type: this.type,
            firstIssue: this.firstIssue,
          },
          address: {
            fullAddress: this.fullAddress,
          },
          vendorData: this.vendorData,
          endUserId: this.endUserId,
          consents: parseObject(this.consents),
        },
      },
    });

    $.export("$summary", `Created verification session ${response.verification.id}`);
    return response;
  },
};
