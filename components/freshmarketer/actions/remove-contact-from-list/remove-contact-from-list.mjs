import { ConfigurationError } from "@pipedream/platform";
import freshmarketer from "../../freshmarketer.app.mjs";

export default {
  key: "freshmarketer-remove-contact-from-list",
  name: "Remove Contact From List",
  description: "Removes a contact from a specific list by email or contact ID. [See the documentation](https://developers.freshworks.com/crm/api/#remove_contact_from_list)",
  version: "0.0.2",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    freshmarketer,
    listId: {
      propDefinition: [
        freshmarketer,
        "listId",
      ],
    },
    contactId: {
      propDefinition: [
        freshmarketer,
        "contactId",
        ({ listId }) => ({
          listId,
        }),
      ],
      optional: true,
    },
    contactEmail: {
      propDefinition: [
        freshmarketer,
        "contactEmail",
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    if ((!this.contactId && !this.contactEmail) || (this.contactId && this.contactEmail)) {
      throw new ConfigurationError("You must provide either a Contact ID or a Contact Email.");
    }

    let contactId = this.contactId;

    if (!contactId && this.contactEmail) {
      const searchResponse = await this.freshmarketer.searchContactByEmail({
        data: {
          filter_rule: [
            {
              attribute: "contact_email.email",
              operator: "is_in",
              value: this.contactEmail,
            },
          ],
        },
      });

      if (searchResponse.contacts.length) {
        contactId = searchResponse.contacts[0].id;
      } else {
        throw new Error("Contact not found with the provided email.");
      }
    }

    const response = await this.freshmarketer.removeContactFromList({
      $,
      listId: this.listId,
      data: {
        ids: [
          contactId,
        ],
      },
    });

    $.export("$summary", `Successfully removed contact from list with ID: ${this.listId}`);

    return response;
  },
};
