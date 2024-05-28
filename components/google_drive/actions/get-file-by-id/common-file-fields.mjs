/* eslint-disable max-len */
export const FILE_FIELD_OPTIONS = [
  {
    label:
      "\"kind\" - Identifies what kind of resource this is. Value: the fixed string \"drive#file\".",
    value: "kind",
  },
  {
    label:
      "\"driveId\" - ID of the shared drive the file resides in. Only populated for items in shared drives.",
    value: "driveId",
  },
  {
    label:
      "\"fileExtension\" - The final component of fullFileExtension. This is only available for files with binary content in Google Drive.",
    value: "fileExtension",
  },
  {
    label:
      "\"copyRequiresWriterPermission\" - Whether the options to copy, print, or download this file, should be disabled for readers and commenters.",
    value: "copyRequiresWriterPermission",
  },
  {
    label:
      "\"md5Checksum\" - The MD5 checksum for the content of the file. This is only applicable to files with binary content in Google Drive.",
    value: "md5Checksum",
  },
  {
    label:
      "\"contentHints\" - Additional information about the content of the file. These fields are never populated in responses.",
    value: "contentHints",
  },
  {
    label:
      "\"writersCanShare\" - Whether users with only writer permission can modify the file's permissions. Not populated for items in shared drives.",
    value: "writersCanShare",
  },
  {
    label: "\"viewedByMe\" - Whether the file has been viewed by this user.",
    value: "viewedByMe",
  },
  {
    label:
      "\"mimeType\" - The MIME type of the file. Google Drive attempts to automatically detect an appropriate value from uploaded content, if no value is provided.",
    value: "mimeType",
  },
  {
    label:
      "\"exportLinks\" - Links for exporting Docs Editors files to specific formats.",
    value: "exportLinks",
  },
  {
    label:
      "\"parents\" - The IDs of the parent folders which contain the file.",
    value: "parents",
  },
  {
    label:
      "\"thumbnailLink\" - A short-lived link to the file's thumbnail, if available.",
    value: "thumbnailLink",
  },
  {
    label: "\"iconLink\" - A static, unauthenticated link to the file's icon.",
    value: "iconLink",
  },
  {
    label:
      "\"shared\" - Whether the file has been shared. Not populated for items in shared drives.",
    value: "shared",
  },
  {
    label: "\"lastModifyingUser\" - The last user to modify the file.",
    value: "lastModifyingUser",
  },
  {
    label:
      "\"owners\" - The owner of this file. Only certain legacy files may have more than one owner. This field isn't populated for items in shared drives.",
    value: "owners",
  },
  {
    label:
      "\"headRevisionId\" - The ID of the file's head revision. This is currently only available for files with binary content in Google Drive.",
    value: "headRevisionId",
  },
  {
    label:
      "\"sharingUser\" - The user who shared the file with the requesting user, if applicable.",
    value: "sharingUser",
  },
  {
    label:
      "\"webViewLink\" - A link for opening the file in a relevant Google editor or viewer in a browser.",
    value: "webViewLink",
  },
  {
    label:
      "\"webContentLink\" - A link for downloading the content of the file in a browser. This is only available for files with binary content in Google Drive.",
    value: "webContentLink",
  },
  {
    label:
      "\"size\" - Size in bytes of blobs and first party editor files. Won't be populated for files that have no size, like shortcuts and folders.",
    value: "size",
  },
  {
    label:
      "\"permissions\" - The full list of permissions for the file. This is only available if the requesting user can share the file.",
    value: "permissions",
  },
  {
    label:
      "\"hasThumbnail\" - Whether this file has a thumbnail. This does not indicate whether the requesting app has access to the thumbnail.",
    value: "hasThumbnail",
  },
  {
    label: "\"spaces\" - The list of spaces which contain the file.",
    value: "spaces",
  },
  {
    label:
      "\"folderColorRgb\" - The color for a folder or a shortcut to a folder as an RGB hex string.",
    value: "folderColorRgb",
  },
  {
    label: "\"id\" - The ID of the file.",
    value: "id",
  },
  {
    label:
      "\"name\" - The name of the file. This is not necessarily unique within a folder.",
    value: "name",
  },
  {
    label: "\"description\" - A short description of the file.",
    value: "description",
  },
  {
    label: "\"starred\" - Whether the user has starred the file.",
    value: "starred",
  },
  {
    label:
      "\"trashed\" - Whether the file has been trashed, either explicitly or from a trashed parent folder.",
    value: "trashed",
  },
  {
    label:
      "\"explicitlyTrashed\" - Whether the file has been explicitly trashed, as opposed to recursively trashed from a parent folder.",
    value: "explicitlyTrashed",
  },
  {
    label:
      "\"createdTime\" - The time at which the file was created (RFC 3339 date-time).",
    value: "createdTime",
  },
  {
    label:
      "\"modifiedTime\" - The last time the file was modified by anyone (RFC 3339 date-time).",
    value: "modifiedTime",
  },
  {
    label:
      "\"modifiedByMeTime\" - The last time the file was modified by the user (RFC 3339 date-time).",
    value: "modifiedByMeTime",
  },
  {
    label:
      "\"viewedByMeTime\" - The last time the file was viewed by the user (RFC 3339 date-time).",
    value: "viewedByMeTime",
  },
  {
    label:
      "\"sharedWithMeTime\" - The time at which the file was shared with the user, if applicable (RFC 3339 date-time).",
    value: "sharedWithMeTime",
  },
  {
    label:
      "\"quotaBytesUsed\" - The number of storage quota bytes used by the file. This includes the head revision as well as previous revisions with keepForever enabled.",
    value: "quotaBytesUsed",
  },
  {
    label:
      "\"version\" - A monotonically increasing version number for the file. This reflects every change made to the file on the server, even those not visible to the user.",
    value: "version",
  },
  {
    label:
      "\"originalFilename\" - The original filename of the uploaded content if available, or else the original value of the name field. This is only available for files with binary content in Google Drive.",
    value: "originalFilename",
  },
  {
    label:
      "\"ownedByMe\" - Whether the user owns the file. Not populated for items in shared drives.",
    value: "ownedByMe",
  },
  {
    label:
      "\"fullFileExtension\" - The full file extension extracted from the name field. May contain multiple concatenated extensions, such as \"tar.gz\". This is only available for files with binary content in Google Drive.",
    value: "fullFileExtension",
  },
  {
    label:
      "\"properties\" - A collection of arbitrary key-value pairs which are visible to all apps.Entries with null values are cleared in update and copy requests.",
    value: "properties",
  },
  {
    label:
      "\"appProperties\" - A collection of arbitrary key-value pairs which are private to the requesting app.",
    value: "appProperties",
  },
  {
    label:
      "\"isAppAuthorized\" - Whether the file was created or opened by the requesting app.",
    value: "isAppAuthorized",
  },
  {
    label:
      "\"capabilities\" - Capabilities the current user has on this file. Each capability corresponds to a fine-grained action that a user may take.",
    value: "capabilities",
  },
  {
    label:
      "\"hasAugmentedPermissions\" - Whether there are permissions directly on this file. This field is only populated for items in shared drives.",
    value: "hasAugmentedPermissions",
  },
  {
    label:
      "\"trashingUser\" - If the file has been explicitly trashed, the user who trashed it. Only populated for items in shared drives.",
    value: "trashingUser",
  },
  {
    label:
      "\"thumbnailVersion\" - The thumbnail version for use in thumbnail cache invalidation.",
    value: "thumbnailVersion",
  },
  {
    label:
      "\"trashedTime\" - The time that the item was trashed (RFC 3339 date-time). Only populated for items in shared drives.",
    value: "trashedTime",
  },
  {
    label: "\"modifiedByMe\" - Whether the file has been modified by this user.",
    value: "modifiedByMe",
  },
  {
    label:
      "\"permissionIds\" - files.list of permission IDs for users with access to this file.",
    value: "permissionIds",
  },
  {
    label:
      "\"imageMediaMetadata\" - Additional metadata about image media, if available.",
    value: "imageMediaMetadata",
  },
  {
    label:
      "\"videoMediaMetadata\" - Additional metadata about video media. This may not be available immediately upon upload.",
    value: "videoMediaMetadata",
  },
  {
    label:
      "\"shortcutDetails\" - Shortcut file details. Only populated for shortcut files.",
    value: "shortcutDetails",
  },
  {
    label:
      "\"contentRestrictions\" - Restrictions for accessing the content of the file. Only populated if such a restriction exists.",
    value: "contentRestrictions",
  },
  {
    label: "\"resourceKey\" - A key needed to access the item via a shared link.",
    value: "resourceKey",
  },
  {
    label:
      "\"linkShareMetadata\" - LinkShare related details. Contains details about the link URLs that clients are using to refer to this item.",
    value: "linkShareMetadata",
  },
  {
    label: "\"labelInfo\" - An overview of the labels on the file.",
    value: "labelInfo",
  },
  {
    label:
      "\"sha1Checksum\" - The SHA1 checksum associated with this file, if available. This field is only populated for files with content stored in Google Drive.",
    value: "sha1Checksum",
  },
  {
    label:
      "\"sha256Checksum\" - The SHA256 checksum associated with this file, if available. This field is only populated for files with content stored in Google Drive.",
    value: "sha256Checksum",
  },
];
