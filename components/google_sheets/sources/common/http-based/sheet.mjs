/* eslint-disable pipedream/required-properties-key, pipedream/required-properties-name,
  pipedream/required-properties-version, pipedream/required-properties-description,
  pipedream/required-properties-type */

import { v4 as uuid } from "uuid";

import base from "./base.mjs";
import drive from "./drive.mjs";

/**
 * This source watches for changes to a specific spreadsheet in the user's Google Drive.
 */
export default {
  ...base,
  props: {
    ...base.props,
    watchDrive: {
      type: "boolean",
      label: "Watch Drive",
      description: "Set to `true` to watch the drive for changes. May reduce rate limiting.",
      optional: true,
    },
  },
  methods: {
    ...drive.methods,
    ...base.methods,
    _getChangeToken() {
      return this.db.get("changeToken");
    },
    _setChangeToken(changeToken) {
      this.db.set("changeToken", changeToken);
    },
    async activateHook(channelID) {
      if (this.watchDrive) {
        return this.googleSheets.activateHook(
          channelID,
          this.http.endpoint,
          this.googleSheets.getDriveId(this.watchedDrive),
        );
      }
      return this.googleSheets.activateFileHook(
        channelID,
        this.http.endpoint,
        this.getSheetId(),
      );
    },
    async getAllWorksheetIds(sheetID) {
      const { sheets } = await this.googleSheets.getSpreadsheet(sheetID);
      return sheets
        .map(({ properties }) => properties)
        .filter(({ sheetType }) => sheetType === "GRID")
        .map(({ sheetId }) => (sheetId.toString()));
    },
    async isSheetRelevant() {
      const pageToken = this._getChangeToken() || this._getPageToken();
      const drive = this.googleSheets.drive();
      const { data } = await drive.changes.list({
        pageToken,
        driveId: this.googleSheets.getDriveId(this.watchedDrive),
      });
      const {
        changes, newStartPageToken,
      } = data;
      this._setChangeToken(newStartPageToken);
      return changes.some((change) => change.file.id === this.getSheetId());
    },
    async renewSubscription() {
      // Assume subscription & channelID may all be undefined at
      // this point Handle their absence appropriately.
      const subscription = this._getSubscription();
      const channelID = this._getChannelID();
      const newChannelID = uuid();

      const {
        expiration,
        resourceId,
      } =  await this.googleSheets.renewFileSubscription(
        subscription,
        this.http.endpoint,
        channelID,
        newChannelID,
        this.getSheetId(),
      );

      this._setSubscription({
        expiration,
        resourceId,
      });
      this._setChannelID(newChannelID);
    },
    async renewDriveSubscription() {
      const subscription = this._getSubscription();
      const channelID = this._getChannelID() || uuid();

      const {
        expiration,
        resourceId,
        newChannelID,
        newPageToken,
      } = await this.googleSheets.renewSubscription(
        this.watchedDrive,
        subscription,
        this.http.endpoint,
        channelID,
        this._getPageToken(),
      );

      this._setSubscription({
        expiration,
        resourceId,
      });
      this._setChannelID(newChannelID);
      this._setPageToken(newPageToken);
    },
  },
  async run(event) {
    if (event.timestamp) {
      // Component was invoked by timer
      if (this.watchDrive) {
        return this.renewDriveSubscription();
      }
      return this.renewSubscription();
    }

    if (!this.isEventRelevant(event)) {
      console.log("Sync notification, exiting early");
      return;
    }

    this.http.respond({
      status: 200,
    });

    if (this.watchDrive && !(await this.isSheetRelevant(event))) {
      console.log("Change to unwatched file, exiting early");
      return;
    }

    const spreadsheet = await this.googleSheets.getSpreadsheet(this.sheetID);

    return this.processSpreadsheet(spreadsheet);
  },
};
