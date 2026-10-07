/**
 * @typedef {string} UpdateType - a type of push notification as defined by
 * the [Google Drive API docs](https://bit.ly/3wcsY2X)
 */

/**
 * A new channel was successfully created. You can expect to start receiving
 * notifications for it.
 *
 * @type {UpdateType}
 */
const GOOGLE_DRIVE_NOTIFICATION_SYNC = "sync";

/**
 * A new resource was created or shared
 *
 * @type {UpdateType}
 */
const GOOGLE_DRIVE_NOTIFICATION_ADD = "add";

/**
 * An existing resource was deleted or unshared
 *
 * @type {UpdateType}
 */
const GOOGLE_DRIVE_NOTIFICATION_REMOVE = "remove";

/**
 * One or more properties (metadata) of a resource have been updated
 *
 * @type {UpdateType}
 */
const GOOGLE_DRIVE_NOTIFICATION_UPDATE = "update";

/**
 * A resource has been moved to the trash
 *
 * @type {UpdateType}
 */
const GOOGLE_DRIVE_NOTIFICATION_TRASH = "trash";

/**
 * A resource has been removed from the trash
 *
 * @type {UpdateType}
 */
const GOOGLE_DRIVE_NOTIFICATION_UNTRASH = "untrash";

/**
 * One or more new changelog items have been added
 *
 * @type {UpdateType}
 */
const GOOGLE_DRIVE_NOTIFICATION_CHANGE = "change";

/**
 * All the available Google Drive update types
 * @type {UpdateType[]}
 */
const GOOGLE_DRIVE_UPDATE_TYPES = [
  GOOGLE_DRIVE_NOTIFICATION_SYNC,
  GOOGLE_DRIVE_NOTIFICATION_ADD,
  GOOGLE_DRIVE_NOTIFICATION_REMOVE,
  GOOGLE_DRIVE_NOTIFICATION_UPDATE,
  GOOGLE_DRIVE_NOTIFICATION_TRASH,
  GOOGLE_DRIVE_NOTIFICATION_UNTRASH,
  GOOGLE_DRIVE_NOTIFICATION_CHANGE,
];
const GOOGLE_DRIVE_UPDATE_TYPE_OPTIONS = [
  {
    label: `'${GOOGLE_DRIVE_NOTIFICATION_SYNC}' - A channel was successfully created. You can expect to start receiving notifications for it.`,
    value: GOOGLE_DRIVE_NOTIFICATION_SYNC,
  },
  {
    label: `'${GOOGLE_DRIVE_NOTIFICATION_ADD}' - A resource was created or shared.`,
    value: GOOGLE_DRIVE_NOTIFICATION_ADD,
  },
  {
    label: `'${GOOGLE_DRIVE_NOTIFICATION_REMOVE}' - An existing resource was deleted or unshared.`,
    value: GOOGLE_DRIVE_NOTIFICATION_REMOVE,
  },
  {
    label: `'${GOOGLE_DRIVE_NOTIFICATION_UPDATE}' - One or more properties (metadata) of a resource have been updated.`,
    value: GOOGLE_DRIVE_NOTIFICATION_UPDATE,
  },
  {
    label: `'${GOOGLE_DRIVE_NOTIFICATION_TRASH}' - A resource has been moved to the trash.`,
    value: GOOGLE_DRIVE_NOTIFICATION_TRASH,
  },
  {
    label: `'${GOOGLE_DRIVE_NOTIFICATION_UNTRASH}' - A resource has been removed from the trash.`,
    value: GOOGLE_DRIVE_NOTIFICATION_UNTRASH,
  },
  {
    label: `'${GOOGLE_DRIVE_NOTIFICATION_CHANGE}' - One or more changelog items have been added.`,
    value: GOOGLE_DRIVE_NOTIFICATION_CHANGE,
  },
];

/**
 * This is a custom string value to represent the 'My Drive' Google Drive, which
 * is represented as `null` by the Google Drive API. In order to simplify the
 * code by avoiding null values, we assign this special value to the 'My Drive'
 * drive.
 */
