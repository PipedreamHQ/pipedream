const issues = {
  states: {
    ALL: "all",
    OPENED: "opened",
    CLOSED: "closed",
  },
  stateEvents: {
    CLOSE: "close",
    REOPEN: "reopen",
  },
  scopes: {
    ALL: "all",
    CREATED_BY_ME: "created_by_me",
    ASSIGNED_TO_ME: "assigned_to_me",
  },
};

const MERGE_REQUESTS = {
  states: {
    ALL: "all",
    OPENED: "opened",
    CLOSED: "closed",
    LOCKED: "locked",
    MERGED: "merged",
  },
  scopes: {
    ALL: "all",
    CREATED_BY_ME: "created_by_me",
    ASSIGNED_TO_ME: "assigned_to_me",
    REVIEWS_FOR_ME: "reviews_for_me",
  },
  stateEvents: {
    CLOSE: "close",
    REOPEN: "reopen",
  },
  orderBy: {
    CREATED_AT: "created_at",
    UPDATED_AT: "updated_at",
    TITLE: "title",
  },
  sort: {
    ASC: "asc",
    DESC: "desc",
  },
  searchIn: {
    TITLE: "title",
    DESCRIPTION: "description",
    TITLE_AND_DESCRIPTION: "title,description",
  },
  detail: {
    SUMMARY: "summary",
    FULL: "full",
  },
};

const MAX_PER_PAGE = 100;
const DEFAULT_MAX_RESULTS = 100;

export default {
  issues,
  mergeRequests: MERGE_REQUESTS,
  MAX_PER_PAGE,
  DEFAULT_MAX_RESULTS,
};
