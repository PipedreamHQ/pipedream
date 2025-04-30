import common from "../common/base.mjs";

export default {
  ...common,
  key: "influxdb_cloud-new-script-created",
  name: "New Script Created",
  description: "Emit new event when a new script is created. [See the documentation](https://docs.influxdata.com/influxdb3/cloud-serverless/api/v2/#operation/GetScripts)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getResourceFn() {
      return this.influxDbCloud.listScripts;
    },
    getResourceKey() {
      return "scripts";
    },
    getSummary(item) {
      return `New Script Created with ID: ${item.id}`;
    },
  },
};
