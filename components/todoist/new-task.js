const todoist = require("./todoist.app.js");

module.exports = {
  name: "New Task",
  description: "Emit an event for each new task",
  version: "0.0.1",
  props: {
    todoist,
    selectProjects: { propDefinition: [todoist, "selectProjects"] },
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
    const resourceTypes = ['items']

    const result = await this.todoist.sync({
      resource_types: JSON.stringify(resourceTypes),
      sync_token,
    })

    for (const property in result) {
      if(Array.isArray(result[property])) {
        for (const element of result[property]) {
          if(await this.todoist.isProjectInList(element.project_id, this.selectProjects)) {
            this.$emit(element, {
              summary: element.content,
              id: element.id,
            })
          }
        }
      }
    }

    this.db.set("sync_token", result.sync_token)
  },
};
