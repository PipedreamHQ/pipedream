const dynamodb = {
  // With a filter, DynamoDB's Limit counts items read, not matches, so pages are
  // never sized below this many items
  FILTER_PAGE_FLOOR: 100,
  // Upper bound on DynamoDB requests per run, so a very selective filter can't
  // read a whole table in one action call; the result says when it stopped early
  MAX_REQUESTS: 50,
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

const s3 = {
  // Pipedream's /tmp (the file-stash directory) is capped at 2 GB per execution
  MAX_DOWNLOAD_SIZE_BYTES: 2 * 1024 * 1024 * 1024,
  MAX_KEYS_PER_DOWNLOAD: 50,
  // Simultaneous GetObject streams: fast, without exhausting sockets or memory
  DOWNLOAD_CONCURRENCY: 10,
};

export default {
  dynamodb,
  s3,
};
