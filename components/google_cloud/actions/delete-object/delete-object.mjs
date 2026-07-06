import googleCloud from "../../google_cloud.app.mjs";

export default {
  name: "Delete Object",
  version: "0.0.1",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  key: "google_cloud-delete-object",
  description: "Permanently delete an object from a Google Cloud Storage bucket. [See the documentation](https://cloud.google.com/nodejs/docs/reference/storage/latest/storage/file#_google_cloud_storage_File_delete_member_1_)",
  type: "action",
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
      description: "The name of the object to delete. You can also run the **Search Objects** action to find object names.",
      type: "string",
      propDefinition: [
        googleCloud,
        "fileNames",
        (configuredProps) => ({
          bucketName: configuredProps.bucketName,
        }),
      ],
    },
  },
  async run({ $ }) {
    await this.googleCloud.storageClient()
      .bucket(this.bucketName)
      .file(this.fileName)
      .delete();
    $.export("$summary", `Deleted \`${this.bucketName}/${this.fileName}\``);
  },
};
