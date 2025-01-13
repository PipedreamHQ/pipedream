import clearBooks from "../../clear_books.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "clear_books-create-client",
  name: "Create Client",
  description: "Creates a new client in Clear Books. [See the documentation]()",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    clear_books: {
      type: "app",
      app: "clear_books",
    },
    createClientName: {
      propDefinition: [
        "clear_books",
        "createClientName",
      ],
    },
    createClientContactDetails: {
      propDefinition: [
        "clear_books",
        "createClientContactDetails",
      ],
    },
    createClientNotes: {
      propDefinition: [
        "clear_books",
        "createClientNotes",
      ],
      optional: true,
    },
    createClientTags: {
      propDefinition: [
        "clear_books",
        "createClientTags",
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    const data = {
      name: this.createClientName,
      contact_details: this.createClientContactDetails.map(JSON.parse),
    };

    if (this.createClientNotes) {
      data.notes = this.createClientNotes;
    }

    if (this.createClientTags) {
      data.tags = this.createClientTags;
    }

    const client = await this.clear_books.createClient(data);
    $.export("$summary", `Created client ${client.name} with ID ${client.id}`);
    return client;
  },
};
