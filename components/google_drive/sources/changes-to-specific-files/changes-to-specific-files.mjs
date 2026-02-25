import cronParser from "cron-parser";
import includes from "lodash/includes.js";
import { v4 as uuid } from "uuid";
import { MY_DRIVE_VALUE } from "../../common/constants.mjs";
import changesToSpecificFiles from "../changes-to-specific-files-shared-drive/changes-to-specific-files-shared-drive.mjs";
import { ConfigurationError } from "@pipedream/platform";
import sampleEmit from "./test-event.mjs";

/**
 * This source uses the Google Drive API's
 * {@link https://developers.google.com/drive/api/v3/reference/files/watch files: watch}
 * endpoint to subscribe to changes to specific files in the user's drive.
 */
export default {
  ...changesToSpecificFiles,
  key: "google_drive-changes-to-specific-files",
  name: "Changes to Specific Files",
  description: "Watches for changes to specific files, emitting an event when a change is made to one of those files. To watch for changes to [shared drive](https://support.google.com/a/users/answer/9310351) files, use the **Changes to Specific Files (Shared Drive)** source instead.",
  version: "0.3.3",
  type: "source",
  // Dedupe events based on the "x-goog-message-number" header for the target channel:
  // https://developers.google.com/drive/api/v3/push#making-watch-requests
  dedupe: "unique",
  props: {
    infoAlert: {
      type: "alert",
      alertType: "info",
      content: "This source uses `files.watch` and supports up to 10 file subscriptions. To watch for changes to more than 10 files, use the **Changes to Files in Drive** source instead (uses `changes.watch`).",
    },
    ...changesToSpecificFiles.props,
    drive: {
      type: "string",
      label: "Drive",
      description: "Defaults to `My Drive`. To use a [Shared Drive](https://support.google.com/a/users/answer/9310351), use the **Changes to Specific Files (Shared Drive)** source instead.",
      optional: true,
      default: MY_DRIVE_VALUE,
    },
    updateTypes: {
      propDefinition: [
        changesToSpecificFiles.props.googleDrive,
        "updateTypes",
      ],
    },
    includeLink: {
      label: "Include Link",
      type: "boolean",
      description: "Upload file to your File Stash and emit temporary download link to the file. Google Workspace documents will be converted to PDF. See [the docs](https://pipedream.com/docs/connect/components/files) to learn more about working with files in Pipedream.",
      default: false,
      optional: true,
    },
    dir: {
      type: "dir",
      accessMode: "write",
      optional: true,
    },
  },
  hooks: {
    ...changesToSpecificFiles.hooks,
    async deploy() {
      if (this.files.length > 10) {
        throw new ConfigurationError("This source only supports up to 10 files");
      }
      await changesToSpecificFiles.hooks.deploy.bind(this)();
    },
    async activate() {
      // Called when a component is created or updated. Handles all the logic
      // for starting and stopping watch notifications tied to the desired
      // files.

      // You can pass the same channel ID in watch requests for multiple files, so
      // our channel ID is fixed for this component to simplify the state we have to
      // keep track of.
      const channelID = uuid();

      // Subscriptions are keyed on Google's resourceID, "an opaque value that
      // identifies the watched resource". This value is included in request
      // headers, allowing us to look up the watched resource.
      let subscriptions = this._getSubscriptions() || {};

      const files = this.files;
      for (const fileID of files) {
        const {
          expiration,
          resourceId,
        } = await this.googleDrive.activateFileHook(
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
    ...changesToSpecificFiles.methods,
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
      const subscriptions = this._getSubscriptions() || {};
      const channelID = this._getChannelID();
      const newChannelID = uuid();

      const nextRunTimestamp = this._getNextTimerEventTimestamp(event);

      for (const [
        currentResourceId,
        metadata,
      ] of Object.entries(subscriptions)) {
        const { fileID } = metadata;

        const subscription = {
          ...metadata,
          resourceId: currentResourceId,
        };
        const {
          expiration,
          resourceId,
        } = await this.googleDrive.renewFileSubscription(
          subscription,
          this.http.endpoint,
          channelID,
          newChannelID,
          fileID,
          nextRunTimestamp,
        );
        subscriptions[resourceId] = {
          expiration,
          fileID,
        };
      }
      this._setSubscriptions(subscriptions);
      this._setChannelID(newChannelID);
    },
  },
  async run(event) {
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

    const [
      checkedFile,
    ] = this.checkMinimumInterval([
      file,
    ]);
    if (checkedFile) {
      await this.processChange(file, headers);
    }
  },
  sampleEmit,
};
