const hubspot = require("../../hubspot.app.js");

module.exports = {
  key: "hubspot-contact-property-change",
  name: "New Contact Property Change",
  description:
    "Emits an event each time the specified properties are provided or updated on a contact.",
  version: "0.0.1",
  dedupe: "unique",
  props: {
    hubspot,
    properties: {
      type: "string[]",
      label: "Properties",
      optional: false,
      async options() {
        const results = await this.hubspot.getContactProperties();
        const options = results.map((result) => {
          const label = result.label;
          return {
            label,
            value: JSON.stringify({ label, value: result.name }),
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

  async run(event) {
    const lastRun = this.db.get("updatedAfter") || this.hubspot.monthAgo();
    const updatedAfter = new Date(lastRun);

    const properties = [];
    for (let property of this.properties) {
      property = JSON.parse(property);
      properties.push(property.value);
    }
    properties.push("firstname");
    properties.push("lastname");

    const params = {
      count: 20,
      property: properties,
      propertyMode: "value_and_history",
    };

    let hasMore = true;

    while (hasMore) {
      let contacts = await this.hubspot.getRecentlyUpdatedContacts(params);
      hasMore = contacts["has-more"];
      if (hasMore) params.vidOffset = contacts["vid-offset"];
      for (const contact of contacts.contacts) {
        for (let property of this.properties) {
          property = JSON.parse(property);
          let updatedAt = new Date(
            contact.properties[property.value].versions[0].timestamp
          );
          if (updatedAt > updatedAfter) {
            this.$emit(contact, {
              id: `${contact.id}${property.value}${
                contact.properties[property.value].value
              }`,
              summary: `${contact.properties.firstname.value} ${contact.properties.lastname.value} changed ${property.label}`,
              ts: updatedAt.getTime(),
            });
          }
        }
      }
    }

    this.db.set("updatedAfter", Date.now());
  },
};