const common = require("../common.js");

module.exports = {
  ...common,
  key: "hubspot-new-contact",
  name: "New Contacts",
  description: "Emits an event for each new contact added.",
  version: "0.0.1",
  dedupe: "unique",
  hooks: {
    async deploy() {
      // By default, only a limited set of properties are returned from the API.
      // Get all possible contact properties to request for each contact.
      const properties = await this.hubspot.createPropertiesArray();
      this.db.set("properties", properties);
    },
  },
  methods: {
    ...common.methods,
    generateMeta(contact) {
      const { id, properties, createdAt } = contact;
      const ts = Date.parse(createdAt);
      return {
        id,
        summary: `${properties.firstname} ${properties.lastname}`,
        ts,
      };
    },
    emitEvent(contact) {
      const meta = this.generateMeta(contact);
      this.$emit(contact, meta);
    },
    isRelevant(contact, createdAfter) {
      return Date.parse(contact.createdAt) > createdAfter;
    },
  },
  async run(event) {
    const createdAfter =
      this.db.get("createdAfter") || Date.parse(this.hubspot.monthAgo());
    const data = {
      limit: 100,
      sorts: [
        {
          propertyName: "createdate",
          direction: "DESCENDING",
        },
      ],
      properties: this.db.get("properties"),
      object: "contacts",
    };

    await this.paginate(
      data,
      this.hubspot.searchCRM.bind(this),
      "results",
      createdAfter
    );

    this.db.set("createdAfter", Date.now());
  },
};