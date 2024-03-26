import teamioo from "../../teamioo.app.mjs";
import {
  axios, DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
} from "@pipedream/platform";

export default {
  key: "teamioo-new-contact-added",
  name: "New Contact Added",
  description: "Emits a new event when a new contact (client) is added to a group.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    teamioo,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
    groupid: teamioo.propDefinitions.groupid,
  },
  methods: {
    ...teamioo.methods,
    async fetchContacts(groupid, since) {
      return this.teamioo._makeRequest({
        path: `/groups/${groupid}/contacts?since=${since}`,
        method: "GET",
      });
    },
    getContactId(contact) {
      // Assuming each contact has a unique ID
      return contact.id;
    },
  },
  hooks: {
    async deploy() {
      // Fetch and emit the most recent contacts for initialization
      const since = new Date().toISOString();
      const contacts = await this.fetchContacts(this.groupid, since);
      contacts.forEach((contact) => {
        this.$emit(contact, {
          id: this.getContactId(contact),
          summary: `New Contact: ${contact.name}`,
          ts: Date.parse(contact.created_at) || Date.now(),
        });
      });
      // Update `since` to the current time
      this.db.set("since", new Date().toISOString());
    },
  },
  async run() {
    const since = this.db.get("since") || new Date().toISOString();
    const contacts = await this.fetchContacts(this.groupid, since);

    contacts.forEach((contact) => {
      this.$emit(contact, {
        id: this.getContactId(contact),
        summary: `New Contact: ${contact.name}`,
        ts: Date.parse(contact.created_at) || Date.now(),
      });
    });

    // Update `since` to the current time
    this.db.set("since", new Date().toISOString());
  },
};
