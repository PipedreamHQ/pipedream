import googleCloud from "../../google_cloud.app.mjs";

export default {
  name: "Upload An Object",
  version: "0.0.1",
  key: "google_cloud-upload-object",
  type: "action",
  description: "Upload an object to a GCS bucket",
  props: {
    googleCloud,
    bucketName: {
      propDefinition: [
        googleCloud,
        "bucketName",
      ],
    },
    source: {
      label: "Destination",
      description: "Source file path on '/tmp', [See how to work with files](https://pipedream.com/docs/v1/workflows/steps/code/nodejs/working-with-files/)",
      type: "string",
    },
    destination: {
      label: "Destination",
      description: "aaa",
      type: "string",
    },
  },
  async run({ $ }) {
    const {
      bucketName,
      source,
      destination,
    } = this;
    const options = {
      destination,
    };
    await this.googleCloud.storageClient()
      .bucket(bucketName)
      .upload(source, options);
    $.export("$summary", `${source} uploaded to ${bucketName}`);
  },
};
