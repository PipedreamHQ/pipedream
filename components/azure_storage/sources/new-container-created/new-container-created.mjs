import common from "../common/polling.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "azure_storage-new-container-created",
  name: "New Container Created",
  description: "Emit new event when a new container is created in the specified Azure Storage account. [See the documentation](https://learn.microsoft.com/en-us/rest/api/storageservices/list-containers2?tabs=microsoft-entra-id#Request).",
  version: "0.0.2",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getResourcesFromResponse(response) {
      const resources = response.EnumerationResults.Containers.Container;
      if (!resources) {
        return [];
      }
      return Array.isArray(resources)
        ? resources
        : [
          resources,
        ];
    },
    getResourcesFn() {
      return this.app.listContainers;
    },
    getResourcesFnArgs() {
      return {
        debug: true,
      };
    },
    generateMeta(resource) {
      return {
        id: resource.Name,
        summary: `New Container: ${resource.Name}`,
        ts: Date.now(),
      };
    },
  },
  sampleEmit,
};
