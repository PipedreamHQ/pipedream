import { allOptional } from "../../common/action-schema.mjs";
import { optionalParsedFloat } from "../../common/payload.mjs";

/**
 * ServiceM8 attachment (`dboattachment`) create/update body fields.
 * Aligned with [Create attachments](https://developer.servicem8.com/reference/createattachments)
 * and [Update attachments](https://developer.servicem8.com/reference/updateattachments).
 *
 * Read-only API fields (`photo_width`, `photo_height`, `extracted_info`,
 * `class_name`) are omitted from props.
 */
export const dboattachmentCreateFields = [
  {
    prop: "relatedObject",
    api: "related_object",
    type: "string",
    label: "Related Object",
    description:
      "Object type this attachment belongs to (e.g. `job`, `company`, `staff`). Lowercase.",
  },
  {
    prop: "relatedObjectUuid",
    api: "related_object_uuid",
    type: "string",
    label: "Related Object UUID",
    description:
      "UUID of the related record; must match an existing object of `related_object` type.",
  },
  {
    prop: "attachmentName",
    api: "attachment_name",
    type: "string",
    label: "Attachment Name",
    optional: true,
    description: "Display name (max 127 characters)",
  },
  {
    prop: "fileType",
    api: "file_type",
    type: "string",
    label: "File Type",
    optional: true,
    description: "File or MIME hint (max 50 characters)",
  },
  {
    prop: "attachmentSource",
    api: "attachment_source",
    type: "string",
    label: "Attachment Source",
    optional: true,
    description: "Source or kind, e.g. `INVOICE`, `QUOTE` (filtering / display)",
  },
  {
    prop: "tags",
    api: "tags",
    type: "string",
    label: "Tags",
    optional: true,
    description: "Comma-separated tags for categorization and filtering",
  },
  {
    prop: "lng",
    api: "lng",
    type: "string",
    label: "Longitude",
    optional: true,
    description: "Longitude in decimal degrees (geolocation); sent as a JSON number",
    transform: optionalParsedFloat,
  },
  {
    prop: "lat",
    api: "lat",
    type: "string",
    label: "Latitude",
    optional: true,
    description: "Latitude in decimal degrees (geolocation); sent as a JSON number",
    transform: optionalParsedFloat,
  },
  {
    prop: "isFavourite",
    api: "is_favourite",
    type: "string",
    label: "Is Favourite",
    optional: true,
    description: "Favourite flag as accepted by the API (string)",
  },
  {
    prop: "metadata",
    api: "metadata",
    type: "string",
    label: "Metadata",
    optional: true,
    description: "Additional JSON metadata (schema varies by attachment type/source)",
  },
  {
    prop: "createdByStaffUuid",
    api: "created_by_staff_uuid",
    propDefinition: "staffUuid",
    optional: true,
    description: "Staff UUID for the creating user",
  },
  {
    prop: "timestamp",
    api: "timestamp",
    type: "string",
    label: "Timestamp",
    optional: true,
  },
];

export const dboattachmentUpdateFields = allOptional(dboattachmentCreateFields);
