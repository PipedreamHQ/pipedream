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
  description: "Permanently delete an object from a Google Cloud Storage bucket. This cannot be undone. [See the documentation](https://cloud.google.com/nodejs/docs/reference/storage/latest/storage/file#_google_cloud_storage_File_delete_member_1_)",
  type: "action",
  props: {
    googleCloud,
    bucketName: {
      label: "Bucket name",
      description: "The name of the bucket that contains the object, e.g. `my-bucket`. Run the **List Buckets** action to find valid bucket names.",
      type: "string",
    },
    fileName: {
      label: "File name",
      description: "The name of the object to delete, e.g. `path/to/file.txt`. Run the **Search Objects** action to find valid object names.",
      type: "string",
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
