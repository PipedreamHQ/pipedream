// Jira Service Management caps the page size of each paginated `servicedeskapi`
// resource server-side, and the cap differs per resource (verified live:
// `/request` clamps to 100, `/request/{id}/comment` clamps to 50). Atlassian
// documents the cap as an implementation detail that may change, so `_paginate`
// requests this page size and then keys off the returned `isLastPage` and
// `size` rather than assuming the page it asked for is the page it got.
// https://developer.atlassian.com/cloud/jira/service-desk/rest/intro/#pagination
const PAGE_SIZE = 100;

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

export default {
  PAGE_SIZE,
  MAX_RESULTS_DEFAULT,
  MAX_RESULTS_MIN,
  MAX_RESULTS_MAX,
  REQUEST_FIELD,
  STREAM_RESPONSE_TYPE,
};
