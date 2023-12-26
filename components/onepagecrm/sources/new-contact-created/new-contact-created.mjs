import onepagecrm from "../../onepagecrm.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "onepagecrm-new-contact-created",
  name: "New Contact Created",
  description: "Emits an event each time a new contact is created in OnePageCRM. [See the documentation](https://developer.onepagecrm.com/api/)",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    onepagecrm,
    db: "$.service.db",
    http: {
      type: "$.interface.http",
      customResponse: true,
    },
    newContactTriggerSorting: {
      propDefinition: [
        onepagecrm,
        "newContactTriggerSorting",
      ],
    },
  },
  hooks: {
    async deploy() {
      const contacts = await this.onepagecrm.listContacts({
        sort_by: "created_at",
        order: "desc",
        per_page: 50,
      });

      contacts.forEach((contact) => {
        this.$emit(contact, {
          id: contact.id,
          summary: `New contact: ${contact.first_name} ${contact.last_name}`,
          ts: new Date(contact.created_at).getTime(),
        });
      });

      const mostRecentContact = contacts[0];
      if (mostRecentContact) {
        this.db.set("lastCreatedAt", new Date(mostRecentContact.created_at).getTime());
      }
    },
    async activate() {
      // Create a webhook subscription here if needed
    },
    async deactivate() {
      // Delete the webhook subscription here if needed
    },
  },
  async run(event) {
    const { body } = event;
    if (!body) {
      this.http.respond({
        status: 404,
        body: "No data received",
      });
      return;
    }

    const createdAt = new Date(body.created_at).getTime();
    const lastCreatedAt = this.db.get("lastCreatedAt");

    if (createdAt <= lastCreatedAt) {
      console.log("Skipping duplicate or older contact");
      return;
    }

    this.db.set("lastCreatedAt", createdAt);

    this.$emit(body, {
      id: body.id,
      summary: `New contact: ${body.first_name} ${body.last_name}`,
      ts: createdAt,
    });

    this.http.respond({
      status: 200,
      body: "Event processed",
    });
  },
};
