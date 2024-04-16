import ambivo from "../../ambivo.app.mjs";

export default {
  key: "ambivo-new-contact",
  name: "New Contact Created",
  description: "Emits a new event when a new contact is created in Ambivo. [See the documentation](https://fapi.ambivo.com/docs)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    ambivo,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: 60,
      },
    },
  },
  methods: {
    generateMeta(data) {
      const {
        id, created_at,
      } = data;
      return {
        id,
        summary: `New Contact: ${id}`,
        ts: Date.parse(created_at),
      };
    },
  },
  async run() {
    const lastRunTime = this.db.get("lastRunTime") || this.timer.timestamp;
    const contacts = await this.ambivo.getNewContact();
    contacts
      .filter((contact) => Date.parse(contact.created_at) > lastRunTime)
      .forEach((contact) => {
        const meta = this.generateMeta(contact);
        this.$emit(contact, meta);
      });
    this.db.set("lastRunTime", this.timer.timestamp);
  },
};
