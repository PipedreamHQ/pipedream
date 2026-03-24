import servicem8 from "../../servicem8.app.mjs";

export default {
  key: "servicem8-create-badge",
  name: "Create Badge",
  description: "Create a badge. [See the documentation](https://developer.servicem8.com/reference/createbadges)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    servicem8,
    name: {
      type: "string",
      label: "Name",
      description:
        "Display name (required by API; max 50 characters). Examples: Warranty, VIP, Take Payment Facilities.",
    },
    automaticallyAllocated: {
      type: "string",
      label: "Automatically Allocated",
      optional: true,
      description: "Whether the badge is auto-assigned when criteria match (API string/flag).",
    },
    fileName: {
      type: "string",
      label: "File Name",
      optional: true,
      description: "Badge image or asset file name in ServiceM8.",
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
      description:
        "Asset type this badge is associated with; only used for asset-based badges.",
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
    const {
      body, recordUuid,
    } = await this.servicem8.createBadge({
      $,
      data: {
        name: this.name,
        automatically_allocated: this.automaticallyAllocated,
        file_name: this.fileName,
        regarding_form_uuid: this.regardingFormUuid,
        regarding_asset_type_uuid: this.regardingAssetTypeUuid,
      },
    });
    $.export("$summary", `Created Badge${recordUuid
      ? ` (${recordUuid})`
      : ""}`);
    return {
      body,
      recordUuid,
    };
  },
};
