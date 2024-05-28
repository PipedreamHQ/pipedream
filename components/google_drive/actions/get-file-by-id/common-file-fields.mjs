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
  // {
  //   label:
  //     "Text to be indexed for the file to improve fullText queries. This is limited to 128KB in length and may contain HTML elements.",
  //   value: "contentHints.indexableText",
  // },
  // {
  //   label:
  //     "A thumbnail for the file. This will only be used if Google Drive cannot generate a standard thumbnail.",
  //   value: "contentHints.thumbnail",
  // },
  // {
  //   label:
  //     "The thumbnail data encoded with URL-safe Base64 (RFC 4648 section 5).A base64-encoded string.",
  //   value: "contentHints.thumbnail.image",
  // },
  // {
  //   label: "The MIME type of the thumbnail.",
  //   value: "contentHints.thumbnail.mimeType",
  // },
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
  // {
  //   label:
  //     "Whether the current user can move children of this folder outside of the shared drive. This is false when the item is not a folder. Only populated for items in shared drives.",
  //   value: "capabilities.canMoveChildrenOutOfDrive",
  // },
  // {
  //   label:
  //     "Whether the current user can read the shared drive to which this file belongs. Only populated for items in shared drives.",
  //   value: "capabilities.canReadDrive",
  // },
  // {
  //   label:
  //     "Whether the current user can edit this file. Other factors may limit the type of changes a user can make to a file. For example, see canChangeCopyRequiresWriterPermission or canModifyContent.",
  //   value: "capabilities.canEdit",
  // },
  // {
  //   label:
  //     "Whether the current user can copy this file. For an item in a shared drive, whether the current user can copy non-folder descendants of this item, or this item itself if it is not a folder.",
  //   value: "capabilities.canCopy",
  // },
  // {
  //   label: "Whether the current user can comment on this file.",
  //   value: "capabilities.canComment",
  // },
  // {
  //   label:
  //     "Whether the current user can add children to this folder. This is always false when the item is not a folder.",
  //   value: "capabilities.canAddChildren",
  // },
  // {
  //   label: "Whether the current user can delete this file.",
  //   value: "capabilities.canDelete",
  // },
  // {
  //   label: "Whether the current user can download this file.",
  //   value: "capabilities.canDownload",
  // },
  // {
  //   label:
  //     "Whether the current user can list the children of this folder. This is always false when the item is not a folder.",
  //   value: "capabilities.canListChildren",
  // },
  // {
  //   label:
  //     "Whether the current user can remove children from this folder. This is always false when the item is not a folder. For a folder in a shared drive, use canDeleteChildren or canTrashChildren instead.",
  //   value: "capabilities.canRemoveChildren",
  // },
  // {
  //   label: "Whether the current user can rename this file.",
  //   value: "capabilities.canRename",
  // },
  // {
  //   label: "Whether the current user can move this file to trash.",
  //   value: "capabilities.canTrash",
  // },
  // {
  //   label:
  //     "Whether the current user can read the revisions resource of this file. For a shared drive item, whether revisions of non-folder descendants of this item, or this item itself if it is not a folder, can be read.",
  //   value: "capabilities.canReadRevisions",
  // },
  // {
  //   label:
  //     "Whether the current user can change the copyRequiresWriterPermission restriction of this file.",
  //   value: "capabilities.canChangeCopyRequiresWriterPermission",
  // },
  // {
  //   label: "Whether the current user can restore this file from trash.",
  //   value: "capabilities.canUntrash",
  // },
  // {
  //   label: "Whether the current user can modify the content of this file.",
  //   value: "capabilities.canModifyContent",
  // },
  // {
  //   label:
  //     "Whether the current user can delete children of this folder. This is false when the item is not a folder. Only populated for items in shared drives.",
  //   value: "capabilities.canDeleteChildren",
  // },
  // {
  //   label:
  //     "Whether the current user can trash children of this folder. This is false when the item is not a folder. Only populated for items in shared drives.",
  //   value: "capabilities.canTrashChildren",
  // },
  // {
  //   label:
  //     "Whether the current user can move this item outside of this drive by changing its parent. Note that a request to change the parent of the item may still fail depending on the new parent that is being added.",
  //   value: "capabilities.canMoveItemOutOfDrive",
  // },
  // {
  //   label:
  //     "Whether the current user can add a parent for the item without removing an existing parent in the same request. Not populated for shared drive files.",
  //   value: "capabilities.canAddMyDriveParent",
  // },
  // {
  //   label:
  //     "Whether the current user can remove a parent from the item without adding another parent in the same request. Not populated for shared drive files.",
  //   value: "capabilities.canRemoveMyDriveParent",
  // },
  // {
  //   label:
  //     "Whether the current user can move this item within this drive. Note that a request to change the parent of the item may still fail depending on the new parent that is being added and the parent that is being removed.",
  //   value: "capabilities.canMoveItemWithinDrive",
  // },
  // {
  //   label:
  //     "Whether the current user can modify the sharing settings for this file.",
  //   value: "capabilities.canShare",
  // },
  // {
  //   label:
  //     "Whether the current user can move children of this folder within this drive. This is false when the item is not a folder. Note that a request to move the child may still fail depending on the current user's access to the child and to the destination folder.",
  //   value: "capabilities.canMoveChildrenWithinDrive",
  // },
  // {
  //   label:
  //     "Whether the current user can add a folder from another drive (different shared drive or My Drive) to this folder. This is false when the item is not a folder. Only populated for items in shared drives.",
  //   value: "capabilities.canAddFolderFromAnotherDrive",
  // },
  // {
  //   label:
  //     "Whether the current user can change the securityUpdateEnabled field on link share metadata.",
  //   value: "capabilities.canChangeSecurityUpdateEnabled",
  // },
  // {
  //   label:
  //     "Whether the current user is the pending owner of the file. Not populated for shared drive files.",
  //   value: "capabilities.canAcceptOwnership",
  // },
  // {
  //   label: "Whether the current user can read the labels on the file.",
  //   value: "capabilities.canReadLabels",
  // },
  // {
  //   label: "Whether the current user can modify the labels on the file.",
  //   value: "capabilities.canModifyLabels",
  // },
  // {
  //   label:
  //     "Whether the current user can add or modify content restrictions on the file which are editor restricted.",
  //   value: "capabilities.canModifyEditorContentRestriction",
  // },
  // {
  //   label:
  //     "Whether the current user can add or modify content restrictions which are owner restricted.",
  //   value: "capabilities.canModifyOwnerContentRestriction",
  // },
  // {
  //   label:
  //     "Whether there is a content restriction on the file that can be removed by the current user.",
  //   value: "capabilities.canRemoveContentRestriction",
  // },
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
  // {
  //   label: "Whether a flash was used to create the photo.",
  //   value: "imageMediaMetadata.flashUsed",
  // },
  // {
  //   label: "The metering mode used to create the photo.",
  //   value: "imageMediaMetadata.meteringMode",
  // },
  // {
  //   label: "The type of sensor used to create the photo.",
  //   value: "imageMediaMetadata.sensor",
  // },
  // {
  //   label: "The exposure mode used to create the photo.",
  //   value: "imageMediaMetadata.exposureMode",
  // },
  // {
  //   label: "The color space of the photo.",
  //   value: "imageMediaMetadata.colorSpace",
  // },
  // {
  //   label: "The white balance mode used to create the photo.",
  //   value: "imageMediaMetadata.whiteBalance",
  // },
  // {
  //   label: "The width of the image in pixels.",
  //   value: "imageMediaMetadata.width",
  // },
  // {
  //   label: "The height of the image in pixels.",
  //   value: "imageMediaMetadata.height",
  // },
  // {
  //   label: "Geographic location information stored in the image.",
  //   value: "imageMediaMetadata.location",
  // },
  // {
  //   label: "The latitude stored in the image.",
  //   value: "imageMediaMetadata.location.latitude",
  // },
  // {
  //   label: "The longitude stored in the image.",
  //   value: "imageMediaMetadata.location.longitude",
  // },
  // {
  //   label: "The altitude stored in the image.",
  //   value: "imageMediaMetadata.location.altitude",
  // },
  // {
  //   label:
  //     "The number of clockwise 90 degree rotations applied from the image's original orientation.",
  //   value: "imageMediaMetadata.rotation",
  // },
  // {
  //   label: "The date and time the photo was taken (EXIF DateTime).",
  //   value: "imageMediaMetadata.time",
  // },
  // {
  //   label: "The make of the camera used to create the photo.",
  //   value: "imageMediaMetadata.cameraMake",
  // },
  // {
  //   label: "The model of the camera used to create the photo.",
  //   value: "imageMediaMetadata.cameraModel",
  // },
  // {
  //   label: "The length of the exposure, in seconds.",
  //   value: "imageMediaMetadata.exposureTime",
  // },
  // {
  //   label: "The aperture used to create the photo (f-number).",
  //   value: "imageMediaMetadata.aperture",
  // },
  // {
  //   label:
  //     "The focal length used to create the photo, in millimeters.",
  //   value: "imageMediaMetadata.focalLength",
  // },
  // {
  //   label: "The ISO speed used to create the photo.",
  //   value: "imageMediaMetadata.isoSpeed",
  // },
  // {
  //   label: "The exposure bias of the photo (APEX value).",
  //   value: "imageMediaMetadata.exposureBias",
  // },
  // {
  //   label:
  //     "\The smallest f-number of the lens at the focal length used to create the photo (APEX value).",
  //   value: "imageMediaMetadata.maxApertureValue",
  // },
  // {
  //   label: "The distance to the subject of the photo, in meters.",
  //   value: "imageMediaMetadata.subjectDistance",
  // },
  // {
  //   label: "The lens used to create the photo.",
  //   value: "imageMediaMetadata.lens",
  // },
  {
    label:
      "\"videoMediaMetadata\" - Additional metadata about video media. This may not be available immediately upon upload.",
    value: "videoMediaMetadata",
  },
  // {
  //   label: "The width of the video in pixels.",
  //   value: "videoMediaMetadata.width",
  // },
  // {
  //   label: "The height of the video in pixels.",
  //   value: "videoMediaMetadata.height",
  // },
  // {
  //   label: "The duration of the video in milliseconds.",
  //   value: "videoMediaMetadata.durationMillis",
  // },
  {
    label:
      "\"shortcutDetails\" - Shortcut file details. Only populated for shortcut files.",
    value: "shortcutDetails",
  },
  // {
  //   label: "The ID of the file that this shortcut points to.",
  //   value: "shortcutDetails.targetId",
  // },
  // {
  //   label:
  //     "The MIME type of the file that this shortcut points to. The value of this field is a snapshot of the target's MIME type, captured when the shortcut is created.",
  //   value: "shortcutDetails.targetMimeType",
  // },
  // {
  //   label: "The ResourceKey for the target file.",
  //   value: "shortcutDetails.targetResourceKey",
  // },
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
  // {
  //   label: "Whether the file is eligible for security update.",
  //   value: "linkShareMetadata.securityUpdateEligible",
  // },
  // {
  //   label: "Whether the security update is enabled for this file.",
  //   value: "linkShareMetadata.securityUpdateEnabled",
  // },
  {
    label: "\"labelInfo\" - An overview of the labels on the file.",
    value: "labelInfo",
  },
  // {
  //   label:
  //     "The set of labels on the file as requested by the label IDs in the includeLabels parameter. By default, no labels are returned.",
  //   value: "labelInfo.labels",
  // },
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