const MY_DRIVE_VALUE = "My Drive";

/**
 * This is a legacy value for the `MY_DRIVE_VALUE` constant, supporting workflow configurations
 * using this value.
 */
const LEGACY_MY_DRIVE_VALUE = "myDrive";

/**
 * The maximum amount of time a subscription can be active without expiring is
 * 24 hours. In order to minimize subscription renewals (which involve the
 * execution of an event source) we set the expiration of subscriptions to its
 * maximum allowed value.
 *
 * More information can be found in the API docs:
 * https://developers.google.com/drive/api/v3/push#optional-properties
 */
const WEBHOOK_SUBSCRIPTION_EXPIRATION_TIME_MILLISECONDS = 24 * 60 * 60 * 1000;

/**
 * How often webhook sources' timer runs. Besides renewing the subscription before it
 * expires, the timer resumes a capped backlog when Drive stops sending notifications.
 */
const WEBHOOK_TIMER_INTERVAL_SECONDS = 10 * 60;

/**
 * The timer renews a subscription once it is this close to expiring, see
 * https://developers.google.com/drive/api/v3/push#optional-properties
 */
const WEBHOOK_RENEWAL_WINDOW_MILLISECONDS = 60 * 60 * 1000;

/**
 * The maximum number of path segments to include in an option label for a prop whose value is a
 * file ID. To make sure the file name is displayed in the option label in the UI, we truncate paths
 * with more than this many path segments.
 */
const MAX_FILE_OPTION_PATH_SEGMENTS = 3;

/**
 * The API response field name that carries the cursor to the next page of results in a
 * `files.list` response. When a caller supplies a custom partial-response `fields` mask
 * (e.g. `files(id,name)`) this field must also be present at the top level of the mask or
 * the do/while pagination loop silently exits after the first page.
 */
const PAGINATION_TOKEN_FIELD = "nextPageToken";

/**
 * The MIME type prefix of Google Drive MIME types as defined by the [Google
 * Drive API docs](https://developers.google.com/drive/api/v3/mime-types)
 */
const GOOGLE_DRIVE_MIME_TYPE_PREFIX = "application/vnd.google-apps";

/**
 * The MIME type of Google Drive folders as defined by the [Google Drive API
 * docs](https://developers.google.com/drive/api/v3/mime-types)
 */
const GOOGLE_DRIVE_FOLDER_MIME_TYPE = "application/vnd.google-apps.folder";

const GOOGLE_DRIVE_ROLE_OWNER = "owner";
const GOOGLE_DRIVE_ROLE_ORGANIZER = "organizer";
const GOOGLE_DRIVE_ROLE_FILEORGANIZER = "fileOrganizer";
const GOOGLE_DRIVE_ROLE_WRITER = "writer";
const GOOGLE_DRIVE_ROLE_COMMENTER = "commenter";
const GOOGLE_DRIVE_ROLE_READER = "reader";
/**
 * All of the available Google Drive roles granted by a permission as defined by the [Google
 * Drive API docs](https://developers.google.com/drive/api/v3/reference/permissions)
 */

const GOOGLE_DRIVE_ROLE_OPTIONS = [
  {
    label: "Writer - Can make changes, accept or reject suggestions, and share the file with others.",
    value: GOOGLE_DRIVE_ROLE_WRITER,
  },
  {
    label: "Commenter - Can make comments and suggestions, but can't change or share the file with others.",
    value: GOOGLE_DRIVE_ROLE_COMMENTER,
  },
  {
    label: "Viewer - Can access, but can't change or share the file with others.",
    value: GOOGLE_DRIVE_ROLE_READER,
  },
];

const GOOGLE_DRIVE_ROLE_OPTION_FILEORGANIZER = {
  label: "(Advanced) Content Manager - add, edit, move, delete and share content",
  value: GOOGLE_DRIVE_ROLE_FILEORGANIZER,
};
const GOOGLE_DRIVE_ROLE_OPTION_OWNER = {
  label: "(Advanced) File Owner - this will transfer ownership of the file.",
  value: GOOGLE_DRIVE_ROLE_OWNER,
};

