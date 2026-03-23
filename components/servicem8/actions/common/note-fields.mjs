import { allOptional } from "../../common/action-schema.mjs";

/**
 * ServiceM8 note create/update body fields.
 * Aligned with [Create notes](https://developer.servicem8.com/reference/createnotes)
 * and [Update notes](https://developer.servicem8.com/reference/updatenotes).
 */
export const noteCreateFields = [
  {
    prop: "relatedObject",
    api: "related_object",
    type: "string",
    label: "Related Object",
    optional: true,
    description:
      "Object type this note is attached to (e.g. `job`, `company`); lowercase per API.",
  },
  {
    prop: "relatedObjectUuid",
    api: "related_object_uuid",
    type: "string",
    label: "Related Object UUID",
    optional: true,
    description: "UUID of the related record.",
  },
  {
    prop: "note",
    api: "note",
    type: "string",
    label: "Note",
    description: "Note text and content.",
  },
  {
    prop: "actionRequired",
    api: "action_required",
    type: "string",
    label: "Action Required",
    optional: true,
  },
  {
    prop: "actionCompletedByStaffUuid",
    api: "action_completed_by_staff_uuid",
    propDefinition: "staffUuid",
    optional: true,
    description: "Staff member who completed the required action.",
  },
  {
    prop: "createDate",
    api: "create_date",
    type: "string",
    label: "Create Date",
    optional: true,
    description: "Timestamp string as accepted by the API (reference field name `create_date`).",
  },
];

export const noteUpdateFields = allOptional(noteCreateFields);
