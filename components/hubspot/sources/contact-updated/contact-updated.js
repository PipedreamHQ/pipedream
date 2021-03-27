const common = require("../common.js");

module.exports = {
  ...common,
  key: "hubspot-contact-updated",
  name: "Contact Updated",
  description: "Emits an event each time a contact is updated.",
  version: "0.0.1",
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
      const { id, properties, updatedAt } = contact;
      const ts = Date.parse(updatedAt);
      return {
        id: `${id}${ts}`,
        summary: `${properties.firstname} ${properties.lastname}`,
        ts,
      };
    },
    emitEvent(contact) {
      const meta = this.generateMeta(contact);
      this.$emit(contact, meta);
    },
    isRelevant(contact, updatedAfter) {
      return Date.parse(contact.updatedAt) > updatedAfter;
    },
  },
  async run(event) {
    const updatedAfter =
      this.db.get("updatedAfter") || Date.parse(this.hubspot.monthAgo());
    const data = {
      limit: 100,
      sorts: [
        {
          propertyName: "lastmodifieddate",
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
      updatedAfter
    );
    this.db.set("updatedAfter", Date.now());
  },
};