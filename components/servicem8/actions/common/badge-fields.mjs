import { allOptional } from "../../common/action-schema.mjs";

/**
 * ServiceM8 badge create/update body fields.
 * Aligned with [Create badges](https://developer.servicem8.com/reference/createbadges)
 * and [Update badges](https://developer.servicem8.com/reference/updatebadges).
 */
export const badgeCreateFields = [
  {
    prop: "name",
    api: "name",
    type: "string",
    label: "Name",
    description:
      "Display name (required by API; max 50 characters). Examples: Warranty, VIP, Take Payment Facilities.",
  },
  {
    prop: "automaticallyAllocated",
    api: "automatically_allocated",
    type: "string",
    label: "Automatically Allocated",
    optional: true,
  },
  {
    prop: "fileName",
    api: "file_name",
    type: "string",
    label: "File Name",
    optional: true,
  },
  {
    prop: "regardingFormUuid",
    api: "regarding_form_uuid",
    type: "string",
    label: "Regarding Form UUID",
    optional: true,
  },
  {
    prop: "regardingAssetTypeUuid",
    api: "regarding_asset_type_uuid",
    type: "string",
    label: "Regarding Asset Type UUID",
    optional: true,
    description:
      "Asset type this badge is associated with; only used for asset-based badges.",
  },
];

export const badgeUpdateFields = allOptional(badgeCreateFields);
