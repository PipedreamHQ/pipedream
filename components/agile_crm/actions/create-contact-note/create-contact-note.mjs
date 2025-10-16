import agileCrm from "../../agile_crm.app.mjs";

export default {
  key: "agile_crm-create-contact-note",
  name: "Create Contact Note",
  description: "Adds a note to a contact. [See the documentation](https://github.com/agilecrm/rest-api#41-create-a-note-and-relate-that-to-contacts-)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    agileCrm,
    contacts: {
      propDefinition: [
        agileCrm,
        "contact",
      ],
      type: "string[]",
      label: "Contacts",
      description: "An array of contact identifiers to add the note to",
    },
    subject: {
      propDefinition: [
        agileCrm,
        "noteSubject",
      ],
    },
    description: {
      propDefinition: [
        agileCrm,
        "noteDescription",
      ],
    },
  },
  async run({ $ }) {
    const contacts = Array.isArray(this.contacts)
      ? this.contacts
      : JSON.parse(this.contacts);

    const response = await this.agileCrm.createContactNote({
      data: {
        contact_ids: contacts,
        subject: this.subject,
        description: this.description,
      },
      $,
    });

    if (response) {
      $.export("$summary", `Successfully added note to ${contacts.length} contact${contacts.length === 1
        ? ""
        : "s"}`);
    }

    return response;
  },
};
