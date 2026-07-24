const WRITE_DISPOSITION = {
  WRITE_TRUNCATE: "WRITE_TRUNCATE",
  WRITE_APPEND: "WRITE_APPEND",
};

const DATA_SOURCE_ID = {
  SCHEDULED_QUERY: "scheduled_query",
};

// See: https://cloud.google.com/logging/docs/reference/v2/rest/v2/entries/list
const LOG_ENTRY_ORDER_BY = {
  TIMESTAMP_DESC: "timestamp desc",
  TIMESTAMP_ASC: "timestamp asc",
};

// Max results requested per page when manually paginating list calls
const MAX_PAGE_SIZE = 1000;

// See: https://cloud.google.com/nodejs/docs/reference/storage/latest/storage/getsignedurlconfig
const SIGNED_URL_ACTION = {
  READ: "read",
  WRITE: "write",
  DELETE: "delete",
  RESUMABLE: "resumable",
};

export default {
  WRITE_DISPOSITION,
  DATA_SOURCE_ID,
  LOG_ENTRY_ORDER_BY,
  MAX_PAGE_SIZE,
  SIGNED_URL_ACTION,
};
