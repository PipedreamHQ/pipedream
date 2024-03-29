import loopify from "../../loopify.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "loopify-create-update-contact",
  name: "Create or Update Contact",
  description: "Creates or updates a contact in Loopify. If the contact exists, it will be updated; otherwise, a new contact will be created. [See the documentation](https://api.loopify.com/docs)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    loopify,
    contact: {
      propDefinition: [
        loopify,
        "contact",
      ],
    },
    apiEntry: {
      propDefinition: [
        loopify,
        "apiEntry",
      ],
      optional: true,
    },
    flowId: {
      propDefinition: [
        loopify,
        "flowId",
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    let contactResponse;
    const existingContactResponse = await this.loopify._makeRequest({
      method: "GET",
      path: `/contacts?email=${encodeURIComponent(this.contact.email)}`,
    });

    if (existingContactResponse.length > 0) {
      // Contact exists, update it
      const existingContactId = existingContactResponse[0].id;
      contactResponse = await this.loopify._makeRequest({
        method: "PUT",
        path: `/contacts/${existingContactId}`,
        data: this.contact,
      });
      $.export("$summary", `Updated existing contact with ID ${existingContactId}`);
    } else {
      // Contact does not exist, create it
      contactResponse = await this.loopify.createOrUpdateContact({
        contact: this.contact,
      });
      $.export("$summary", `Created new contact with ID ${contactResponse.id}`);
    }

    // If an API Entry Block is specified, add the contact to it
    if (this.apiEntry && this.flowId) {
      await this.loopify.addContactToApiEntryBlock({
        contact: contactResponse,
        apiEntry: this.apiEntry,
        flowId: this.flowId,
      });
      $.export("$summary", `Added contact to API Entry Block with ID ${this.apiEntry}`);
    }

    return contactResponse;
  },
};
