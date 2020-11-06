const hubspot = require("../../hubspot.app.js");

module.exports = {
  key: "hubspot-new-contact-in-list",
  name: "New Contact in List",
  description: "Emits an event for each new contact in a list.",
  version: "0.0.1",
  dedupe: "unique",
  props: {
    hubspot,
    lists: {
      type: "string[]",
      label: "Lists",
      optional: false,
      async options() {
        const results = await this.hubspot.getLists();
        const options = results.map((result) => {
          const label = result.name;
          return {
            label,
            value: JSON.stringify({ label, value: result.listId }),
          };
        });
        return options;
      },
    },
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: 60 * 15,
      },
    },
  },
  methods: {
    generateMeta(contact, list) {
      return {
        id: `${contact.vid}${list.value}`,
        summary: `${contact.properties.firstname.value} ${contact.properties.lastname.value} added to ${list.label}`,
        ts: Date.now(),
      };
    },
  },
  async run(event) {
    const contacts = await this.hubspot.getListContacts(this.lists);
    for (const contact of contacts) {
      this.$emit(contact, this.generateMeta(contact, contact.list));
    }
  },
};