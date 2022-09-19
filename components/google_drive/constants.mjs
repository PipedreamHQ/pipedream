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
 * The default time interval between webhook subscription renewals. Since
 * subscriptions expire after 24 hours at most, we set this time to 95% of this
 * time window by default to make sure the event sources don't miss any events
 * due to an expired subscription not being renewed on time.
 *
 * More information can be found in the API docs:
 * https://developers.google.com/drive/api/v3/push#optional-properties
 */
const WEBHOOK_SUBSCRIPTION_RENEWAL_SECONDS =
  (WEBHOOK_SUBSCRIPTION_EXPIRATION_TIME_MILLISECONDS * 0.95) / 1000;

/**
 * The maximum number of path segments to include in an option label for a prop whose value is a
 * file ID. To make sure the file name is displayed in the option label in the UI, we truncate paths
 * with more than this many path segments.
 */
const MAX_FILE_OPTION_PATH_SEGMENTS = 3;

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
const GOOGLE_DRIVE_ROLES = [
  GOOGLE_DRIVE_ROLE_OWNER,
  GOOGLE_DRIVE_ROLE_ORGANIZER,
  GOOGLE_DRIVE_ROLE_FILEORGANIZER,
  GOOGLE_DRIVE_ROLE_WRITER,
  GOOGLE_DRIVE_ROLE_COMMENTER,
  GOOGLE_DRIVE_ROLE_READER,
];

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

export {
  GOOGLE_DRIVE_NOTIFICATION_SYNC,
  GOOGLE_DRIVE_NOTIFICATION_ADD,
  GOOGLE_DRIVE_NOTIFICATION_REMOVE,
  GOOGLE_DRIVE_NOTIFICATION_UPDATE,
  GOOGLE_DRIVE_NOTIFICATION_TRASH,
  GOOGLE_DRIVE_NOTIFICATION_UNTRASH,
  GOOGLE_DRIVE_NOTIFICATION_CHANGE,
  GOOGLE_DRIVE_UPDATE_TYPES,
  MY_DRIVE_VALUE,
  LEGACY_MY_DRIVE_VALUE,
  WEBHOOK_SUBSCRIPTION_EXPIRATION_TIME_MILLISECONDS,
  WEBHOOK_SUBSCRIPTION_RENEWAL_SECONDS,
  MAX_FILE_OPTION_PATH_SEGMENTS,
  GOOGLE_DRIVE_MIME_TYPE_PREFIX,
  GOOGLE_DRIVE_FOLDER_MIME_TYPE,
  GOOGLE_DRIVE_UPLOAD_TYPES,
  // Google Drive Roles
  GOOGLE_DRIVE_ROLE_OWNER,
  GOOGLE_DRIVE_ROLE_ORGANIZER,
  GOOGLE_DRIVE_ROLE_FILEORGANIZER,
  GOOGLE_DRIVE_ROLE_WRITER,
  GOOGLE_DRIVE_ROLE_COMMENTER,
  GOOGLE_DRIVE_ROLE_READER,
  GOOGLE_DRIVE_ROLES,
  // Google Drive Grantee Types
  GOOGLE_DRIVE_GRANTEE_USER,
  GOOGLE_DRIVE_GRANTEE_GROUP,
  GOOGLE_DRIVE_GRANTEE_DOMAIN,
  GOOGLE_DRIVE_GRANTEE_ANYONE,
  GOOGLE_DRIVE_GRANTEE_TYPES,
};
