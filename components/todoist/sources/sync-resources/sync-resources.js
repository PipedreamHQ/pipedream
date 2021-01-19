const todoist = require("../../todoist.app.js");
const common = require("../common-project.js");

module.exports = {
  ...common,
  key: "todoist-sync-resources",
  name: "Sync Resources",
  description: "Emit updates for your selected resources",
  version: "0.0.1",
  props: {
    ...common.props,
    includeResourceTypes: { propDefinition: [todoist, "includeResourceTypes"] },
  },
  async run(event) {
    let emitCount = 0;

    const syncResult = await this.todoist.syncResources(
      this.db,
      this.includeResourceTypes
    );

    for (const property in syncResult) {
      if (Array.isArray(syncResult[property])) {
        syncResult[property].forEach((element) => {
          let data = {};
          data.resource = property;
          data.data = element;
          this.$emit(data, {
            summary: property,
          });
          emitCount++;
        });
      }
    }

    console.log(`Emitted ${emitCount} events.`);
  },
};