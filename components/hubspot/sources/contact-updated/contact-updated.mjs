import common from "../common.mjs";

export default {
  ...common,
  key: "hubspot-contact-updated",
  name: "Contact Updated",
  description: "Emits an event each time a contact is updated.",
  version: "0.0.3",
  type: "source",
  methods: {
    ...common.methods,
    generateMeta(contact) {
      const {
        id,
        properties,
        updatedAt,
      } = contact;
      const ts = Date.parse(updatedAt);
      return {
        id: `${id}${ts}`,
        summary: `${properties.firstname} ${properties.lastname}`,
        ts,
      };
    },
    isRelevant(contact, updatedAfter) {
      return Date.parse(contact.updatedAt) > updatedAfter;
    },
  },
  async run() {
    const updatedAfter = this._getAfter();
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
      updatedAfter,
    );
    this._setAfter(Date.now());
  },
};
