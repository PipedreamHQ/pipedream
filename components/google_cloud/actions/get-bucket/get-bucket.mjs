import googleCloud from "../../google_cloud.app.mjs";

export default {
  name: "Get Bucket Metadata",
  version: "0.0.1",
  key: "google_cloud-get-bucket",
  type: "action",
  description: "Gets GCS bucket metadata",
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
    $.export("$summary", `Retrieved bucket metadata : ${bucketName}`);
    return resp;
  },
};
