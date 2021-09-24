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

module.exports = {
  MY_DRIVE_VALUE,
  isMyDrive,
  getDriveId,
};
