import common from "../common/base.mjs";

export default {
  ...common,
  key: "influxdb_cloud-new-bucket-created",
  name: "New Bucket Created",
  description: "Emit new event when a new bucket is created. [See the documentation](https://docs.influxdata.com/influxdb3/cloud-serverless/api/v2/#operation/GetBuckets)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getResourceFn() {
      return this.influxDbCloud.listBuckets;
    },
    getResourceKey() {
      return "buckets";
    },
    getSummary(item) {
      return `New Bucket Created with ID: ${item.id}`;
    },
  },
};
