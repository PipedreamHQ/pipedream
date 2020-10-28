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
      async options({ page, prevContext }) {
        const params = {
          count: 20,
          offset: Object.keys(prevContext).length != 0 ? prevContext.offset : 0,
        };
        const results = await this.hubspot.getLists(params);
        const options = results.lists.map((result) => {
          const label = result.name;
          return {
            label,
            value: JSON.stringify({ label, value: result.listId }),
          };
        });
        let offset = params.offset + params.count;
        return {
          options,
          context: { offset },
        };
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
      }
    }
  },
  async run(event) {
    for (let list of this.lists) {
      list = JSON.parse(list);
      const params = {
        count: 20,
      };

      let hasMore = true;

      while (hasMore) {
        let contacts = await this.hubspot.getListContacts(list.value, params);
        hasMore = contacts["has-more"];
        if (hasMore) params.vidOffset = contacts["vid-offset"];
        for (const contact of contacts.contacts) {
          this.$emit(contact, this.generateMeta(contact, list));
        }
      }
    }
  },
};