import googleCloud from "../../google_cloud.app.mjs";

export default {
  name: "Upload An Object",
  version: "0.0.5",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  key: "google_cloud-upload-object",
  type: "action",
  description: "Upload an object to a Google Cloud Storage bucket, [See the docs](https://googleapis.dev/nodejs/storage/latest/Bucket.html#upload)",
  props: {
    googleCloud,
    bucketName: {
      propDefinition: [
        googleCloud,
        "bucketName",
      ],
    },
    source: {
      label: "Source",
      description: "Source file path on '/tmp', [See how to work with files](https://pipedream.com/docs/v1/workflows/steps/code/nodejs/working-with-files/)",
      type: "string",
    },
    destination: {
      label: "Destination",
      description: "Destination file path on Google Cloud Storage bucket",
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
