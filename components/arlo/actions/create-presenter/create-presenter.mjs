import arlo from "../../arlo.app.mjs";

export default {
  key: "arlo-create-presenter",
  name: "Create Presenter",
  description: "Create a new Arlo contact record to be used as a presenter. FirstName, LastName, and Email are required. Returns the created contact including its ID. Example: call with `firstName: \"Kevin\"`, `lastName: \"Malone\"`, `email: \"kevin.malone@example.com\"` to create a new active contact and get back its `ContactID`. [See the documentation](https://developer.arlo.co/doc/api/2012-02-01/auth/resources/contacts#collection-httppost).",
  version: "0.0.2",
  type: "action",
  ai: "optimized",
  annotations: {
    readOnlyHint: false,
    destructiveHint: false,
    openWorldHint: true,
  },
  props: {
    arlo,
    firstName: {
      propDefinition: [
        arlo,
        "firstName",
      ],
    },
    lastName: {
      propDefinition: [
        arlo,
        "lastName",
      ],
    },
    email: {
      propDefinition: [
        arlo,
        "email",
      ],
    },
    phoneWork: {
      propDefinition: [
        arlo,
        "phoneWork",
      ],
    },
    phoneMobile: {
      propDefinition: [
        arlo,
        "phoneMobile",
      ],
    },
    phoneHome: {
      propDefinition: [
        arlo,
        "phoneHome",
      ],
    },
    codePrimary: {
      type: "string",
      label: "Primary Code",
      description: "Optional primary code identifier for the contact (max 50 characters).",
      optional: true,
    },
  },
  async run({ $ }) {
    const rawContact = await this.arlo.createContact({
      $,
      data: {
        FirstName: this.firstName,
        LastName: this.lastName,
        Email: this.email,
        PhoneWork: this.phoneWork,
        PhoneMobile: this.phoneMobile,
        PhoneHome: this.phoneHome,
        CodePrimary: this.codePrimary,
      },
    });
    const contact = this.arlo._unwrapItem(rawContact, "Contact");
    const contactId = contact?.ContactID ?? contact?.ID ?? contact?.id;
    $.export("$summary", `Created presenter ${this.firstName} ${this.lastName}${contactId
      ? ` (ID: ${contactId})`
      : ""}`);
    return contact;
  },
};
