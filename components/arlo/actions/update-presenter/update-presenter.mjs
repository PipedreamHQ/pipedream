// x-pd-ai: optimized
import arlo from "../../arlo.app.mjs";

export default {
  key: "arlo-update-presenter",
  name: "Update Presenter",
  description: "Update an existing Arlo presenter (contact) record. Only the fields you provide are changed (applied as a partial PATCH diff). Run **List Presenters** first to find a valid `presenterId`. Example: call with `presenterId: \"102\"`, `email: \"jim.halpert@athlead.com\"` to change just that contact's email and leave all other fields untouched. [See the documentation](https://developer.arlo.co/doc/api/2012-02-01/auth/resources/contacts#collection-httpget).",
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
      type: "string",
      label: "First Name",
      description: "Optional. New first name (max 32 characters).",
      optional: true,
    },
    lastName: {
      type: "string",
      label: "Last Name",
      description: "Optional. New last name (max 32 characters).",
      optional: true,
    },
    email: {
      type: "string",
      label: "Email",
      description: "Optional. New email address (max 128 characters).",
      optional: true,
    },
    phoneWork: {
      type: "string",
      label: "Work Phone",
      description: "Optional. New work phone number (max 32 characters).",
      optional: true,
    },
    phoneMobile: {
      type: "string",
      label: "Mobile Phone",
      description: "Optional. New mobile phone number (max 32 characters).",
      optional: true,
    },
    phoneHome: {
      type: "string",
      label: "Home Phone",
      description: "Optional. New home phone number (max 32 characters).",
      optional: true,
    },
  },
  async run({ $ }) {
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
