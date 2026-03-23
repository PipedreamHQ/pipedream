import { optionalBool01 } from "../../common/payload.mjs";

export const dboattachmentCreateFields = [
  {
    prop: "jobUuid",
    api: "job_uuid",
    propDefinition: "jobUuid",
  },
  {
    prop: "fileName",
    api: "file_name",
    type: "string",
    label: "File Name",
    optional: true,
  },
  {
    prop: "attachmentFile",
    api: "attachment_file",
    type: "string",
    label: "Attachment File (Base64)",
    optional: true,
    description: "File content encoded as Base64 per ServiceM8 API",
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

const dboattachmentUpdateBase = [
  {
    prop: "jobUuid",
    api: "job_uuid",
    propDefinition: "jobUuid",
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
    prop: "active",
    api: "active",
    type: "boolean",
    label: "Active",
    optional: true,
    transform: optionalBool01,
  },
];

export const dboattachmentUpdateFields = dboattachmentUpdateBase;
