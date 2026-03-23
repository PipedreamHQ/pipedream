import { optionalBool01 } from "../../common/payload.mjs";

export const badgeUpdateFields = [
  {
    prop: "name",
    api: "name",
    type: "string",
    label: "Name",
    optional: true,
  },
  {
    prop: "badgeColour",
    api: "colour",
    type: "string",
    label: "Colour",
    optional: true,
    description: "Colour as accepted by ServiceM8 (e.g. hex)",
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
