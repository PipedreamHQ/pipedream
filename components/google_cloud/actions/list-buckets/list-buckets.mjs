import googleCloud from "../../google_cloud.app.mjs";

export default {
  name: "List Buckets",
  version: "0.0.1",
  key: "google_cloud-list-buckets",
  type: "action",
  description: "List GCS buckets",
  props: {
    googleCloud,
  },
  async run({ $ }) {
    const [
      resp,
    ] = await this.googleCloud.storageClient().getBuckets();
    $.export("$summary", "Retrieved bucket list");
    return resp;
  },
};
