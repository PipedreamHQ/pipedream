import common from "../common/polling.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "azure_storage-blob-deleted",
  name: "Blob Deleted",
  description: "Emit new event when a blob is deleted from a specified container in Azure Storage. [See the documentation](https://learn.microsoft.com/en-us/rest/api/storageservices/list-blobs?tabs=microsoft-entra-id).",
  version: "0.0.2",
  type: "source",
  dedupe: "unique",
  props: {
    ...common.props,
    containerName: {
      propDefinition: [
        common.props.app,
        "containerName",
      ],
    },
  },
  methods: {
    ...common.methods,
    getResourcesFromResponse(response) {
      const resources = response.EnumerationResults.Blobs.Blob;
      if (!resources) {
        return [];
      }
      return Array.isArray(resources)
        ? resources
        : [
          resources,
        ];
    },
    isResourceRelevant(resource) {
      return resource?.Deleted === true;
    },
    getResourcesFn() {
      return this.app.listBlobs;
    },
    getResourcesFnArgs() {
      return {
        debug: true,
        containerName: this.containerName,
        params: {
          include: "deleted",
        },
      };
    },
    generateMeta(resource) {
      return {
        id: resource.Name,
        summary: `Blob Deleted: ${resource.Name}`,
        ts: Date.now(),
      };
    },
  },
  sampleEmit,
};
