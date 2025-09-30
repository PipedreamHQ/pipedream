import { ConfigurationError } from "@pipedream/platform";
import benchmarkone from "../../benchmarkone.app.mjs";

export default {
  key: "benchmarkone-add-note",
  name: "Add Note to Contact",
  description: "Adds a note to a BenchmarkONE contact. [See the documentation](https://sandbox.hatchbuck.com/api/dist/#!/Notes/post_contact_email_address_or_contact_ID_notes).",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    benchmarkone,
    contactId: {
      propDefinition: [
        benchmarkone,
        "contactId",
      ],
    },
    subject: {
      type: "string",
      label: "Subject",
      description: "Subject line for the note.",
    },
    body: {
      type: "string",
      label: "Body",
      description: "Body of the note.",
    },
    copyToCompany: {
      type: "boolean",
      label: "Copy To Company",
      description: "Copy this note to the contact's associated company record.",
      optional: true,
    },
  },
  async run({ $ }) {
    try {
      const response = await this.benchmarkone.addNoteToContact({
        $,
        contactId: this.contactId,
        data: {
          subject: this.subject,
          body: this.body,
          copyToCompany: this.copyToCompany,
        },
      });

      $.export("$summary", `Added note to contact with ID ${this.contactId}`);

      return response;
    } catch (error) {
      throw new ConfigurationError(error.message);
    }
  },
};
