import { optionalBool01 } from "../../common/payload.mjs";
import { allOptional } from "../../common/action-schema.mjs";

export const noteCreateFields = [
  {
    prop: "jobUuid",
    api: "job_uuid",
    propDefinition: "jobUuid",
  },
  {
    prop: "noteBody",
    api: "body",
    type: "string",
    label: "Body",
    description: "Note text and content",
  },
  {
    prop: "active",
    api: "active",
    type: "boolean",
    label: "Active",
    optional: true,
    transform: optionalBool01,
  },
];

export const noteUpdateFields = allOptional(noteCreateFields);
