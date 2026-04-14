import servicem8 from "../../servicem8.app.mjs";
import { optionalBool10String } from "../../common/payload.mjs";

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
    automaticallyAllocated: {
      type: "boolean",
      label: "Automatically allocated",
      optional: true,
      description:
        "Whether the badge is automatically allocated (`automatically_allocated`).",
    },
    fileName: {
      type: "string",
      label: "File Name",
      optional: true,
      description:
        "Badge image / `file_name`. Search loads [assets](https://developer.servicem8.com/reference/listassets); value uses asset **code** when present, else **name**. Paste a custom value if needed.",
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
      label: "Regarding Form",
      optional: true,
      description:
        "Form UUID (`regarding_form_uuid`). Pick from [list forms](https://developer.servicem8.com/reference/listforms) (requires `read_forms`) or paste a UUID.",
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
      label: "Regarding Asset Type",
      optional: true,
      description:
        "Asset type UUID (`regarding_asset_type_uuid`). Pick from [list asset types](https://developer.servicem8.com/reference/listassettypes) (requires `read_assets`) or paste a UUID.",
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
        automatically_allocated: optionalBool10String(this.automaticallyAllocated),
        file_name: this.fileName,
        regarding_form_uuid: this.regardingFormUuid,
        regarding_asset_type_uuid: this.regardingAssetTypeUuid,
      },
    });
    $.export("$summary", `Updated Badge ${this.uuid}`);
    return response;
  },
};
