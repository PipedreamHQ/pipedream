import elastic_email from "../../elastic_email.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "elastic_email-add-contact",
  name: "Add Contact to Mailing List",
  description: "Adds a new contact to a mailing list. [See the documentation]()",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    elastic_email: {
      type: "app",
      app: "elastic_email",
    },
    addContactEmail: {
      propDefinition: [
        elastic_email,
        "addContactEmail",
      ],
    },
    addContactListName: {
      propDefinition: [
        elastic_email,
        "addContactListName",
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.elastic_email.addContact();
    if (this.addContactListName) {
      $.export(
        "$summary",
        `Successfully added contact ${this.addContactEmail} to the mailing list ${this.addContactListName}`,
      );
    } else {
      $.export(
        "$summary",
        `Successfully added contact ${this.addContactEmail} to the mailing list`,
      );
    }
    return response;
  },
};
