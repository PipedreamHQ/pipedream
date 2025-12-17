import whiteSwan from "../../white_swan.app.mjs";
import constants from "../../common/constants.mjs";
import utils from "../../common/utils.mjs";

export default {
  key: "white_swan-create-pre-fill-info",
  name: "Create Pre-fill Info",
  description: "Imports client data for pre-filling applications to enrich the user experience. [See the documentation](https://docs.whiteswan.io/partner-knowledge-base/api-documentation/action-calls/create-pre-fill-information)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    whiteSwan,
    firstName: {
      type: "string",
      label: "First Name",
      description: "The first name of the intended insured person.",
      optional: true,
    },
    lastName: {
      type: "string",
      label: "Last Name",
      description: "The last name of the intended insured person.",
      optional: true,
    },
    email: {
      type: "string",
      label: "Email",
      description: "The email of the applicant.",
      optional: true,
    },
    address: {
      type: "string",
      label: "Address",
      description: "The current address of the intended insured person.",
      optional: true,
    },
    dateOfBirth: {
      type: "string",
      label: "Date of Birth",
      description: "The date of birth of the intended insured person in ISO 8601 format.",
      optional: true,
    },
    policyType: {
      type: "string",
      label: "Policy Type",
      description: "The policy type of this policy.",
      optional: true,
      options: constants.POLICY_TYPE,
    },
  },
  async run({ $ }) {
    const response = await this.whiteSwan.importClientData({
      $,
      data: {
        first_name: this.firstName,
        last_name: this.lastName,
        email: this.email,
        address: this.address,
        date_of_birth: this.dateOfBirth
          ? utils.convertISOToCustomFormat(this.dateOfBirth)
          : undefined,
        policy_type: this.policyType,
      },
    });
    $.export("$summary", "Successfully imported client data for pre-filling applications");
    return response;
  },
};
