const todoist = require("../../todoist.app.js");

module.exports = {
  key: "todoist-completed-task",
  name: "Completed Task",
  description: "Emit an event for each completed task",
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
  dedupe: "unique",
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
          let matchingProject = await this.todoist.isProjectInList(element.project_id, this.selectProjects)
          if(element.checked === 1 && matchingProject) {
            let dedupeId = `${element.id}-${(new Date(element.date_completed)).getTime()}`
            this.$emit(element, {
              summary: element.content,
              id: dedupeId, 
            })
          } 
        }
      }
    } 

    this.db.set("sync_token", result.sync_token)
  },
};
