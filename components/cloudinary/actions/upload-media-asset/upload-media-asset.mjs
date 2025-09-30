import cloudinary from "../../cloudinary.app.mjs";

export default {
  key: "cloudinary-upload-media-asset",
  name: "Upload Media Asset",
  description: "Upload media assets such as images or videos. [See the documentation](https://cloudinary.com/documentation/image_upload_api_reference#upload_method)",
  version: "1.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    cloudinary,
    infoAlert: {
      type: "alert",
      alertType: "info",
      content: "Cloudinary offers a large amount of options to customize your asset upload. You can set any available options in the `Additional Options` prop. [See the Cloudinary documentation for more information.](https://cloudinary.com/documentation/image_upload_api_reference#upload_method)",
    },
    file: {
      type: "string",
      label: "File Path or URL",
      description: "The file to upload. You can provide a file path from the `/tmp` folder (e.g. `/tmp/myFile.jpg`) or a public file URL, among other options supported by Cloudinary ([see the documentation](https://cloudinary.com/documentation/upload_images#file_source_options) for available options).",
    },
    publicId: {
      type: "string",
      label: "Public Id",
      description: "The identifier that is used for accessing the uploaded asset. [See the documentation](https://cloudinary.com/documentation/image_upload_api_reference#upload_method) for more information.",
      optional: true,
    },
    folder: {
      type: "string",
      label: "Folder",
      description: "An optional folder name where the uploaded asset will be stored. The public ID contains the full path of the uploaded asset, including the folder name.",
      optional: true,
    },
    resourceType: {
      propDefinition: [
        cloudinary,
        "uploadResourceType",
      ],
    },
    type: {
      propDefinition: [
        cloudinary,
        "uploadDeliveryType",
      ],
    },
    accessMode: {
      propDefinition: [
        cloudinary,
        "accessMode",
      ],
    },
    tags: {
      type: "string[]",
      label: "Tags",
      description: "An array of tag names to assign to the uploaded asset for later group reference.",
      optional: true,
    },
    format: {
      type: "string",
      label: "Convert to Format",
      description: "An optional format to convert the uploaded asset to before saving in the cloud, e.g. `jpg`.",
      optional: true,
    },
    backup: {
      type: "boolean",
      label: "Backup",
      description: "Tell Cloudinary whether to [back up](https://cloudinary.com/documentation/backups_and_version_management) the uploaded asset. Overrides the default backup settings of your account.",
      optional: true,
    },
    additionalOptions: {
      type: "object",
      label: "Additional Options",
      description: "Additional parameters and their values to use in the upload. [See the documentation](https://cloudinary.com/documentation/image_upload_api_reference#upload_method) for all available options. Values will be parsed as JSON where applicable. Example: `{ \"use_filename\": true }`",
      optional: true,
    },
    syncDir: {
      type: "dir",
      accessMode: "read",
      sync: true,
      optional: true,
    },
  },
  async run({ $ }) {
    const options = {
      public_id: this.publicId,
      folder: this.folder,
      resource_type: this.resourceType,
      type: this.type,
      access_mode: this.accessMode,
      tags: this.tags,
      format: this.format,
      backup: this.backup,
      ...Object.fromEntries(Object.entries(this.additionalOptions ?? {}).map(([
        key,
        value,
      ]) => {
        try {
          return [
            key,
            JSON.parse(value),
          ];
        } catch (err) {
          return [
            key,
            value,
          ];
        }
      })),
    };

    try {
      const response = await this.cloudinary.uploadMedia(this.file, options);
      if (response) {
        $.export("$summary", "Successfully uploaded media asset");
      }
      return response;
    } catch (err) {
      throw new Error(`Cloudinary error response: ${err.error?.message ?? JSON.stringify(err)}`);
    }
  },
};
