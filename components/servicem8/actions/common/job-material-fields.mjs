import { allOptional } from "../../common/action-schema.mjs";

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
];

export const jobMaterialUpdateFields = allOptional(jobMaterialCreateFields);
