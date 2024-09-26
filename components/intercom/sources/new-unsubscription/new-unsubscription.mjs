import common from "../common.mjs";

export default {
  ...common,
  key: "intercom-new-unsubscription",
  name: "New Unsubscriptions",
  description: "Emit new event each time a user unsubscribes from receiving emails.",
  version: "0.0.4",
  type: "source",
  dedupe: "unique",
  methods: {
    generateMeta({
      id, name,
    }) {
      return {
        id,
        summary: name,
        ts: Date.now(),
      };
    },
  },
  async run() {
    const data = {
      query: {
        operator: "AND",
        value: [
          {
            field: "unsubscribed_from_emails",
            operator: "=",
            value: true,
          },
          {
            field: "role",
            operator: "=",
            value: "user",
          },
        ],
      },
    };

    const results = await this.intercom.searchContacts(data);
    for (const user of results) {
      const meta = this.generateMeta(user);
      this.$emit(user, meta);
    }
  },
};
