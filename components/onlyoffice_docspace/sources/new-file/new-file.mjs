import constants from "../../common/constants.mjs";
import common from "../common/polling.mjs";

export default {
  ...common,
  key: "onlyoffice_docspace-new-file",
  name: "New File Created",
  description: "Emit new event when a new file is created. [See the documentation](https://api.onlyoffice.com/docspace/method/files/get/api/2.0/files/%40root).",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    sortFn(a, b) {
      return new Date(b.created) - new Date(a.created);
    },
    getResourcesName() {
      return constants.RESOURCE_NAME.FILES;
    },
    getResourcesFn() {
      return this.app.listMyFilesAndFolders;
    },
    getResourcesFnArgs() {
      return {
        debug: true,
        params: {
          filterType: constants.FILTER_TYPE.FILES_ONLY,
          withsubfolders: true,
        },
      };
    },
    generateMeta(resource) {
      return {
        id: resource.id,
        summary: `New File: ${resource.title}`,
        ts: Date.parse(resource.created),
      };
    },
  },
};
