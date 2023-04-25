import common from "../common/count-based.mjs";

export default {
  ...common,
  key: "recreation_gov-new-recreation-area-added",
  name: "New Recreation Area Added Event",
  description: "Emit new events when a new recreation area is added to the Recreation.gov database. [See the documentation](https://ridb.recreation.gov/docs#/Recreation%20Areas/getRecAreas)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getResourceFnConfig() {
      return {
        resourceFn: this.app.getRecAreas,
        resourceKey: "RECDATA",
      };
    },
    getMeta(item) {
      return {
        ts: new Date().getTime(),
        id: parseInt(item.RecAreaID),
        summary: `New recreation area(${item.RecAreaName}) was added to RDIB`,
      };
    },
    async getItem(item) {
      return this.app.getRecArea({
        recAreaId: parseInt(item.RecAreaID),
      });
    },
  },
};
