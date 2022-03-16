// This source processes changes to specific files in a user's Google Drive,
// implementing strategy enumerated in the Push Notifications API docs:
// https://developers.google.com/drive/api/v3/push .
//
// This source has two interfaces:
//
// 1) The HTTP requests tied to changes in the user's Google Drive
// 2) A timer that runs on regular intervals, renewing the notification channel
//    as needed
//
// This source watches for changes to specific files if the drive prop is the
// user's personal drive ("My Drive"). Otherwise, when the drive is a shared
// drive, this source watches for all changes to the drive, filtering out
// irrelevant changes.
//
// This source creates webhooks using one of two Google Drive API endpoints:
//
// 1) My Drive (`this.isMyDrive()`): [files:
//    watch](https://developers.google.com/drive/api/v3/reference/files/watch)
// 2) Shared Drive: [changes:
//    watch](https://developers.google.com/drive/api/v3/reference/changes/watch)
//    (inherited from `common-webhook.mjs`)

import cronParser from "cron-parser";
import includes from "lodash/includes.js";
import { v4 as uuid } from "uuid";

import googleDrive from "../../google_drive.app.mjs";
import common from "../common-webhook.mjs";

export default {
  ...common,
  key: "google_drive-changes-to-specific-files",
  name: "Changes to Specific Files",
  description:
    "Watches for changes to specific files, emitting an event any time a change is made to one of those files",
  version: "0.0.18",
  type: "source",
  // Dedupe events based on the "x-goog-message-number" header for the target channel:
  // https://developers.google.com/drive/api/v3/push#making-watch-requests
  dedupe: "unique",
  props: {
    ...common.props,
    files: {
      type: "string[]",
      label: "Files",
      description: "The files you want to watch for changes.",
      optional: true,
      default: [],
      options({ prevContext }) {
        const { nextPageToken } = prevContext;
        const baseOpts = {};
        const opts = this.isMyDrive()
          ? baseOpts
          : {
            ...baseOpts,
            corpora: "drive",
            driveId: this.getDriveId(),
            includeItemsFromAllDrives: true,
            supportsAllDrives: true,
          };
        return this.googleDrive.listFilesOptions(nextPageToken, opts);
      },
    },
    updateTypes: {
      propDefinition: [
        googleDrive,
        "updateTypes",
      ],
    },
  },
  hooks: {
    ...common.hooks,
    async activate() {
      if (!this.isMyDrive()) {
        return common.hooks.activate.call(this);
      }
      // Called when a component is created or updated. Handles all the logic
      // for starting and stopping watch notifications tied to the desired
      // files.

      // You can pass the same channel ID in watch requests for multiple files, so
      // our channel ID is fixed for this component to simplify the state we have to
      // keep track of.
      const channelID = this._getChannelID() || uuid();

      // Subscriptions are keyed on Google's resourceID, "an opaque value that
      // identifies the watched resource". This value is included in request
      // headers, allowing us to look up the watched resource.
      let subscriptions = this._getSubscriptions() || {};

      const files = this.files;
      for (const fileID of files) {
        const {
          expiration,
          resourceId,
        } = await this.googleDrive.watchFile(
          channelID,
          this.http.endpoint,
          fileID,
        );
        // The fileID must be kept with the subscription metadata so we can
        // renew the watch request for this specific file when it expires.
        subscriptions[resourceId] = {
          expiration,
          fileID,
        };
      }

      // Save metadata on the subscription so we can stop / renew later
      this._setSubscriptions(subscriptions);
      this._setChannelID(channelID);
    },
    async deactivate() {
      if (!this.isMyDrive()) {
        return common.hooks.deactivate.call(this);
      }

      const channelID = this._getChannelID();
      if (!channelID) {
        console.log(
          "Channel not found, cannot stop notifications for non-existent channel",
        );
        return;
      }

      const subscriptions = this._getSubscriptions() || {};
      for (const resourceId of Object.keys(subscriptions)) {
        await this.googleDrive.stopNotifications(channelID, resourceId);
      }

      // Reset DB state
      this._setSubscriptions({});
      this._setChannelID(null);
    },
  },
  methods: {
    ...common.methods,
    _getSubscriptions() {
      return this.db.get("subscriptions") || {};
    },
    _setSubscriptions(subscriptions) {
      this.db.set("subscriptions", subscriptions);
    },
    _getNextTimerEventTimestamp(event) {
      if (event.cron) {
        return cronParser
          .parseExpression(event.cron)
          .next()
          .getTime();
      }
      if (event.interval_seconds) {
        return Date.now() + event.interval_seconds * 1000;
      }
    },
    async renewFileSubscriptions(event) {
      // Assume subscription & channelID may all be undefined at
      // this point Handle their absence appropriately.
      const subscriptions = this._getSubscriptions() || {};
      const channelID = this._getChannelID() || uuid();

      const nextRunTimestamp = this._getNextTimerEventTimestamp(event);

      const {
        subscriptions: newSubscriptions,
        channelID: newChannelID,
      } = this.googleDrive.renewFileSubscriptions(
        subscriptions,
        this.http.endpoint,
        channelID,
        nextRunTimestamp,
      );

      this._setSubscriptions(newSubscriptions);
      this._setChannelID(newChannelID);
    },
    getUpdateTypes() {
      return this.updateTypes;
    },
    generateMeta(data, headers) {
      const {
        id: fileId,
        name: fileName,
        modifiedTime: tsString,
      } = data;
      const {
        "x-goog-message-number": eventId,
        "x-goog-resource-state": resourceState,
      } = headers;

      return {
        id: `${fileId}-${eventId}`,
        summary: `${resourceState.toUpperCase()} - ${
          fileName || "Untitled"
        }`,
        ts: Date.parse(tsString),
      };
    },
    isFileRelevant(file) {
      return this.files.includes(file.id);
    },
    async processChange(file, headers) {
      const eventToEmit = {
        file,
        change: {
          state: headers["x-goog-resource-state"],
          resourceURI: headers["x-goog-resource-uri"],
          changed: headers["x-goog-changed"], // "Additional details about the changes. Possible values: content, parents, children, permissions"
        },
      };
      const meta = this.generateMeta(file, headers);
      this.$emit(eventToEmit, meta);
    },
    async processChanges(changedFiles, headers) {
      for (const file of changedFiles) {
        if (!this.isFileRelevant(file)) {
          console.log(`Skipping event for irrelevant file ${file.id}`);
          continue;
        }
        this.processChange(file, headers);
      }
    },
  },
  async run(event) {
    if (!this.isMyDrive()) {
      return common.run.call(this, event);
    }
    // This function is polymorphic: it can be triggered as a cron job, to make sure we renew
    // watch requests for specific files, or via HTTP request (the change payloads from Google)

    // Component was invoked by timer
    if (event.timestamp) {
      return this.renewFileSubscriptions(event);
    }

    const channelID = this._getChannelID();
    let subscriptions = this._getSubscriptions() || {};

    const { headers } = event;

    if (
      !headers["x-goog-resource-state"] ||
      !headers["x-goog-resource-id"] ||
      !headers["x-goog-resource-uri"] ||
      !headers["x-goog-message-number"]
    ) {
      console.log("Request missing necessary headers: ", headers);
      return;
    }

    const incomingChannelID = headers["x-goog-channel-id"];
    if (incomingChannelID !== channelID) {
      console.log(
        `Channel ID of ${incomingChannelID} not equal to deployed component channel of ${channelID}`,
      );
      return;
    }

    if (subscriptions[headers["x-goog-resource-id"]] === undefined) {
      console.log(
        `Resource ID of ${headers["x-goog-resource-id"]} not currently being tracked. Exiting`,
      );
      return;
    }

    if (!includes(this.updateTypes, headers["x-goog-resource-state"])) {
      console.log(
        `Update type ${headers["x-goog-resource-state"]} not in list of updates to watch: `,
        this.updateTypes,
      );
      return;
    }

    // We observed false positives where a single change to a document would trigger two changes:
    // one to "properties" and another to "content,properties". But changes to properties
    // alone are legitimate, most users just won't want this source to emit in those cases.
    // If x-goog-changed is _only_ set to "properties", only move on if the user set the prop
    if (
      !this.watchForPropertiesChanges &&
      headers["x-goog-changed"] === "properties"
    ) {
      console.log(
        "Change to properties only, which this component is set to ignore. Exiting",
      );
      return;
    }

    const file = await this.googleDrive.getFileMetadata(
      headers["x-goog-resource-uri"],
    );

    if (!file || !Object.keys(file).length) {
      console.log("No file metadata returned, nothing to emit");
      return;
    }

    this.processChange(file, headers);
  },
};
