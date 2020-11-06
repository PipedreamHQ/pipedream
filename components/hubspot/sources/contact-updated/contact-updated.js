const hubspot = require("../../hubspot.app.js");

module.exports = {
  key: "hubspot-contact-updated",
  name: "Contact Updated",
  description: "Emits an event each time a contact is updated.",
  version: "0.0.1",
  props: {
    hubspot,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: 60 * 15,
      },
    },
  },
  methods: {
    generateMeta(contact, updatedAt) {
      return {
        id: `${contact.id}${updatedAt.getTime()}`,
        summary: `${contact.properties.firstname} ${contact.properties.lastname}`,
        ts: updatedAt.getTime(),
      };
    },
  },
  async run(event) {
    const lastRun = this.db.get("updatedAfter") || this.hubspot.monthAgo();
    const updatedAfter = new Date(lastRun);
    const data = {
      limit: 100,
      sorts: [
        {
          propertyName: "hs_lastmodifieddate",
          direction: "DESCENDING",
        },
      ],
    };

    let done = false;
    let count = 0;
    let total = 1;

    while (!done && count < total) {
      let contacts = await this.hubspot.searchCRM(data, "contacts");
      total = contacts.total;
      if (contacts.paging) data.after = contacts.paging.next.after;
      for (const contact of contacts.results) {
        let updatedAt = new Date(contact.updatedAt);
        if (updatedAt.getTime() > updatedAfter.getTime()) {
          this.$emit(contact, this.generateMeta(contact, updatedAt));
        } else {
          // don't need to continue if we've gotten to contacts already evaluated
          done = true;
        }
        count++;
      }
    }

    this.db.set("updatedAfter", Date.now());
  },
};