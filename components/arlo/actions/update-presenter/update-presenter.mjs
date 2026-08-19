// x-pd-ai: optimized
import { ConfigurationError } from "@pipedream/platform";
import arlo from "../../arlo.app.mjs";

export default {
  key: "arlo-update-presenter",
  name: "Update Presenter",
  description: "Update an existing Arlo presenter (contact) record. Only the fields you provide are changed (applied as a partial PATCH diff). Run **List Presenters** first to find a valid `presenterId`. Example: call with `presenterId: \"102\"`, `email: \"jim.halpert@athlead.com\"` to change just that contact's email and leave all other fields untouched. [See the documentation](https://developer.arlo.co/doc/api/2012-02-01/auth/resources/contacts#instance-httppatch).",
  version: "0.0.1",
  type: "action",
  annotations: {
    readOnlyHint: false,
    destructiveHint: false,
    openWorldHint: true,
  },
  props: {
    arlo,
    presenterId: {
      propDefinition: [
        arlo,
        "presenterId",
      ],
    },
    firstName: {
      propDefinition: [
        arlo,
        "firstName",
      ],
      description: "Optional. New first name (max 32 characters).",
      optional: true,
    },
    lastName: {
      propDefinition: [
        arlo,
        "lastName",
      ],
      description: "Optional. New last name (max 32 characters).",
      optional: true,
    },
    email: {
      propDefinition: [
        arlo,
        "email",
      ],
      description: "Optional. New email address (max 128 characters).",
      optional: true,
    },
    phoneWork: {
      propDefinition: [
        arlo,
        "phoneWork",
      ],
      description: "Optional. New work phone number (max 32 characters).",
    },
    phoneMobile: {
      propDefinition: [
        arlo,
        "phoneMobile",
      ],
      description: "Optional. New mobile phone number (max 32 characters).",
    },
    phoneHome: {
      propDefinition: [
        arlo,
        "phoneHome",
      ],
      description: "Optional. New home phone number (max 32 characters).",
    },
  },
  async run({ $ }) {
    if ([
      this.firstName,
      this.lastName,
      this.email,
      this.phoneWork,
      this.phoneMobile,
      this.phoneHome,
    ].every((value) => value === undefined || value === null)) {
      throw new ConfigurationError("Provide at least one field to update (firstName, lastName, email, phoneWork, phoneMobile, or phoneHome).");
    }

    const rawContact = await this.arlo.updateContact({
      $,
      contactId: this.presenterId,
      data: {
        FirstName: this.firstName,
        LastName: this.lastName,
        Email: this.email,
        PhoneWork: this.phoneWork,
        PhoneMobile: this.phoneMobile,
        PhoneHome: this.phoneHome,
      },
    });
    const contact = this.arlo._unwrapItem(rawContact, "Contact");
    $.export("$summary", `Updated presenter ${this.presenterId}`);
    return contact;
  },
};
