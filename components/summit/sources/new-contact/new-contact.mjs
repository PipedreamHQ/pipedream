import summit from "../../summit.app.mjs";

export default {
  key: "summit-new-contact",
  name: "New Contact",
  description: "Emit new event when a visitor has identified themselves with an email address.",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    summit,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: 60 * 15, // 15 minutes
      },
    },
    email: {
      propDefinition: [
        summit,
        "email",
      ],
      optional: true,
    },
  },
  methods: {
    generateMeta(data) {
      const ts = Date.parse(data.created_at);
      return {
        id: data.id,
        summary: `New Contact: ${data.email}`,
        ts,
      };
    },
  },
  async run() {
    const since = this.db.get("since");

    const contacts = await this.summit.getContacts({
      email: this.email,
      since,
    });

    contacts.forEach((contact) => {
      this.$emit(contact, this.generateMeta(contact));
    });

    if (contacts.length > 0) {
      const lastContact = contacts[contacts.length - 1];
      this.db.set("since", lastContact.created_at);
    }
  },
};
