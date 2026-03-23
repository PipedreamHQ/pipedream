import { optionalBool01 } from "../../common/payload.mjs";

export const categoryUpdateFields = [
  {
    prop: "name",
    api: "name",
    type: "string",
    label: "Name",
    optional: true,
  },
  {
    prop: "sort",
    api: "sort",
    type: "string",
    label: "Sort",
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
