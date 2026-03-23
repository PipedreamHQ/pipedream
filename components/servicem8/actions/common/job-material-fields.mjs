import { allOptional } from "../../common/action-schema.mjs";
import { optionalBool01 } from "../../common/payload.mjs";

export const jobMaterialCreateFields = [
  {
    prop: "jobUuid",
    api: "job_uuid",
    propDefinition: "jobUuid",
  },
  {
    prop: "name",
    api: "name",
    type: "string",
    label: "Name",
    optional: true,
  },
  {
    prop: "description",
    api: "description",
    type: "string",
    label: "Description",
    optional: true,
  },
  {
    prop: "quantity",
    api: "quantity",
    type: "string",
    label: "Quantity",
    optional: true,
  },
  {
    prop: "price",
    api: "price",
    type: "string",
    label: "Price",
    optional: true,
  },
  {
    prop: "sort",
    api: "sort",
    type: "string",
    label: "Sort Order",
    optional: true,
  },
  {
    prop: "unitCost",
    api: "unit_cost",
    type: "string",
    label: "Unit Cost",
    optional: true,
    description: "Cost/purchase price per unit (distinct from the sell price)",
  },
  {
    prop: "active",
    api: "active",
    type: "boolean",
    label: "Active",
    optional: true,
    description: "When set, sends 1 (active) or 0 (inactive) to the API",
    transform: optionalBool01,
  },
];

export const jobMaterialUpdateFields = allOptional(jobMaterialCreateFields);
