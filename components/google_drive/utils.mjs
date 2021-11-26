import fs from "fs";
import { axios } from "@pipedream/platform";
import { MY_DRIVE_VALUE } from "./constants.mjs";

/**
 * Returns whether the specified drive ID corresponds to the authenticated
 * user's My Drive or not
 *
 * @param {String} drive the ID value of a Google Drive
 * @returns `true` only when the specified drive is the user's 'My Drive'
 */
function isMyDrive(drive) {
  return drive === MY_DRIVE_VALUE;
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

/**
 * Returns a file stream from a file URL or file path to be used in Google Drive
 * API calls
 *
 * @param {Object} opts - an object containing options for getting a file stream
 * @param {String} opts.fileUrl - the url of a file to download to a Readable
 * stream
 * @param {String} opts.filePath - the path to a file from which to create a
 * Readable stream
 * @returns {stream.Readable} a Readable stream from the file URL or file path
 */
async function getFileStream({
  $, fileUrl, filePath,
}) {
  return fileUrl
    ? (await axios($ ?? this, {
      url: fileUrl,
      method: "GET",
      responseType: "stream",
    }))
    : fs.createReadStream(filePath);
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

export {
  MY_DRIVE_VALUE,
  isMyDrive,
  getDriveId,
  getListFilesOpts,
  getFileStream,
  omitEmptyStringValues,
};
