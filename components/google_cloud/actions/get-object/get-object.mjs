import googleCloud from "../../google_cloud.app.mjs";

export default {
  name: "Get Object",
  version: "0.0.5",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  key: "google_cloud-get-object",
  type: "action",
  description: "Downloads an object from a Google Cloud Storage bucket, [See the docs](https://googleapis.dev/nodejs/storage/latest/File.html#get)",
  props: {
    googleCloud,
    bucketName: {
      propDefinition: [
        googleCloud,
        "bucketName",
      ],
    },
    fileName: {
      label: "File name",
      description: "The name of the file will be retrieved from GCS",
      type: "string",
      propDefinition: [
        googleCloud,
        "fileNames",
        (configuredProps) => ({
          bucketName: configuredProps.bucketName,
        }),
      ],
    },
    destination: {
      label: "Destination",
      description: "Destination file path on '/tmp', [See how to work with files](https://pipedream.com/docs/v1/workflows/steps/code/nodejs/working-with-files/)",
      type: "string",
    },
  },
  async run({ $ }) {
    const {
      bucketName,
      fileName,
      destination,
    } = this;
    const options = {
      destination,
    };
    await this.googleCloud.storageClient()
      .bucket(bucketName)
      .file(fileName)
      .download(options);
    $.export("$summary", `${bucketName}/${fileName} downloaded to ${destination}`);
  },
};
