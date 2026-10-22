// Jira Service Management caps the page size of each paginated `servicedeskapi`
// resource server-side, and the cap differs per resource (verified live:
// `/request` clamps to 100, `/request/{id}/comment` clamps to 50). Atlassian
// documents the cap as an implementation detail that may change, so `_paginate`
// requests this page size and then keys off the returned `isLastPage` and
// `size` rather than assuming the page it asked for is the page it got.
// https://developer.atlassian.com/cloud/jira/service-desk/rest/intro/#pagination
const PAGE_SIZE = 100;

// Atlassian's documented default page size for `/rest/api/3/user/search`.
const USER_SEARCH_PAGE_SIZE = 50;

// `/rest/api/3/user/search` serves nothing past the thousandth match, and answers
// an offset at or beyond it with an empty page whether or not more matches exist.
const USER_SEARCH_MAX_OFFSET = 1000;

// The service desk customer resource is experimental and 412s without this.
const EXPERIMENTAL_API_HEADER = {
  "X-ExperimentalApi": "opt-in",
};

// Ceiling on how many items a single action run will collect across pages.
const MAX_RESULTS_DEFAULT = 100;
const MAX_RESULTS_MIN = 1;
const MAX_RESULTS_MAX = 1000;

const REQUEST_FIELD = {
  SUMMARY: "summary",
  DESCRIPTION: "description",
};

// The axios responseType used when streaming binary attachment content.
const STREAM_RESPONSE_TYPE = "stream";

// Pipedream's /tmp directory (the default file-stash download target) is capped at 2GB
// per execution, so any attachment reported larger than this can never be downloaded.
// https://pipedream.com/docs/workflows/limits#disk
const MAX_ATTACHMENT_SIZE_BYTES = 2 * 1024 * 1024 * 1024;

// The Forms API answers 404 with this code when the request type exists but has no form.
const NO_FORM_ERROR_CODE = "REQUEST_TYPE_NOT_FOUND";

const FORM_DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;
const FORM_TIME_PATTERN = /^([01]\d|2[0-3]):[0-5]\d$/;
const FORM_NUMBER_PATTERN = /^-?\d+(\.\d+)?$/;

const FORM_QUESTION_TYPES = {
  ts: {
    name: "Short text",
    answer: "{ \"text\": \"...\" }",
    keys: [
      "text",
    ],
  },
  tl: {
    name: "Long text",
    answer: "{ \"text\": \"...\" }",
    keys: [
      "text",
    ],
  },
  te: {
    name: "Email",
    answer: "{ \"text\": \"name@example.com\" }",
    keys: [
      "text",
    ],
  },
  tu: {
    name: "URL",
    answer: "{ \"text\": \"https://example.com\" }",
    keys: [
      "text",
    ],
  },
  no: {
    name: "Number",
    answer: "{ \"text\": \"42\" }",
    keys: [
      "text",
    ],
    numeric: true,
  },
  rt: {
    name: "Paragraph",
    answer: "{ \"text\": \"...\" } or, with Is ADF Request, { \"adf\": <ADF document> }",
    keys: [
      "text",
      "adf",
    ],
  },
  pg: {
    name: "Paragraph (legacy)",
    answer: "{ \"text\": \"...\" }",
    keys: [
      "text",
    ],
  },
  da: {
    name: "Date",
    answer: "{ \"date\": \"YYYY-MM-DD\" }",
    keys: [
      "date",
    ],
  },
  dt: {
    name: "Date & time",
    answer: "{ \"date\": \"YYYY-MM-DD\", \"time\": \"HH:mm\" }",
    keys: [
      "date",
      "time",
    ],
  },
  ti: {
    name: "Time",
    answer: "{ \"time\": \"HH:mm\" }",
    keys: [
      "time",
    ],
  },
  cd: {
    name: "Dropdown",
    answer: "{ \"choices\": [\"<choice id>\"] }, plus \"text\" when the choice is marked other",
    keys: [
      "choices",
      "text",
    ],
    maxSelections: 1,
  },
  cs: {
    name: "Radio buttons",
    answer: "{ \"choices\": [\"<choice id>\"] }, plus \"text\" when the choice is marked other",
    keys: [
      "choices",
      "text",
    ],
    maxSelections: 1,
  },
  cm: {
    name: "Checkboxes",
    answer: "{ \"choices\": [\"<choice id>\", ...] }, plus \"text\" when a choice is marked other",
    keys: [
      "choices",
      "text",
    ],
  },
  cl: {
    name: "Multiselect dropdown",
    answer: "{ \"choices\": [\"<choice id>\", ...] }, plus \"text\" when a choice is marked other",
    keys: [
      "choices",
      "text",
    ],
  },
  cc: {
    name: "Cascading dropdown",
    answer: "{ \"choices\": [\"<parent choice id>\", \"<child choice id>\"] }",
    keys: [
      "choices",
    ],
    cascading: true,
  },
  us: {
    name: "Single user",
    answer: "{ \"users\": [\"<accountId>\"] }",
    keys: [
      "users",
    ],
    maxSelections: 1,
  },
  um: {
    name: "Multiple users",
    answer: "{ \"users\": [\"<accountId>\", ...] }",
    keys: [
      "users",
    ],
  },
  at: {
    name: "Attachment",
    answer: "{ \"files\": [\"<file URL or /tmp path>\", ...] }",
    keys: [
      "files",
    ],
  },
  // Atlassian documents no answer format for Assets objects, so these pass through unchecked.
  ob: {
    name: "Assets object(s)",
    answer: "Not documented by Atlassian",
  },
};

export default {
  NO_FORM_ERROR_CODE,
  FORM_DATE_PATTERN,
  FORM_TIME_PATTERN,
  FORM_NUMBER_PATTERN,
  FORM_QUESTION_TYPES,
  PAGE_SIZE,
  USER_SEARCH_PAGE_SIZE,
  USER_SEARCH_MAX_OFFSET,
  EXPERIMENTAL_API_HEADER,
  MAX_RESULTS_DEFAULT,
  MAX_RESULTS_MIN,
  MAX_RESULTS_MAX,
  REQUEST_FIELD,
  STREAM_RESPONSE_TYPE,
  MAX_ATTACHMENT_SIZE_BYTES,
};
