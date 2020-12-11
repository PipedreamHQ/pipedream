const todoist = require("../../todoist.app.js");

module.exports = {
  key: "todoist-sync-resources",
  name: "Sync Resources",
  description: "Emit updates for your selected resources",
  version: "0.0.1",
  props: {
    todoist,
    includeResourceTypes: { propDefinition: [todoist, "includeResourceTypes"] },
    excludeResourceTypes: { propDefinition: [todoist, "excludeResourceTypes"] },
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
    
    let emitCount = 0

    const result = await this.todoist.sync({
      resource_types: JSON.stringify(this.includeResourceTypes),
      sync_token,
    })

    for (const property in result) {
      if(Array.isArray(result[property])) {
        result[property].forEach(element => {
          let data = {}
          data.resource = property
          data.data = element
          this.$emit(data, {
            summary: property
          })
          emitCount++
        })
      }
    }

    console.log(`Emitted ${emitCount} events.`)

    this.db.set("sync_token", result.sync_token)
  },
};
