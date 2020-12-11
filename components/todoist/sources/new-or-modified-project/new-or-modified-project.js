const todoist = require("../../todoist.app.js");

module.exports = {
  key: "todoist-new-or-modified-project",
  name: "New or Modified Project",
  description: "Emit an event for each new or modified project",
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
            summary: element.name
          })
        })
      }
    }

    this.db.set("sync_token", result.sync_token)
  },
};
