const activecampaign = require("../../activecampaign.app.js");

module.exports = {
  name: "New Contact Task",
  key: "activecampaign-new-contact-task",
  description: "Emits an event each time a new contact task is created.",
  version: "0.0.1",
  dedupe: "unique",
  props: {
    activecampaign,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: 60 * 15,
      },
    },
    contacts: { propDefinition: [activecampaign, "contacts"] },
  },
  async run() {
    const params = {
      "filters[reltype]": "Subscriber",
    };
    const limit = 100; // limit of tasks per page
    let offset = 0; // offset for pagination
    let largestPreviousId = this.db.get("largestPreviousId") || 0; // largest task ID seen in previous runs
    let largestId = 0; // largest task ID seen during this run
    let total = limit; // total tasks retrieved in a page
    while (total == limit) {
      const tasks = (await this.activecampaign.listTasks(limit, offset, params))
        .dealTasks;
      for (const task of tasks) {
        if (parseInt(task.id) > largestId) largestId = parseInt(task.id);
        if (parseInt(task.id) <= largestPreviousId) continue;
        if (this.contacts.length > 0 && !this.contacts.includes(task.relid))
          continue;
        this.$emit(task, {
          id: task.id,
          summary: task.title,
          ts: Date.now(),
        });
      }
      total = tasks.length;
      offset += limit;
    }
    this.db.set("largestPreviousId", largestId);
  },
};