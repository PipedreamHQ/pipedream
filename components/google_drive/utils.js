const fs = require("fs");
const axios = require("axios");
const { MY_DRIVE_VALUE } = require("./constants");

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

function getListFilesOpts(drive, baseOpts = {}) {
  const opts = isMyDrive(drive)
    ? baseOpts
    : {
      ...baseOpts,
      corpora: drive
        ? "drive"
        : "allDrives",
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
  fileUrl, filePath,
}) {
  return fileUrl
    ? (
      await axios({
        url: fileUrl,
        method: "GET",
        responseType: "stream",
      })
    ).data
    : fs.createReadStream(filePath);
}

module.exports = {
  MY_DRIVE_VALUE,
  isMyDrive,
  getDriveId,
  getListFilesOpts,
  getFileStream,
};
