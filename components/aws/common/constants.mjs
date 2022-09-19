const dynamodb = {
  keyTypes: {
    HASH: "HASH",
    RANGE: "RANGE",
  },
  billingModes: {
    PROVISIONED: "PROVISIONED",
    PAY_PER_REQUEST: "PAY_PER_REQUEST",
  },
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
  returnValues: {
    ALL_NEW: "ALL_NEW",
    ALL_OLD: "ALL_OLD",
    NONE: "NONE",
    UPDATED_NEW: "UPDATED_NEW",
    UPDATED_OLD: "UPDATED_OLD",
  },
};

export default {
  dynamodb,
};
