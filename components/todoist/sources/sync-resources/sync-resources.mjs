import common from "../common.mjs";

export default {
  ...common,
  key: "todoist-sync-resources",
  name: "Sync Resources",
  description: "Emit new updates for your selected resources. [See the docs here](https://developer.todoist.com/sync/v8/#read-resources)",
  version: "0.0.2",
  type: "source",
  props: {
    ...common.props,
    includeResourceTypes: {
      propDefinition: [
        common.props.todoist,
        "includeResourceTypes",
      ],
    },
  },
  hooks: {
    ...common.hooks,
    async deploy() {
      // Emit no more than 20 events on first run by setting a max value of 20
      const syncResult = await this.getSyncResult();
      this.emitResults(syncResult, 20);
    },
  },
  methods: {
    ...common.methods,
    async getSyncResult() {
      return this.todoist.syncResources(
        this.db,
        this.includeResourceTypes,
      );
    },
    filterResults(syncResult) {
      return syncResult;
    },
    processResults(results, max = null) {
      let emitCount = 0;
      for (const property in results) {
        if (Array.isArray(results[property])) {
          for (const element of results[property]) {
            const data = {
              resource: property,
              data: element,
            };
            this.$emit(data, {
              summary: property,
            });
            emitCount++;
            if (max && emitCount >= max) {
              return emitCount;
            }
          }
        }
      }
      return emitCount;
    },
    emitResults(results, max = null) {
      const emitCount = this.processResults(results, max);
      console.log(`Emitted ${emitCount} events.`);
    },
  },
};
