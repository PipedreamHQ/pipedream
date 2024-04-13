import frame from "../../frame.app.mjs";

export default {
  key: "frame-create-asset",
  name: "Create Asset",
  description: "Creates a new asset in Frame.io. [See the documentation](https://developer.frame.io/api/reference/operation/createAsset/)",
  version: "0.0.1",
  type: "action",
  props: {
    frame,
    assetId: {
      type: "string",
      label: "Parent Asset ID",
      description: "The ID of the parent asset (such as a folder or the project's root asset).",
    },
    type: {
      type: "string",
      label: "Type",
      description: "The type of the asset (file or folder).",
      options: [
        "file",
        "folder",
      ],
    },
    name: {
      type: "string",
      label: "Name",
      description: "The name the asset should have in Frame.io. This value does not have to match the name of the file on disk; it can be whatever you want it to be in Frame.io.",
      optional: true,
    },
    description: {
      type: "string",
      label: "Description",
      description: "Brief description of the Asset.",
      optional: true,
    },
    sourceUrl: {
      type: "string",
      label: "Source URL",
      description: "The URL of the source file.",
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      frame, assetId, sourceUrl, ...data
    } = this;
    const response = await frame.createAsset({
      $,
      assetId,
      data: {
        ...data,
        ...(sourceUrl && {
          source: {
            url: sourceUrl,
          },
        }),
      },
    });
    $.export("$summary", `Successfully created asset (ID: ${response.id})`);
    return response;
  },
};
