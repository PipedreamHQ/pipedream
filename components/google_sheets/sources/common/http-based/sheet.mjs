/* eslint-disable pipedream/required-properties-key, pipedream/required-properties-name,
  pipedream/required-properties-version, pipedream/required-properties-description,
  pipedream/required-properties-type */

import { v4 as uuid } from "uuid";

import base from "./base.mjs";

/**
 * This source watches for changes to a specific spreadsheet in the user's Google Drive.
 */
export default {
  ...base,
  hooks: {
    ...base.hooks,
    /**
     * Called when a component is created or updated. Handles all the logic
     * for starting and stopping watch notifications tied to the desired file.
     */
    async activate() {
      const channelID = this._getChannelID() || uuid();

      const {
        startPageToken,
        expiration,
        resourceId,
      } = await this.googleSheets.activateFileHook(
        channelID,
        this.http.endpoint,
        this.getSheetId(),
      );

      // Save metadata on the subscription so we can stop / renew later
      // Subscriptions are tied to Google's resourceID, "an opaque value that
      // identifies the watched resource". This value is included in request headers
      this._setSubscription({
        resourceId,
        expiration,
      });
      this._setChannelID(channelID);
      if (startPageToken) {
        this._setPageToken(startPageToken);
      }

      await this.takeSheetSnapshot();
    },
  },
  methods: {
    ...base.methods,
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
      const channelID = this._getChannelID() || uuid();

      const {
        expiration,
        resourceId,
        newChannelID,
      } =  await this.googleSheets.renewFileSubscription(
        subscription,
        this.http.endpoint,
        channelID,
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
