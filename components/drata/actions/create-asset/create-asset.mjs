import drata from "../../drata.app.mjs";

const docsLink = "https://developers.drata.com/docs/openapi/reference/operation/AssetsPublicController_createAsset/";

export default {
  key: "drata-create-asset",
  name: "Create Asset",
  description: `Create an asset. [See the documentation](${docsLink}).`,
  version: "0.0.5",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    drata,
    name: {
      type: "string",
      label: "Name",
      description: "The name of the asset",
    },
    description: {
      type: "string",
      label: "Description",
      description: "The description of the asset",
    },
    assetClassTypes: {
      type: "string[]",
      label: "Asset Class Types",
      description: "The asset class types",
      options: [
        "HARDWARE",
        "POLICY",
        "DOCUMENT",
        "PERSONNEL",
        "SOFTWARE",
        "CODE",
        "CONTAINER",
        "COMPUTE",
        "NETWORKING",
        "DATABASE",
        "STORAGE",
      ],
    },
    assetType: {
      type: "string",
      label: "Asset Type",
      description: "The asset type",
      options: [
        "PHYSICAL",
        "VIRTUAL",
      ],
    },
    ownerId: {
      propDefinition: [
        drata,
        "personnelId",
      ],
      label: "Owner ID",
      description: "The ID of the owner",
    },
    notes: {
      type: "string",
      label: "Notes",
      description: "Notes about the asset",
      optional: true,
    },
    uniqueId: {
      type: "string",
      label: "Unique ID",
      description: "Unique Id associated with this asset",
      optional: true,
    },
    removedAt: {
      type: "string",
      label: "Removed At",
      description: "The ISO 8601 datetime the asset was removed. E.g. 2021-01-01T00:00:00.000Z",
      optional: true,
    },
    externalId: {
      type: "string",
      label: "External ID",
      description: "An externally sourced unique identifier for a virtual asset",
      optional: true,
    },
    externalOwnerId: {
      type: "string",
      label: "External Owner ID",
      description: "Used to track the source of virtual assets, typically an account id",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.drata.createAsset({
      $,
      data: {
        name: this.name,
        description: this.description,
        assetClassTypes: this.assetClassTypes,
        assetType: this.assetType,
        ownerId: this.ownerId,
        notes: this.notes,
        uniqueId: this.uniqueId,
        removedAt: this.removedAt,
        externalId: this.externalId,
        externalOwnerId: this.externalOwnerId,
      },
    });
    $.export("$summary", "Succesfully created asset");
    return response;
  },
};
