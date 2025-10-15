// This source has two interfaces:
//
// 1) The HTTP requests tied to changes in a Google Drive
// 2) A timer that runs on regular intervals, renewing the notification channel
//    as needed
//
// This is the base module for other Google Drive subscription sources, which
// should override the unimplemented methods, to create a webhook and process
// incoming events.

import { v4 as uuid } from "uuid";

import {
  MY_DRIVE_VALUE, WEBHOOK_SUBSCRIPTION_RENEWAL_SECONDS,
} from "../../../../google_drive/common/constants.mjs";
import googleSheets from "../../../google_sheets.app.mjs";

/**
 * The number of events that will be automatically sent whenever the event
 * source is setup and deployed for the first time.
 *
 * Note that the event source could send less initial events than this if the
 * associated worksheets do not contain enough data.
 */
const INITIAL_EVENT_COUNT = 10;

/* eslint-disable pipedream/required-properties-key, pipedream/required-properties-name,
  pipedream/required-properties-version, pipedream/required-properties-description,
  pipedream/required-properties-type */
export default {
  props: {
    googleSheets,
    db: "$.service.db",
    http: {
      type: "$.interface.http",
      customResponse: true,
    },
    timer: {
      label: "Push notification renewal schedule",
      description:
        "The Google Drive API requires occasionally renewal of push notification subscriptions. **This runs in the background, so you should not need to modify this schedule**.",
      type: "$.interface.timer",
      static: {
        intervalSeconds: WEBHOOK_SUBSCRIPTION_RENEWAL_SECONDS,
      },
    },
    watchedDrive: {
      propDefinition: [
        googleSheets,
        "watchedDrive",
      ],
      description: "Defaults to My Drive. To select a [Shared Drive](https://support.google.com/a/users/answer/9310351) instead, select it from this list.",
    },

    sheetID: {
      propDefinition: [
        googleSheets,
        "sheetID",
        (c) => ({
          driveId: googleSheets.methods.getDriveId(c.watchedDrive),
        }),
      ],
    },
  },
  hooks: {
    async deploy() {
      await this.takeSheetSnapshot(INITIAL_EVENT_COUNT);

      const sheetId = this.getSheetId();
      const spreadsheet = await this.googleSheets.getSpreadsheet(sheetId);
      await this.processSpreadsheet(spreadsheet);
    },
    /**
     * Called when a component is created or updated. Handles all the logic
     * for starting and stopping watch notifications tied to the desired file.
     */
    async activate() {
      const channelID = uuid();

      const {
        startPageToken,
        expiration,
        resourceId,
      } = await this.activateHook(channelID);

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
    async deactivate() {
      const channelID = this._getChannelID();
      const subscription = this._getSubscription();

      // Reset DB state before anything else
      this._setSubscription(null);
      this._setChannelID(null);

      await this.googleSheets.deactivateHook(channelID, subscription?.resourceId);
    },
  },
  methods: {
    _getSubscription() {
      return this.db.get("subscription");
    },
    _setSubscription(subscription) {
      this.db.set("subscription", subscription);
    },
    _getChannelID() {
      return this.db.get("channelID");
    },
    _setChannelID(channelID) {
      this.db.set("channelID", channelID);
    },
    async getAllWorksheetIds(sheetID) {
      const { sheets } = await this.googleSheets.getSpreadsheet(sheetID);
      return sheets
        .map(({ properties }) => properties)
        .filter(({ sheetType }) => sheetType === "GRID")
        .map(({ sheetId }) => (sheetId.toString()));
    },
    getDriveId(drive = this.watchedDrive) {
      return googleSheets.methods.getDriveId(drive || MY_DRIVE_VALUE);
    },
    getSheetId() {
      throw new Error("getSheetId is not implemented");
    },
    getWorksheetIds() {
      throw new Error("getWorksheetIds is not implemented");
    },
    isEventRelevant(event) {
      const { headers } = event;
      return headers["x-goog-resource-state"] !== "sync";
    },
    isWorksheetRelevant(worksheetId) {
      const worksheetIds = this.getWorksheetIds();
      return worksheetIds.includes(worksheetId.toString());
    },
    activateHook() {
      throw new Error("activateHook is not implemented");
    },
    processSpreadsheet() {
      throw new Error("processSpreadsheet is not implemented");
    },
    async renewSubscription() {
      throw new Error("renewSubscription is not implemented");
    },
    /**
     * This method scans the worksheets indicated by the user to retrieve the
     * current row count of each one, and cache those values.
     * @param {number} [offset=0] When present, the row count that gets cached
     * will be reduced by this amount (useful for example to force an event
     * source to interpret the last rows as new).
     */
    takeSheetSnapshot() {
      throw new Error("takeSheetSnapshot is not implemented");
    },
  },
};
