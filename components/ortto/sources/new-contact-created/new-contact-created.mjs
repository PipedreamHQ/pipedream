import ortto from "../../ortto.app.mjs";
import {
  axios, DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
} from "@pipedream/platform";

export default {
  key: "ortto-new-contact-created",
  name: "New Contact Created",
  description: "Emit new event when a contact is created in your Ortto account. [See the documentation](https://help.ortto.com/a-258-retrieve-one-or-more-people-get)",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    ortto,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
  },
  hooks: {
    async deploy() {
      const response = await this.ortto.getNewContacts();
      const contacts = response.contacts.slice(0, 50);

      contacts.forEach((contact) => {
        this.$emit(contact, {
          id: contact.id,
          summary: `New Contact: ${contact.fields["str::first"]} ${contact.fields["str::last"]}`,
          ts: Date.parse(contact.fields["date::created_at"]) || Date.now(),
        });
      });
    },
  },
  methods: {
    emitContact(contact) {
      this.$emit(contact, {
        id: contact.id,
        summary: `New Contact: ${contact.fields["str::first"]} ${contact.fields["str::last"]}`,
        ts: Date.parse(contact.fields["date::created_at"]) || Date.now(),
      });
    },
  },
  async run() {
    const lastId = this.db.get("lastId");
    const response = await this.ortto.getNewContacts({
      params: {
        cursor_id: lastId,
      },
    });
    const contacts = response.contacts;

    contacts.forEach((contact) => this.emitContact(contact));

    if (contacts.length > 0) {
      this.db.set("lastId", contacts[contacts.length - 1].id);
    }
  },
};
