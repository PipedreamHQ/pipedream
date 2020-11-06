const hubspot = require("../../hubspot.app.js");

module.exports = {
  key: "hubspot-new-contact",
  name: "New Contacts",
  description: "Emits an event for each new contact added.",
  version: "0.0.1",
  dedupe: "unique",
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
  async run(event) {
    const lastRun = this.db.get("createdAfter") || this.hubspot.monthAgo();
    const createdAfter = new Date(lastRun);
    const data = {
      limit: 100,
      sorts: [
        {
          propertyName: "createdate",
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
        let createdAt = new Date(contact.createdAt);
        if (createdAt.getTime() > createdAfter.getTime()) {
          this.$emit(contact, {
            id: contact.id,
            summary: `${contact.properties.firstname} ${contact.properties.lastname}`,
            ts: createdAt.getTime(),
          });
        } else {
          // don't need to continue if we've gotten to contacts already evaluated
          done = true;
        }
        count++;
      }
    }

    this.db.set("createdAfter", Date.now());
  },
};