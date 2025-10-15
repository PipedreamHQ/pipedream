import googleCloud from "../../google_cloud.app.mjs";

export default {
  name: "Get Bucket Metadata",
  version: "0.0.6",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  key: "google_cloud-get-bucket",
  type: "action",
  description: "Gets Google Cloud Storage bucket metadata. [See the docs](https://googleapis.dev/nodejs/storage/latest/Bucket.html#getMetadata).",
  props: {
    googleCloud,
    bucketName: {
      propDefinition: [
        googleCloud,
        "bucketName",
      ],
    },
  },
  async run({ $ }) {
    const { bucketName } = this;
    const [
      resp,
    ] = await this.googleCloud.storageClient()
      .bucket(bucketName)
      .getMetadata();
    $.export("$summary", `"${bucketName}" metadata successfully retrieved`);
    return resp;
  },
};
