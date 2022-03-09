import { createObjectFromArray } from "./utils.mjs";

const dynamodb = {
  keyTypes: createObjectFromArray([
    "HASH",
    "RANGE",
  ]),
  billingModes: createObjectFromArray([
    "PROVISIONED",
    "PAY_PER_REQUEST",
  ]),
  keyAttributeTypes: [
    {
      label: "string",
      value: "S",
    },
    {
      label: "number",
      value: "N",
    },
    {
      label: "binary",
      value: "B",
    },
  ],
  streamSpecificationViewTypes: [
    "KEYS_ONLY",
    "NEW_IMAGE",
    "OLD_IMAGE",
    "NEW_AND_OLD_IMAGES",
  ],
  returnValues: createObjectFromArray([
    "ALL_NEW",
    "ALL_OLD",
    "NONE",
    "UPDATED_NEW",
    "UPDATED_OLD",
  ]),
};

export default {
  dynamodb,
};