const GOOGLE_DRIVE_GRANTEE_USER = "user";
const GOOGLE_DRIVE_GRANTEE_GROUP = "group";
const GOOGLE_DRIVE_GRANTEE_DOMAIN = "domain";
const GOOGLE_DRIVE_GRANTEE_ANYONE = "anyone";
/**
 * All of the available Google Drive grantee types as defined by the [Google Drive API
 * docs](https://developers.google.com/drive/api/v3/reference/permissions)
 */
const GOOGLE_DRIVE_GRANTEE_TYPES = [
  GOOGLE_DRIVE_GRANTEE_USER,
  GOOGLE_DRIVE_GRANTEE_GROUP,
  GOOGLE_DRIVE_GRANTEE_DOMAIN,
  GOOGLE_DRIVE_GRANTEE_ANYONE,
];

export const GOOGLE_DRIVE_UPLOAD_TYPE_MEDIA = "media";
export const GOOGLE_DRIVE_UPLOAD_TYPE_RESUMABLE = "resumable";
export const GOOGLE_DRIVE_UPLOAD_TYPE_MULTIPART = "multipart";
const GOOGLE_DRIVE_UPLOAD_TYPES = [
  GOOGLE_DRIVE_UPLOAD_TYPE_MEDIA,
  GOOGLE_DRIVE_UPLOAD_TYPE_RESUMABLE,
  GOOGLE_DRIVE_UPLOAD_TYPE_MULTIPART,
];
const GOOGLE_DRIVE_UPLOAD_TYPE_OPTIONS = [
  {
    label: "Simple upload. Upload the media only, without any metadata.",
    value: GOOGLE_DRIVE_UPLOAD_TYPE_MEDIA,
  },
  {
    label: "Resumable upload. Upload the file in a resumable fashion, using a series of at least two requests where the first request includes the metadata.",
    value: GOOGLE_DRIVE_UPLOAD_TYPE_RESUMABLE,
  },
  {
    label: "Multipart upload. Upload both the media and its metadata, in a single request.",
    value: GOOGLE_DRIVE_UPLOAD_TYPE_MULTIPART,
  },
];

/**
 * Maximum `pageSize` accepted by `comments.list`; larger values are coerced down
 * to this by the API.
 * https://developers.google.com/workspace/drive/api/reference/rest/v3/comments/list
 */
const COMMENTS_MAX_PAGE_SIZE = 100;

const DEFAULT_COMMENT_LIMIT = 100;

const MAX_COMMENT_LIMIT = 500;

/**
 * Maximum `pageSize` accepted by `files.list` (the API allows 1-1000).
 * https://developers.google.com/workspace/drive/api/reference/rest/v3/files/list
 */
const FILES_MAX_PAGE_SIZE = 1000;

/**
 * Default number of files **Search Files** returns per run, so an agent that omits
 * `maxResults` still gets a bounded response instead of enumerating a whole shared drive.
 */
const DEFAULT_SEARCH_FILES_LIMIT = 100;

const RETRYABLE_STATUS_CODES = [
  422,
  429,
  500,
  502,
  503,
  504,
];

const RATE_LIMIT_ERROR_REASONS = [
  "rateLimitExceeded",
  "userRateLimitExceeded",
];

const CHANGED_FILE_FIELDS = "kind,id,name,mimeType,parents,createdTime,modifiedTime,trashed,version,size,md5Checksum,webViewLink,lastModifyingUser";

// Enough to filter changes before fetching full metadata for the ones that emit
const CHANGE_FILTER_FILE_FIELDS = "id,name,mimeType,parents,createdTime,modifiedTime";

// Bounds one run's work so a backlog resumes across runs instead of failing the whole run
const MAX_CHANGES_PAGES_PER_RUN = 10;
const DEFAULT_MAX_EMITS_PER_RUN = 1000;
const MAX_EMITS_PER_RUN = 5000;

