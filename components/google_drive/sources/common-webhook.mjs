import includes from "lodash/includes.js";
import { v4 as uuid } from "uuid";

import googleDrive from "../google_drive.app.mjs";
import {
  MY_DRIVE_VALUE,
  WEBHOOK_RENEWAL_WINDOW_MILLISECONDS,
  WEBHOOK_TIMER_INTERVAL_SECONDS,
} from "../common/constants.mjs";
import { getListFilesOpts } from "../common/utils.mjs";
import commonDedupeChanges from "./common-dedupe-changes.mjs";

export default {
  props: {
    googleDrive,
    db: "$.service.db",
    http: {
      type: "$.interface.http",
      customResponse: true,
    },
    drive: {
      propDefinition: [
        googleDrive,
        "watchedDrive",
      ],
      description: "The drive to watch. Defaults to **My Drive**. To watch a [Shared Drive](https://support.google.com/a/users/answer/9310351), select it from this list.",
      optional: false,
      default: MY_DRIVE_VALUE,
    },
    timer: {
      label: "Push notification renewal schedule",
      description:
        "The Google Drive API requires occasional renewal of push notification subscriptions. **This runs in the background, so you should not need to modify this schedule**.",
      type: "$.interface.timer",
      static: {
        intervalSeconds: WEBHOOK_TIMER_INTERVAL_SECONDS,
      },
      hidden: true,
    },
    // No longer used; kept so older deployments that still set it can be saved
    updateTypes: {
      type: "string[]",
      label: "Types of updates",
      description: "Deprecated and ignored.",
      optional: true,
      hidden: true,
    },
    changesPageSize: {
      propDefinition: [
        googleDrive,
        "changesPageSize",
      ],
    },
    maxEmitsPerRun: {
      propDefinition: [
        googleDrive,
        "maxEmitsPerRun",
      ],
    },
  },
  hooks: {
    async activate() {
      // Called when a component is created or updated. Handles all the logic
      // for starting and stopping watch notifications tied to the desired
      // files.
      const channelID = uuid();
      const {
        startPageToken,
        expiration,
        resourceId,
      } = await this.googleDrive.activateHook(
        channelID,
        this.http.endpoint,
        this.getDriveId(),
      );

      // We use and increment the pageToken as new changes arrive, in run()
      this._setPageToken(startPageToken);

      // Save metadata on the subscription so we can stop / renew later
      // Subscriptions are tied to Google's resourceID, "an opaque value that
      // identifies the watched resource". This value is included in request headers
      this._setSubscription({
        resourceId,
        expiration,
      });
      this._setChannelID(channelID);
    },
    async deactivate() {
      const channelID = this._getChannelID();
      const { resourceId } = this._getSubscription();
      await this.googleDrive.deactivateHook(channelID, resourceId);

      this._setSubscription(null);
      this._setChannelID(null);
      this._setPageToken(null);
    },
  },
  methods: {
    ...commonDedupeChanges.methods,
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
    _getPageToken() {
      return this.db.get("pageToken");
    },
    _setPageToken(pageToken) {
      this.db.set("pageToken", pageToken);
    },
    // Notification headers of a capped run, so the timer can resume its backlog
    _getBacklogHeaders() {
      return this.db.get("backlogHeaders");
    },
    _setBacklogHeaders(headers) {
      this.db.set("backlogHeaders", headers);
    },
    isSubscriptionExpiring(subscription) {
      const expiration = Number(subscription?.expiration);
      return !expiration || expiration - Date.now() < WEBHOOK_RENEWAL_WINDOW_MILLISECONDS;
    },
    async renewSubscription(subscription, channelID, pageToken) {
      const {
        newChannelID,
        newPageToken,
        expiration,
        resourceId,
      } = await this.googleDrive.renewSubscription(
        this.drive,
        subscription,
        this.http.endpoint,
        channelID,
        pageToken,
      );

      this._setSubscription({
        expiration,
        resourceId,
      });
      this._setChannelID(newChannelID);
      this._setPageToken(newPageToken);
      return newPageToken;
    },
    isMyDrive(drive = this.drive) {
      return googleDrive.methods.isMyDrive(drive);
    },
    getDriveId(drive = this.drive) {
      return googleDrive.methods.getDriveId(drive);
    },
    getListFilesOpts(args = {}) {
      return getListFilesOpts(this.drive, {
        q: "mimeType != 'application/vnd.google-apps.folder' and trashed = false",
        ...args,
      });
    },
    /**
     * This method returns the types of updates/events from Google Drive that
     * the event source should listen to. This base implementation returns an
     * empty list, which means that any event source that extends this module
     * and that does not refine this implementation will essentially ignore
     * every incoming event from Google Drive.
     *
     * @returns
     * @type {UpdateType[]}
     */
    getUpdateTypes() {
      return [];
    },
    /**
     * File fields to request per change; `undefined` returns the API's minimal fields.
     */
    getChangesFileFields() {
      return undefined;
    },
    /**
     * Sources can drop changes before processing, e.g. bulk permission updates.
     * Receives a change from the API, including its `time` and `file`.
     */
    isRelevantChange() {
      return true;
    },
    /**
     * Sources whose processChanges() ignores the changed files return `false`,
     * so a notification runs processChanges() once instead of once per page.
     */
    consumesChangedFiles() {
      return true;
    },
    /**
     * This method is responsible for processing a list of changed files
     * according to the event source's purpose. As an abstract method, it must
     * be implemented by every event source that extends this module.
     *
     * @param {object[]} [changedFiles] - the list of file changes, as [defined
     * by the API](https://bit.ly/3h7WeUa)
     * @param {object} [headers] - an object containing the request headers of
     * the webhook call made by Google Drive
     * @returns {number} the number of events emitted
     */
    processChanges() {
      throw new Error("processChanges is not implemented");
    },
    async processChangesFrom(pageToken, headers) {
      this.resetFileIntervals();
      // A run that throws still keeps its db writes, so flush intervals to match the token
      try {
        const caughtUp = await this.googleDrive.processChangesPages({
          pageToken,
          driveId: this.getDriveId(),
          pageSize: this.changesPageSize,
          fileFields: this.getChangesFileFields(),
          maxEmits: this.maxEmitsPerRun,
          changeFilter: (change) => this.isRelevantChange(change),
          processPage: (changedFiles) => this.processChanges(changedFiles, headers),
          savePageToken: (nextPageToken) => this._setPageToken(nextPageToken),
        });
        this._setBacklogHeaders(caughtUp
          ? null
          : {
            "x-goog-resource-state": headers["x-goog-resource-state"],
            "x-goog-resource-uri": headers["x-goog-resource-uri"],
            "x-goog-changed": headers["x-goog-changed"],
          });
      } finally {
        this.flushFileIntervals();
      }
    },
  },
  async run(event) {
    // This function is polymorphic: it can be triggered as a cron job, to make
    // sure we renew watch requests for specific files, or via HTTP request (the
    // change payloads from Google)
    const subscription = this._getSubscription();
    const channelID = this._getChannelID();
    const pageToken = this._getPageToken();

    // Component was invoked by timer
    if (event.timestamp) {
      const currentPageToken = this.isSubscriptionExpiring(subscription)
        ? await this.renewSubscription(subscription, channelID, pageToken)
        : pageToken;

      const backlogHeaders = this._getBacklogHeaders();
      if (backlogHeaders && this.consumesChangedFiles()) {
        console.log("Resuming changes left by a capped run");
        await this.processChangesFrom(currentPageToken, backlogHeaders);
      }
      return;
    } else {
      this.http.respond({
        status: 200,
      });
    }

    const { headers } = event;
    if (!this.googleDrive.checkHeaders(headers, subscription, channelID)) {
      return;
    }

    if (!includes(this.getUpdateTypes(), headers["x-goog-resource-state"])) {
      console.log(
        `Update type ${headers["x-goog-resource-state"]} not in list of updates to watch: `,
        this.getUpdateTypes(),
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

    const driveId = this.getDriveId();
    if (!this.consumesChangedFiles()) {
      await this.processChanges([], headers);
      this._setPageToken(await this.googleDrive.getPageToken(driveId));
      return;
    }

    await this.processChangesFrom(pageToken, headers);
  },
};
