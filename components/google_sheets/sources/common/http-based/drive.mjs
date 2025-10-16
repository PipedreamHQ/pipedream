/* eslint-disable pipedream/required-properties-key, pipedream/required-properties-name,
  pipedream/required-properties-version, pipedream/required-properties-description,
  pipedream/required-properties-type */

import { v4 as uuid } from "uuid";

import base from "./base.mjs";

/**
 * This source watches for all changes to a shared drive, processing only
 * changes to the chosen file.
 */
export default {
  ...base,
  props: {
    // Adding googleSheets prop before watchedDrive prop because app prop must
    // be put before dependent propDefinition
    googleSheets: base.props.googleSheets,
    // Putting watchedDrive prop before ...base.props so watchedDrive appears before sheetID
    watchedDrive: {
      propDefinition: [
        base.props.googleSheets,
        "watchedDrive",
      ],
      description: "Defaults to My Drive. To select a [Shared Drive](https://support.google.com/a/users/answer/9310351) instead, select it from this list.",
      optional: false,
    },
    ...base.props,
  },
  methods: {
    ...base.methods,
    _getPageToken() {
      return this.db.get("pageToken");
    },
    _setPageToken(pageToken) {
      this.db.set("pageToken", pageToken);
    },
    async activateHook(channelID) {
      const {
        startPageToken,
        expiration,
        resourceId,
      } = await this.googleSheets.activateHook(
        channelID,
        this.http.endpoint,
        this.getDriveId(),
      );
      this._setPageToken(startPageToken);
      return {
        expiration,
        resourceId,
      };
    },
    async getModifiedSheet(pageToken, driveId, sheetID) {
      const changedFilesStream = this.googleSheets.listChanges(pageToken, driveId);
      for await (const changedFilesPage of changedFilesStream) {
        const {
          changedFiles,
          nextPageToken: newStartPageToken = pageToken,
        } = changedFilesPage;
        this._setPageToken(newStartPageToken);

        const file = changedFiles
          .filter((file) => file.mimeType.includes("spreadsheet"))
          .filter((file) => sheetID === file.id)
          .shift();

        if (file) {
          // One of the changed files is the one that the event source is
          // watching, so we can stop going through the list of changed files
          // and return the file reference at this point
          return file;
        }
      }
    },
    async getSpreadsheetToProcess(event) {
      const { headers } = event;
      const subscription = this._getSubscription();
      const channelID = this._getChannelID();
      if (!this.googleSheets.checkHeaders(headers, subscription, channelID)) {
        return;
      }

      const pageToken = this._getPageToken();
      const driveId = this.getDriveId();
      const sheetId = this.getSheetId();
      const file = await this.getModifiedSheet(
        pageToken,
        driveId,
        sheetId,
      );

      if (!file) {
        console.log("No sheets were modified");
        return;
      }

      return this.googleSheets.getSpreadsheet(sheetId);
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
      return this.renewSubscription();
    }

    if (!this.isEventRelevant(event)) {
      console.log("Sync notification, exiting early");
      return;
    }

    this.http.respond({
      status: 200,
    });

    const spreadsheet = await this.getSpreadsheetToProcess(event);

    if (!spreadsheet) {
      const sheetId = this.getSheetId();
      console.log(`Spreadsheet "${sheetId}" was not modified. Skipping event`);
      return;
    }

    return this.processSpreadsheet(spreadsheet);
  },
};
