import googleCloud from "../../google_cloud.app.mjs";

export default {
  name: "List Buckets",
  version: "0.0.1",
  key: "google_cloud-list-buckets",
  type: "action",
  description: "List Google Cloud Storage buckets, [See the docs](https://googleapis.dev/nodejs/storage/latest/Storage.html#getBuckets)",
  props: {
    googleCloud,
  },
  async run({ $ }) {
    const [
      resp,
    ] = await this.googleCloud.storageClient().getBuckets();
    $.export("$summary", "Bucket list successfully fetched");
    return resp;
  },
};
