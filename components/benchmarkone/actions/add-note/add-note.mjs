import benchmarkone from "../../benchmarkone.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "benchmarkone-add-note",
  name: "Add Note to Contact",
  description: "Adds a note to a BenchmarkONE contact. [See the documentation]().",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    benchmarkone,
    contactId: {
      propDefinition: [
        benchmarkone,
        "contactId",
      ],
    },
    contactEmail: {
      propDefinition: [
        benchmarkone,
        "contactEmail",
      ],
      optional: true,
    },
    noteContent: {
      propDefinition: [
        benchmarkone,
        "noteContent",
      ],
    },
    firstName: {
      propDefinition: [
        benchmarkone,
        "firstName",
      ],
      optional: true,
    },
    lastName: {
      propDefinition: [
        benchmarkone,
        "lastName",
      ],
      optional: true,
    },
    email: {
      propDefinition: [
        benchmarkone,
        "email",
      ],
      optional: true,
    },
    phoneNumbers: {
      propDefinition: [
        benchmarkone,
        "phoneNumbers",
      ],
      optional: true,
    },
    addresses: {
      propDefinition: [
        benchmarkone,
        "addresses",
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    try {
      if (!this.contactId && !this.contactEmail) {
        throw new Error("Either contactId or contactEmail must be provided.");
      }

      const response = await this.benchmarkone.addNoteToContact({
        contactId: this.contactId,
        contactEmail: this.contactEmail,
        firstName: this.firstName,
        lastName: this.lastName,
        email: this.email,
        phoneNumbers: this.phoneNumbers,
        addresses: this.addresses,
        noteContent: this.noteContent,
      });

      if (response && response.contactId) {
        $.export("$summary", `Added note to contact with ID ${response.contactId}`);
      } else if (this.contactEmail) {
        $.export("$summary", `Added note to contact with email ${this.contactEmail}`);
      } else {
        $.export("$summary", "Added note to contact");
      }

      return response;
    } catch (error) {
      $.export("$summary", `Failed to add note: ${error.message}`);
      throw error;
    }
  },
};
