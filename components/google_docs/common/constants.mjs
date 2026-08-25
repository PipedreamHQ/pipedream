// Maximum `pageSize` accepted by the Drive API's `comments.list`; larger values are
// coerced down to this by the API.
// https://developers.google.com/workspace/drive/api/reference/rest/v3/comments/list
const COMMENTS_MAX_PAGE_SIZE = 100;

const DEFAULT_COMMENT_LIMIT = 100;
const MAX_COMMENT_LIMIT = 500;

export {
  COMMENTS_MAX_PAGE_SIZE,
  DEFAULT_COMMENT_LIMIT,
  MAX_COMMENT_LIMIT,
};
