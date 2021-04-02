const common = require("../common.js");

module.exports = {
  ...common,
  key: "hubspot-new-contact",
  name: "New Contacts",
  description: "Emits an event for each new contact added.",
  version: "0.0.2",
  dedupe: "unique",
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
    isRelevant(contact, createdAfter) {
      return Date.parse(contact.createdAt) > createdAfter;
    },
  },
  async run(event) {
    const createdAfter = this._getAfter();
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

    this._setAfter(Date.now());
  },
};