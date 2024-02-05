import altoviz from "../../altoviz.app.mjs";

export default {
  key: "altoviz-new-contact-instant",
  name: "New Contact Instant",
  description: "Emits an event each time a contact is created, updated or deleted in Altoviz.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    altoviz: {
      type: "app",
      app: "altoviz",
    },
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: 60,
      },
    },
    contact: {
      propDefinition: [
        altoviz,
        "contact",
      ],
    },
  },
  methods: {
    generateMeta(data) {
      const {
        id, created_at, updated_at,
      } = data;
      const ts = new Date(updated_at || created_at).getTime();
      return {
        id,
        summary: `Contact ID: ${id} ${updated_at
          ? "updated"
          : "created"}`,
        ts,
      };
    },
  },
  async run() {
    const since = this.db.get("since");

    const createdContacts = await this.altoviz.createContact(this.contact);
    for (const contact of createdContacts) {
      this.$emit(contact, this.generateMeta(contact));
    }

    const updatedContacts = await this.altoviz.updateContact(this.contact);
    for (const contact of updatedContacts) {
      this.$emit(contact, this.generateMeta(contact));
    }

    const deletedContacts = await this.altoviz.deleteContact(this.contact);
    for (const contact of deletedContacts) {
      this.$emit(contact, this.generateMeta(contact));
    }

    this.db.set("since", new Date().toISOString());
  },
};
