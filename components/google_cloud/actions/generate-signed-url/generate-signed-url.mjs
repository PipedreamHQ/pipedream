import googleCloud from "../../google_cloud.app.mjs";
import constants from "../../common/constants.mjs";

export default {
  name: "Generate Signed URL",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  key: "google_cloud-generate-signed-url",
  description: "Generate a temporary signed URL that grants time-limited access to a Google Cloud Storage object, without requiring credentials. [See the documentation](https://cloud.google.com/nodejs/docs/reference/storage/latest/storage/file#_google_cloud_storage_File_getSignedUrl_member_1_)",
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
      description: "The name of the object to generate a URL for. You can also run the **Search Objects** action to find object names.",
      type: "string",
      propDefinition: [
        googleCloud,
        "fileNames",
        (configuredProps) => ({
          bucketName: configuredProps.bucketName,
        }),
      ],
    },
    action: {
      label: "Action",
      description: "The operation the signed URL will permit.",
      type: "string",
      optional: true,
      default: constants.SIGNED_URL_ACTION.READ,
      options: Object.values(constants.SIGNED_URL_ACTION),
    },
    expiresInMinutes: {
      label: "Expires In (minutes)",
      description: "How long the signed URL stays valid, in minutes (max 10080, i.e. 7 days).",
      type: "integer",
      optional: true,
      default: 60,
      min: 1,
      max: 10080,
    },
  },
  async run({ $ }) {
    const [
      url,
    ] = await this.googleCloud.storageClient()
      .bucket(this.bucketName)
      .file(this.fileName)
      .getSignedUrl({
        version: "v4",
        action: this.action,
        expires: Date.now() + (this.expiresInMinutes * 60 * 1000),
      });
    $.export("$summary", `Generated signed URL for \`${this.bucketName}/${this.fileName}\``);
    return {
      url,
    };
  },
};
