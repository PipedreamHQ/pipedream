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
  methods: {
    ...drive.methods,
    ...base.methods,
    async activateHook(channelID) {
      return this.googleSheets.activateHook(
        channelID,
        this.http.endpoint,
        this.googleSheets.getDriveId(this.watchedDrive),
      );
    },
    async getAllWorksheetIds(sheetID) {
      const { sheets } = await this.googleSheets.getSpreadsheet(sheetID);
      return sheets
        .map(({ properties }) => properties)
        .filter(({ sheetType }) => sheetType === "GRID")
        .map(({ sheetId }) => (sheetId.toString()));
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
  },
  async run(event) {
    if (event.timestamp) {
      // Component was invoked by timer
      return this.renewSubscription();
    }

    if (!this.isEventRelevant(event)) {
      console.log("Sync notification, exiting early");
      return;
    }

    const spreadsheet = await this.googleSheets.getSpreadsheet(this.sheetID);

    return this.processSpreadsheet(spreadsheet);
  },
};
