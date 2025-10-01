import app from "../../pixelbin.app.mjs";

export default {
  key: "pixelbin-upload-asset-url",
  name: "Upload Asset From URL",
  description: "Uploads an asset to Pixelbin from a given URL. [See the documentation](https://www.pixelbin.io/docs/api-docs/)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    url: {
      type: "string",
      label: "URL",
      description: "URL of the asset you want to upload.",
    },
    path: {
      propDefinition: [
        app,
        "path",
      ],
    },
    name: {
      propDefinition: [
        app,
        "name",
      ],
    },
    access: {
      propDefinition: [
        app,
        "access",
      ],
    },
    tags: {
      propDefinition: [
        app,
        "tags",
      ],
    },
    metadata: {
      propDefinition: [
        app,
        "metadata",
      ],
    },
    overwrite: {
      propDefinition: [
        app,
        "overwrite",
      ],
    },
    filenameOverride: {
      propDefinition: [
        app,
        "filenameOverride",
      ],
    },
  },
  methods: {
    uploadAssetFromUrl(args = {}) {
      return this.app.post({
        path: "/upload/url",
        ...args,
      });
    },
  },
  async run({ $ }) {
    const {
      uploadAssetFromUrl,
      url,
      path,
      name,
      access,
      tags,
      metadata,
      overwrite,
      filenameOverride,
    } = this;

    const response = await uploadAssetFromUrl({
      $,
      data: {
        url,
        path,
        name,
        access,
        tags,
        metadata,
        overwrite,
        filenameOverride,
      },
    });

    $.export("$summary", `Successfully uploaded asset with ID: \`${response._id}\`.`);
    return response;
  },
};
