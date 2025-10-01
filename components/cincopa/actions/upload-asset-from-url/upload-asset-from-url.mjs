import app from "../../cincopa.app.mjs";

export default {
  key: "cincopa-upload-asset-from-url",
  name: "Upload Asset From URL",
  description: "Upload an asset from an input URL to a Cincopa gallery. [See the documentation](https://www.cincopa.com/media-platform/api-documentation-v2#asset_upload_from_url)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    input: {
      type: "string",
      label: "Input URL",
      description: "Input URL for the source asset to upload",
    },
    fid: {
      propDefinition: [
        app,
        "fid",
      ],
    },
    type: {
      type: "string",
      label: "Type",
      description: "Type of the attached asset",
      optional: true,
    },
  },
  methods: {
    uploadAssetFromUrl(args = {}) {
      return this.app._makeRequest({
        path: "/asset.upload_from_url.json",
        ...args,
      });
    },
  },
  async run({ $ }) {
    const {
      uploadAssetFromUrl,
      input,
      fid,
      type,
    } = this;

    const response = await uploadAssetFromUrl({
      $,
      params: {
        input,
        fid,
        type,
      },
    });

    $.export("$summary", `Successfully uploaded asset from URL with status ID \`${response.status_id}\``);
    return response;
  },
};