// Upper bound on per-file interval entries kept in db
const MAX_FILE_INTERVAL_ENTRIES = 2000;

// A change this long after the file's last modification is a bulk move or permission update
const MASS_CHANGE_MAX_AGE_MILLISECONDS = 60 * 60 * 1000;

/** Google Workspace types that `stashFile` can export to PDF. */
const PDF_EXPORTABLE_MIME_TYPES = [
  "application/vnd.google-apps.document",
  "application/vnd.google-apps.spreadsheet",
  "application/vnd.google-apps.presentation",
  "application/vnd.google-apps.drawing",
];

export {
  GOOGLE_DRIVE_NOTIFICATION_SYNC,
  GOOGLE_DRIVE_NOTIFICATION_ADD,
  GOOGLE_DRIVE_NOTIFICATION_REMOVE,
  GOOGLE_DRIVE_NOTIFICATION_UPDATE,
  GOOGLE_DRIVE_NOTIFICATION_TRASH,
  GOOGLE_DRIVE_NOTIFICATION_UNTRASH,
  GOOGLE_DRIVE_NOTIFICATION_CHANGE,
  GOOGLE_DRIVE_UPDATE_TYPES,
  GOOGLE_DRIVE_UPDATE_TYPE_OPTIONS,
  MY_DRIVE_VALUE,
  LEGACY_MY_DRIVE_VALUE,
  WEBHOOK_SUBSCRIPTION_EXPIRATION_TIME_MILLISECONDS,
  WEBHOOK_TIMER_INTERVAL_SECONDS,
  WEBHOOK_RENEWAL_WINDOW_MILLISECONDS,
  MAX_FILE_OPTION_PATH_SEGMENTS,
  PAGINATION_TOKEN_FIELD,
  GOOGLE_DRIVE_MIME_TYPE_PREFIX,
  GOOGLE_DRIVE_FOLDER_MIME_TYPE,
  GOOGLE_DRIVE_UPLOAD_TYPES,
  GOOGLE_DRIVE_UPLOAD_TYPE_OPTIONS,
  // Google Drive Roles
  GOOGLE_DRIVE_ROLE_OWNER,
  GOOGLE_DRIVE_ROLE_ORGANIZER,
  GOOGLE_DRIVE_ROLE_FILEORGANIZER,
  GOOGLE_DRIVE_ROLE_WRITER,
  GOOGLE_DRIVE_ROLE_COMMENTER,
  GOOGLE_DRIVE_ROLE_READER,
  GOOGLE_DRIVE_ROLE_OPTIONS,
  GOOGLE_DRIVE_ROLE_OPTION_FILEORGANIZER,
  GOOGLE_DRIVE_ROLE_OPTION_OWNER,
  // Google Drive Grantee Types
  GOOGLE_DRIVE_GRANTEE_USER,
  GOOGLE_DRIVE_GRANTEE_GROUP,
  GOOGLE_DRIVE_GRANTEE_DOMAIN,
  GOOGLE_DRIVE_GRANTEE_ANYONE,
  GOOGLE_DRIVE_GRANTEE_TYPES,
  // Comments
  COMMENTS_MAX_PAGE_SIZE,
  DEFAULT_COMMENT_LIMIT,
  MAX_COMMENT_LIMIT,
  // Files
  FILES_MAX_PAGE_SIZE,
  DEFAULT_SEARCH_FILES_LIMIT,
  // Webhooks
  RETRYABLE_STATUS_CODES,
  RATE_LIMIT_ERROR_REASONS,
  CHANGED_FILE_FIELDS,
  CHANGE_FILTER_FILE_FIELDS,
  MAX_CHANGES_PAGES_PER_RUN,
  DEFAULT_MAX_EMITS_PER_RUN,
  MAX_EMITS_PER_RUN,
  MAX_FILE_INTERVAL_ENTRIES,
  MASS_CHANGE_MAX_AGE_MILLISECONDS,
  PDF_EXPORTABLE_MIME_TYPES,
};
