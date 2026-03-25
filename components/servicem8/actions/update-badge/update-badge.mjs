import servicem8 from "../../servicem8.app.mjs";

export default {
  key: "servicem8-update-badge",
  name: "Update Badge",
  description: "Update a badge (loads the record, merges your fields, then POSTs). [See the documentation](https://developer.servicem8.com/reference/updatebadges)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    servicem8,
    uuid: {
      type: "string",
      label: "Badge to update",
      description:
        "Pick a badge from the dropdown (type to search) or paste a UUID.",
      useQuery: true,
      async options({
        $, prevContext, query,
      }) {
        return this.servicem8._uuidOptionsForResource({
          $: $ ?? this,
          resource: "badge",
          prevContext,
          query,
        });
      },
    },
    name: {
      type: "string",
      label: "Name",
      optional: true,
      description: "Display name (max 50 characters).",
    },
    fileName: {
      type: "string",
      label: "File Name",
      optional: true,
      description: "Badge image or asset file name in ServiceM8.",
      useQuery: true,
      async options({
        $, prevContext, query,
      }) {
        return this.servicem8._badgeFileNameOptionsFromAssets({
          $: $ ?? this,
          prevContext,
          query,
        });
      },
    },
    regardingFormUuid: {
      type: "string",
      label: "Regarding Form UUID",
      optional: true,
      description: "Linked form UUID when the badge relates to a specific form.",
      useQuery: true,
      async options({
        $, prevContext, query,
      }) {
        return this.servicem8._uuidOptionsForResource({
          $: $ ?? this,
          resource: "form",
          prevContext,
          query,
        });
      },
    },
    regardingAssetTypeUuid: {
      type: "string",
      label: "Regarding Asset Type UUID",
      optional: true,
      description: "Asset type this badge is associated with; only used for asset-based badges.",
      useQuery: true,
      async options({
        $, prevContext, query,
      }) {
        return this.servicem8._uuidOptionsForResource({
          $: $ ?? this,
          resource: "assettype",
          prevContext,
          query,
        });
      },
    },
  },
  async run({ $ }) {
    const response = await this.servicem8.updateBadge({
      $,
      uuid: this.uuid,
      data: {
        name: this.name,
        file_name: this.fileName,
        regarding_form_uuid: this.regardingFormUuid,
        regarding_asset_type_uuid: this.regardingAssetTypeUuid,
      },
    });
    $.export("$summary", `Updated Badge ${this.uuid}`);
    return response;
  },
};
