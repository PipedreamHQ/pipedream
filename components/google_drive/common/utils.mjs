import { ConfigurationError } from "@pipedream/platform";
import {
  MY_DRIVE_VALUE,
  LEGACY_MY_DRIVE_VALUE,
  MAX_FILE_OPTION_PATH_SEGMENTS,
  GOOGLE_DRIVE_MIME_TYPE_PREFIX,
} from "../common/constants.mjs";
import { Readable } from "stream";

/**
 * Returns whether the specified drive ID corresponds to the authenticated
 * user's My Drive or not
 *
 * @param {String} drive the ID value of a Google Drive
 * @returns `true` only when the specified drive is the user's 'My Drive'
 */
function isMyDrive(drive) {
  return drive === MY_DRIVE_VALUE || drive === LEGACY_MY_DRIVE_VALUE;
}

/**
 * Returns a valid Google Drive ID to be used in Google Drive API calls
 *
 * @param {String} drive the ID value of a Google Drive, as provided by the
 * `drive` prop definition of this app
 * @returns the proper Google Drive ID to be used in Google Drive API calls
 */
function getDriveId(drive) {
  return isMyDrive(drive)
    ? null
    : drive;
}

/**
 * Gets an options object to be used in functions that use the
 * [the `drive.drives.list` API](https://bit.ly/3AiWE1x).
 *
 * @param {String} drive the ID value of a Google Drive, as provided by the
 * `drive` prop definition of this app
 * @param {object} [baseOpts = {}] - an object containing extra/optional
 * parameters to be fed to the GDrive API call, as defined in [the API
 * docs](https://bit.ly/3AnQDR1)
 *
 * @returns an object containing the options
 */
function getListFilesOpts(drive, baseOpts = {}) {
  // Use default options (e.g., `corpora=drive`) for `files.list` if `drive` is
  // empty or is "My Drive". Otherwise, use the "drive" corpus and include
  // `supportsAllDrives` param.
  const opts = (!drive || isMyDrive(drive))
    ? baseOpts
    : {
      ...baseOpts,
      corpora: "drive",
      driveId: getDriveId(drive),
      includeItemsFromAllDrives: true,
      supportsAllDrives: true,
    };
  return opts;
}

function streamToBuffer(stream) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    stream.on("data", (chunk) => {
      chunks.push(chunk);
    }).on("end", () => {
      resolve(Buffer.concat(chunks));
    // eslint-disable-next-line newline-per-chained-call
    }).on("error", (err) => {
      reject(err);
    });
  });
}

function byteToMB(byte) {
  return byte / 1024 / 1024;
}

/**
 * Truncate an array of path segments from its base
 *
 * @param {String[]} pathArr - the array of path segments
 * @returns the truncated array whose first element is "..." if truncated
 */
function truncatePath(pathArr) {
  if (pathArr.length <= MAX_FILE_OPTION_PATH_SEGMENTS) {
    return pathArr;
  }
  return [
    "...",
    ...pathArr.slice(-1 * (MAX_FILE_OPTION_PATH_SEGMENTS - 1)),
  ];
}

/**
 * Builds an object mapping file IDs to arrays of file/folder ID path segments from the drive's root
 * folder to each file, using the `file.parents` property and a list of folders in the drive
 *
 * @see
 * {@link https://developers.google.com/drive/api/v3/reference/files Google Drive File Resource}
 *
 * @param {object[]} files - the array of files for which to build paths
 * @param {object[]} folders - the array of folders in the drive
 * @returns {Object.<string, string[]>} the object mapping file IDs to arrays of path segments
 */
function buildFilePaths(files = [], folders = []) {
  const folderIdToFolder = folders.reduce((acc, cur) => {
    if (cur?.id) {
      acc[cur.id] = cur;
    }
    return acc;
  }, {});
  const paths = {};
  // Recursive function that returns an array of file `id`s representing the path to a file if
  // requisite parent folders are available (in `file.parents`) to the requesting user, or an array
  // containing the file ID otherwise
  const pathToFile = (file) => {
    if (!file?.id) {
      // unretrieved folder or root folder
      return [];
    }
    if (paths[file.id] !== undefined) {
      return paths[file.id];
    }
    if (!file.parents) {
      // file belongs to a different drive and user does not have access to the parent
      return [
        file.id,
      ];
    }
    let parentPath;
    for (const parent of file.parents) {
      parentPath = pathToFile(folderIdToFolder[parent]);
      paths[parent] = parentPath;
      if (parentPath?.[0]) {
        break;
      }
    }
    return [
      ...parentPath,
      file.id,
    ];
  };
  files.forEach((file) => {
    if (file?.id) {
      paths[file.id] = pathToFile(file);
    }
  });
  return paths;
}

/**
 * Builds an object mapping file IDs to arrays of file/folder name path segments from the drive's
 * root folder to each file, using the `file.parents` property and a list of folders in the drive
 *
 * @param {object[]} files - the array of files for which to build paths
 * @param {object[]} folders - the array of folders in the drive
 * @returns {Object.<string, string[]>} the object mapping file IDs to arrays of path segments
 */
