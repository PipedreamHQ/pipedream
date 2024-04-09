const BASE_URL = "https://api.cloudconvert.com";
const VERSION_PATH = "/v2";
const LAST_CREATED_AT = "lastCreatedAt";
const DEFAULT_MAX = 600;
const WEBHOOK_ID = "webhookId";
const SECRET = "secret";

const TASK_STATUS = {
  WAITING: "waiting",
  PROCESSING: "processing",
  FINISHED: "finished",
  ERROR: "error",
};

const TASK_OPERATION = {
  CONVERT: "convert",
  IMPORT_S3: "import/s3",
  OPTIMIZE: "optimize",
  CAPTURE_WEB: "capture-website",
  EXPORT_URL: "export/url",
  ARCHIVE: "archive",
  IMPORT_URL: "import/url",
  MERGE: "merge",
};

export default {
  BASE_URL,
  VERSION_PATH,
  DEFAULT_MAX,
  LAST_CREATED_AT,
  WEBHOOK_ID,
  SECRET,
  TASK_STATUS,
  TASK_OPERATION,
};
