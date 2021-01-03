const todoist = require("../../todoist.app.js");

module.exports = {
  name: "New Project",
  description: "Emit an event for each new project",
  version: "0.0.1",
  props: {
    todoist,
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: 60 * 5,
      },
    },
    db: "$.service.db",
  },
  dedupe: "greatest",
  async run(event) {
    const sync_token = this.db.get("sync_token") || '*'
    const resourceTypes = ['projects']

    const result = await this.todoist.sync({
      resource_types: JSON.stringify(resourceTypes),
      sync_token,
    })

    for (const property in result) {
      if(Array.isArray(result[property])) {
        result[property].forEach(element => {
          this.$emit(element, {
            summary: element.name,
            id: element.id,
          })
        })
      }
    }

    this.db.set("sync_token", result.sync_token)
  },
};
