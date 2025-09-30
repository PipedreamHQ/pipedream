import frame from "../../frame.app.mjs";

export default {
  key: "frame-create-asset",
  name: "Create Asset",
  description: "Creates a new asset in Frame.io. [See the documentation](https://developer.frame.io/api/reference/operation/createAsset/)",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    frame,
    accountId: {
      propDefinition: [
        frame,
        "accountId",
      ],
    },
    assetId: {
      propDefinition: [
        frame,
        "parentAssetId",
        ({ accountId }) => ({
          accountId,
        }),
      ],
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