function buildFileNamePaths(files = [], folders = []) {
  const fileIdToFile = files.concat(folders).reduce((acc, cur) => {
    if (cur?.id) {
      acc[cur.id] = cur;
    }
    return acc;
  }, {});
  const fileIdToPath = buildFilePaths(files, folders);
  return Object.fromEntries(Object.entries(fileIdToPath).map(([
    id,
    path,
  ]) => ([
    id,
    path.filter((id) => fileIdToFile[id]?.name)
      .map((id) => fileIdToFile[id]?.name),
  ])));
}

/**
 * Gets an object mapping file IDs to string paths from the drive's root folder to each file, if the
 * file's `parents` are available to the requesting user
 *
 * @param {object[]} files - the array of files for which to get file paths
 * @param {object[]} folders - the array of folders in the drive
 * @returns {Object.<string, string>} the object mapping file IDs to file paths
 */
function getFilePaths(files = [], folders = []) {
  const fileIdToNamePath = buildFileNamePaths(files, folders);
  return Object.fromEntries(Object.entries(fileIdToNamePath).map(([
    id,
    path,
  ]) => ([
    id,
    truncatePath(path).join(" > "),
  ])));
}

/**
 * Return an object compose of non-empty string valued properties of `obj`
 *
 * @param {Object} obj - the source object
 * @param {String[]} [fromKeys] - keys of properties in `obj` to omit if corresponding value is
 * empty string, or all keys by default
 * @returns the new object
 */
function omitEmptyStringValues(obj, fromKeys) {
  return Object.fromEntries(
    // eslint-disable-next-line multiline-ternary,array-element-newline,array-bracket-newline
    Object.entries(obj).filter(([ k, v ]) => {
      return (fromKeys && !fromKeys.includes(k)) || v !== "";
    }),
  );
}

/**
 * A utility function that accepts a string as an argument and reformats it in
 * order to remove newline characters and consecutive spaces. Useful when
 * dealing with very long templated strings that are split into multiple lines.
 *
 * @example
 * // returns "This is a much cleaner string"
 * toSingleLineString(`
 *   This is a much
 *   cleaner string
 * `);
 *
 * @param {string}  multiLineString the input string to reformat
 * @returns a formatted string based on the content of the input argument,
 * without newlines and multiple spaces
 * Source: {@linkcode ../aws/sources/common/utils.mjs utils.mjs}.
 */
function toSingleLineString(multiLineString) {
  return multiLineString
    .trim()
    .replace(/\n/g, " ")
    .replace(/\s{2,}/g, " ");
}

function optionalParseAsJSON(value) {
  try {
    return JSON.parse(value);
  } catch (e) {
    return value;
  }
}

function parseObjectEntries(value = {}) {
  let obj;
  if (typeof value === "string") {
    try {
      obj = JSON.parse(value);
    } catch (e) {
      throw new ConfigurationError(`Invalid JSON string provided: ${e.message}`);
    }
  } else {
    obj = value;
  }
  return Object.fromEntries(
    Object.entries(obj).map(([
      key,
      value,
    ]) => [
      key,
      optionalParseAsJSON(value),
    ]),
  );
}

async function stashFile(item, googleDrive, dir) {
  const fileMetadata = await googleDrive.getFile(item.id, {
    fields: "name,mimeType",
  });
  let mimeType = fileMetadata.mimeType;
  const isWorkspaceDocument = mimeType.includes(GOOGLE_DRIVE_MIME_TYPE_PREFIX);
  if (isWorkspaceDocument) {
    mimeType = "application/pdf";
  }
  const response = isWorkspaceDocument
    ? await googleDrive.downloadWorkspaceFile(item.id, {
      mimeType,
    })
    : await googleDrive.getFile(item.id, {
      alt: "media",
    });
  // Convert stream to buffer
  const chunks = [];
  for await (const chunk of response) {
    chunks.push(chunk);
  }
  const buffer = Buffer.concat(chunks);
  // Construct a file path unique to this attachment to avoid overwriting
  // files with the same name.
  const filepath = `${item.id}/${item.name}`;
  // Upload the attachment to the configured directory (File Stash) so it
  // can be accessed later.
  const file = await dir.open(filepath).fromReadableStream(
    Readable.from(buffer),
    mimeType,
    buffer.length,
  );
  // Return file details and temporary download link:
  // { path, get_url, s3Key, type }
  return await file.withoutPutUrl().withGetUrl();
}

export {
  MY_DRIVE_VALUE,
  isMyDrive,
  getDriveId,
  getListFilesOpts,
  omitEmptyStringValues,
  toSingleLineString,
  buildFilePaths,
  getFilePaths,
  streamToBuffer,
  byteToMB,
  parseObjectEntries,
  stashFile,
};
