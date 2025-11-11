import common from "../common/polling.mjs";

export default {
  ...common,
  key: "onlyoffice_docspace-new-user-added",
  name: "New User Added",
  description: "Emit new event when a new user is added. [See the documentation](https://api.onlyoffice.com/docspace/api-backend/usage-api/get-simple-by-filter/).",
  version: "0.0.2",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getResourcesFn() {
      return this.app.searchUsersByExtendedFilter;
    },
    getResourcesFnArgs() {
      return {
        debug: true,
        params: {
          activationStatus: "Activated",
        },
      };
    },
    generateMeta(resource) {
      return {
        id: resource.id,
        summary: `New User: ${resource.displayName}`,
        ts: Date.now(),
      };
    },
  },
};
