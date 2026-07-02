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

// Max entries the Logging entries.list API returns per page
const LOG_ENTRIES_MAX_PAGE_SIZE = 1000;

export default {
  WRITE_DISPOSITION,
  DATA_SOURCE_ID,
  LOG_ENTRY_ORDER_BY,
  LOG_ENTRIES_MAX_PAGE_SIZE,
};
