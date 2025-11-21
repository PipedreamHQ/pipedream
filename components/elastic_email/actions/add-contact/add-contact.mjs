import { ConfigurationError } from "@pipedream/platform";
import {
  CONSENT_TRACKING_OPTIONS,
  STATUS_OPTIONS,
} from "../../common/constants.mjs";
import { parseObject } from "../../common/utils.mjs";
import app from "../../elastic_email.app.mjs";

export default {
  key: "elastic_email-add-contact",
  name: "Add Contact to Mailing List",
  description: "Adds a new contact to a mailing list. [See the documentation](https://elasticemail.com/developers/api-documentation/rest-api#operation/contactsPost)",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    email: {
      propDefinition: [
        app,
        "email",
      ],
    },
    listNames: {
      propDefinition: [
        app,
        "listNames",
      ],
      optional: true,
    },
    status: {
      type: "string",
      label: "Status",
      description: "The initial status of the contact.",
      options: STATUS_OPTIONS,
      optional: true,
    },
    firstName: {
      type: "string",
      label: "First Name",
      description: "The contact's first name.",
      optional: true,
    },
    lastName: {
      type: "string",
      label: "Last Name",
      description: "The contact's last name.",
      optional: true,
    },
    customFields: {
      type: "object",
      label: "Custom Fields",
      description: "A key-value collection of custom contact fields which can be used in the system. Only already existing custom fields will be saved.",
      optional: true,
    },
    consentIP: {
      type: "string",
      label: "Consent IP",
      description: "IP address of consent to send this contact(s) your email. If not provided your current public IP address is used for consent.",
      optional: true,
    },
    consentDate: {
      type: "string",
      label: "Consent Date",
      description: "Date of consent to send this contact(s) your email. If not provided current date is used for consent.",
      optional: true,
    },
    consentTracking: {
      type: "string",
      label: "Consent Tracking",
      description: "Tracking of consent to send this contact(s) your email. Defaults to \"Unknown\".",
      options: CONSENT_TRACKING_OPTIONS,
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.app.addContact({
      $,
      params: {
        listnames: parseObject(this.listNames),
      },
      data: [
        {
          Email: this.email,
          Status: this.status,
          FirstName: this.firstName,
          LastName: this.lastName,
          CustomFields: parseObject(this.customFields),
          Consent: {
            ConsentIP: this.consentIP,
            ConsentDate: this.consentDate,
            ConsentTracking: this.consentTracking,
          },
        },
      ],
    });

    if (("success" in response) && response.success === "false") {
      throw new ConfigurationError(response.error);
    }

    $.export("$summary", `Successfully added contact ${this.email} to the mailing list`);
    return response;
  },
};
