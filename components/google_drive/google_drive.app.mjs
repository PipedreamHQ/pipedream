import axios from "axios";
import drive from "@googleapis/drive";
import { v4 as uuid } from "uuid";
import isoLanguages from "./actions/language-codes.mjs";
import mimeDb from "mime-db";
const mimeTypes = Object.keys(mimeDb);

import {
  GOOGLE_DRIVE_UPDATE_TYPES,
  MY_DRIVE_VALUE,
  WEBHOOK_SUBSCRIPTION_EXPIRATION_TIME_MILLISECONDS,
  GOOGLE_DRIVE_FOLDER_MIME_TYPE,
  GOOGLE_DRIVE_ROLES,
  GOOGLE_DRIVE_GRANTEE_TYPES,
  GOOGLE_DRIVE_GRANTEE_ANYONE,
  GOOGLE_DRIVE_ROLE_READER,
  GOOGLE_DRIVE_UPLOAD_TYPES
} from "./constants.mjs";
import googleMimeTypes from "./actions/google-mime-types.mjs";

import {
  isMyDrive,
  getDriveId,
  getListFilesOpts,
  omitEmptyStringValues,
  toSingleLineString,
  getFilePaths,
} from "./utils.mjs";

export default {
  type: "app",
  app: "google_drive",
  propDefinitions: {
    watchedDrive: {
      type: "string",
      label: "Drive",
      description: "Defaults to `My Drive`. To select a [Shared Drive](https://support.google.com/a/users/answer/9310351) instead, select it from this list.",
      optional: true,
      default: MY_DRIVE_VALUE,
      async options({ prevContext }) {
        const { nextPageToken } = prevContext;
        return this._listDriveOptions(nextPageToken);
      },
    },
    folderId: {
      type: "string",
      label: "Folder",
      description: "The folder in the drive",
      async options({
        prevContext,
        drive,
        baseOpts = {
          q: `mimeType = '${GOOGLE_DRIVE_FOLDER_MIME_TYPE}'`,
        },
      }) {
        const { nextPageToken } = prevContext;
        return this.listDriveFilesOptions(drive, nextPageToken, baseOpts);
      },
    },
    fileId: {
      type: "string",
      label: "File",
      description: "The file in the drive",
      async options({
        prevContext,
        drive,
        baseOpts = {
          q: `mimeType != '${GOOGLE_DRIVE_FOLDER_MIME_TYPE}'`,
        },
      }) {
        const { nextPageToken } = prevContext;
        return this.listDriveFilesOptions(drive, nextPageToken, baseOpts);
      },
    },
    fileOrFolderId: {
      type: "string",
      label: "File or Folder",
      description: "The file or folder in the drive",
      async options({
        prevContext, drive, baseOpts = {},
      }) {
        const { nextPageToken } = prevContext;
        return this.listDriveFilesOptions(drive, nextPageToken, baseOpts);
      },
    },
    fileParents: {
      type: "string[]",
      label: "File Parents",
      description: "The folder IDs of the file's parents",
      optional: true,
      async options({ fileId }) {
        if (!fileId) {
          return [];
        }
        let file;
        try {
          file = await this.getFile(fileId, {
            fields: "parents",
          });
        } catch (err) {
          return [];
        }
        let parentFolders = await Promise.all(
          file.parents.map((parentId) => this.getFile(parentId, {
            fields: "id,name",
          })),
        );
        return parentFolders.map(({
          id, name,
        }) => ({
          value: id,
          label: name,
        }));
      },
    },
    updateTypes: {
      type: "string[]",
      label: "Types of updates",
      description: `The types of updates you want to watch for on these files. 
        [See Google's docs]
        (https://developers.google.com/drive/api/v3/push#understanding-drive-api-notification-events).`,
      default: GOOGLE_DRIVE_UPDATE_TYPES,
      options: GOOGLE_DRIVE_UPDATE_TYPES,
    },
    watchForPropertiesChanges: {
      type: "boolean",
      label: "Watch for changes to file properties",
      description: `Watch for changes to [file properties](https://developers.google.com/drive/api/v3/properties)
        in addition to changes to content. **Defaults to \`false\`, watching for only changes to content**.`,
      optional: true,
      default: false,
    },
    fileUrl: {
      type: "string",
      label: "File URL",
      description: toSingleLineString(`
        The URL of the file you want to upload to Google Drive. Must specify either **File URL** 
        or **File Path**.
      `),
      optional: true,
    },
    filePath: {
      type: "string",
      label: "File Path",
      description: toSingleLineString(`
        The path to the file saved to the [\`/tmp\`
        directory](https://pipedream.com/docs/workflows/steps/code/nodejs/working-with-files/#the-tmp-directory)
        (e.g. \`/tmp/myFile.csv\`). Must specify either **File URL** or **File Path**.
      `),
      optional: true,
    },
    fileName: {
      type: "string",
      label: "Name",
      description: "The name of the file (e.g., `/myFile.csv`)",
      optional: true,
    },
    fileNameSearchTerm: {
      type: "string",
      label: "Search Name",
      description: "Enter the name of a file to search for.",
      optional: true,
    },
    mimeType: {
      type: "string",
      label: "Mime Type",
      description: toSingleLineString(`
        The MIME type of the file (e.g., \`image/jpeg\`). Google Drive will attempt to automatically
        detect an appropriate value from uploaded content if no value is provided. The value cannot
        be changed unless a new revision is uploaded. If a file is created with a [Google Doc MIME
        type](https://developers.google.com/drive/api/v3/mime-types), the uploaded content will be
        imported if possible.
      `),
      optional: true,
      async options({ page = 0 }) {
        const allTypes = googleMimeTypes.concat(mimeTypes);
        const start = page * 500;
        const end = start + 500;
        return allTypes.slice(start, end);
      },
    },
    uploadType: {
      type: "string",
      label: "Upload Type",
      description: `The type of upload request to the /upload URI. If you are uploading data
        (using an /upload URI), this field is required. If you are creating a metadata-only file,
        this field is not required. 
        media - Simple upload. Upload the media only, without any metadata.
        multipart - Multipart upload. Upload both the media and its metadata, in a single request.
        resumable - Resumable upload. Upload the file in a resumable fashion, using a series of 
        at least two requests where the first request includes the metadata.`,
      options: GOOGLE_DRIVE_UPLOAD_TYPES
    },
    useDomainAdminAccess: {
      type: "boolean",
      label: "Use Domain Admin Access",
      description: "Issue the request as a domain administrator",
      optional: true,
      default: false,
    },
    role: {
      type: "string",
      label: "Role",
      description: "The role granted by this permission",
      optional: true,
      default: GOOGLE_DRIVE_ROLE_READER,
      options: GOOGLE_DRIVE_ROLES,
    },
    type: {
      type: "string",
      label: "Type",
      description:
        "The type of the grantee. If **Type** is `user` or `group`, you must provide an **Email Address** for the user or group. When **Type** is `domain`, you must provide a `Domain`. Sharing with a domain is only valid for G Suite users.",
      optional: true,
      default: GOOGLE_DRIVE_GRANTEE_ANYONE,
      options: GOOGLE_DRIVE_GRANTEE_TYPES,
    },
    domain: {
      type: "string",
      label: "Domain",
      description:
        "The domain of the G Suite organization to which this permission refers if **Type** is `domain` (e.g., `yourcomapany.com`)",
      optional: true,
    },
    emailAddress: {
      type: "string",
      label: "Email Address",
      description:
        "The email address of the user or group to which this permission refers if **Type** is `user` or `group`",
      optional: true,
    },
    ocrLanguage: {
      type: "string",
      label: "OCR Language",
      description:
        "A language hint for OCR processing during image import (ISO 639-1 code)",
      optional: true,
      options: isoLanguages,
    },
    useContentAsIndexableText: {
      type: "boolean",
      label: "Use Content As Indexable Text",
      description:
        "Whether to use the uploaded content as indexable text",
      optional: true,
    },
    keepRevisionForever: {
      type: "boolean",
      label: "Keep Revision Forever",
      description: toSingleLineString(`
        Whether to set the 'keepForever' field in the new head revision. This is only applicable
        to files with binary content in Google Drive. Only 200 revisions for the file can be kept 
        forever. If the limit is reached, try deleting pinned revisions.
      `),
      optional: true,
    },
  },
  methods: {
    // Static methods
    isMyDrive,
    getDriveId,
    getFilePaths,

    // Returns a drive object authenticated with the user's access token
    drive() {
      const auth = new drive.auth.OAuth2();
      auth.setCredentials({
        access_token: this.$auth.oauth_access_token,
      });
      return drive.drive({
        version: "v3",
        auth,
      });
    },
    // Google's push notifications provide a URL to the resource that changed,
    // which we can use to fetch the file's metadata. So we use axios here
    // (vs. the Node client) to get that.
    async getFileMetadata(url) {
      return (
        await axios({
          method: "GET",
          headers: {
            Authorization: `Bearer ${this.$auth.oauth_access_token}`,
          },
          url,
        })
      ).data;
    },
    /**
     * This method yields a list of changes that occurred to files in a
     * particular Google Drive. It is a wrapper around [the `drive.changes.list`
     * API](https://bit.ly/2SGb5M2) but defined as a generator to enable lazy
     * loading of multiple pages.
     *
     * @typedef {object} ChangesPage
     * @property {object[]} changedFiles - the list of file changes, as [defined
     * by the API](https://bit.ly/3h7WeUa). This list filters out any result
     * that is not a proper object.
     * @property {string} nextPageToken - the page token [returned by the last API
     * call](https://bit.ly/3h7WeUa). **Note that this generator keeps track of
     * this token internally, and the purpose of this value is to provide a way
     * for consumers of this method to handle checkpoints in case of an
     * unexpected halt.**
     *
     * @param {string} [pageToken] - the token for continuing a previous list
     * request on the next page. This must be a token that was previously
     * returned by this same method.
     * @param {string} [driveId]  - the shared drive from which changes are
     * returned
     * @yields
     * @type {ChangesPage}
     */
    async *listChanges(pageToken, driveId) {
      const drive = this.drive();
      let changeRequest = {
        pageToken,
        pageSize: 1000,
      };

      // As with many of the methods for Google Drive, we must
      // pass a request of a different shape when we're requesting
      // changes for My Drive (null driveId) vs. a shared drive
      if (driveId) {
        changeRequest = {
          ...changeRequest,
          driveId,
          includeItemsFromAllDrives: true,
          supportsAllDrives: true,
        };
      }

      while (true) {
        const { data } = await drive.changes.list(changeRequest);
        const {
          changes = [],
          newStartPageToken,
          nextPageToken,
        } = data;

        // Some changes do not include an associated file object. Return only
        // those that do
        const changedFiles = changes
          .map((change) => change.file)
          .filter((f) => typeof f === "object");

        yield {
          changedFiles,
          nextPageToken: nextPageToken || newStartPageToken,
        };

        if (newStartPageToken) {
          // The 'newStartPageToken' field is only returned as part of the last
          // page from the API response: https://bit.ly/3jBEvWV
          break;
        }

        changeRequest.pageToken = nextPageToken;
      }
    },
    async getPageToken(driveId) {
      const drive = this.drive();
      const request = driveId
        ? {
          driveId,
          supportsAllDrives: true,
        }
        : {};
      const { data } = await drive.changes.getStartPageToken(request);
      return data.startPageToken;
    },
    checkHeaders(headers, subscription, channelID) {
      if (
        !headers["x-goog-resource-state"] ||
        !headers["x-goog-resource-id"] ||
        !headers["x-goog-resource-uri"] ||
        !headers["x-goog-message-number"]
      ) {
        console.log("Request missing necessary headers: ", headers);
        return false;
      }

      const incomingChannelID = headers["x-goog-channel-id"];
      if (incomingChannelID !== channelID) {
        console.log(
          `Channel ID of ${incomingChannelID} not equal to deployed component channel of ${channelID}`,
        );
        return false;
      }

      if (headers["x-goog-resource-id"] !== subscription.resourceId) {
        console.log(
          `Resource ID of ${subscription.resourceId} not currently being tracked. Exiting`,
        );
        return false;
      }
      return true;
    },

    /**
     * A utility method around [the `drive.drives.list`
     * API](https://bit.ly/3AiWE1x) but scoped to a specific page of the API
     * response
     *
     * @typedef {object} DriveListPage - an object representing a page that
     * lists GDrive drives, as defined by [the API](https://bit.ly/3jwxbvy)
     *
     * @param {string} [pageToken] - the page token for the next page of shared
     * drives
     * @param {number} [pageSize=10] - the number of records to retrieve as part
     * of the page
     *
     * @returns
     * @type {DriveListPage}
     */
    async listDrivesInPage(pageToken, pageSize = 10) {
      const drive = this.drive();
      const { data } = await drive.drives.list({
        pageSize,
        pageToken,
      });
      return data;
    },
    /**
     * This method yields the visible GDrive drives of the authenticated
     * account. It is a wrapper around [the `drive.drives.list`
     * API](https://bit.ly/3AiWE1x) but defined as a generator to enable lazy
     * loading of multiple pages.
     *
     * @typedef {object} Drive - an object representing a GDrive drive, as
     * defined by [the API](https://bit.ly/3ycifGY)
     *
     * @yields
     * @type {Drive}
     */
    async *listDrives() {
      let pageToken;

      while (true) {
        const {
          drives = [],
          nextPageToken,
        } = await this.listDrivesInPage(
          pageToken,
        );

        for (const drive in drives) {
          yield drive;
        }

        if (!nextPageToken) {
          // The 'nextPageToken' field is only returned when there's still
          // comments to be retrieved (i.e. when the end of the list has not
          // been reached yet): https://bit.ly/3jwxbvy
          break;
        }

        pageToken = nextPageToken;
      }
    },
    async _listDriveOptions(pageToken) {
      const {
        drives,
        nextPageToken,
      } = await this.listDrivesInPage(pageToken);

      // "My Drive" isn't returned from the list of drives, so we add it to the
      // list and assign it a static ID that we can refer to when we need. We
      // only do this during the first page of options (i.e. when `pageToken` is
      // undefined).
      const options =
        pageToken !== undefined
          ? []
          : [
            {
              label: "My Drive",
              value: MY_DRIVE_VALUE,
            },
          ];
      for (const d of drives) {
        options.push({
          label: d.name,
          value: d.id,
        });
      }
      return {
        options,
        context: {
          nextPageToken,
        },
      };
    },
    /**
     * A utility method around [the `drive.files.list`
     * API](https://bit.ly/366CFVN) but scoped to a specific page of the API
     * response
     *
     * @typedef {object} FileListPage - an object representing a page that lists
     * GDrive files, as defined by [the API](https://bit.ly/3xdbAwc)
     *
     * @param {string} [pageToken] - the page token for the next page of shared
     * drives
     * @param {object} [extraOpts = {}] - an object containing extra/optional
     * parameters to be fed to the GDrive API call, as defined in [the API
     * docs](https://bit.ly/3AnQDR1)
     *
     * @returns
     * @type {FileListPage}
     */
    async listFilesInPage(pageToken, extraOpts = {}) {
      const drive = this.drive();
      const { data } = await drive.files.list({
        pageToken,
        ...extraOpts,
      });
      return data;
    },
    /**
     * A utility method around [the `drive.files.list`
     * API](https://bit.ly/366CFVN) but scoped to a specific page of the API
     * response, and intended to be used as a way for prop definitions to return
     * a list of options.
     *
     * @param {string} [pageToken] - the page token for the next page of shared
     * drives
     * @param {object} [extraOpts = {}] - an object containing extra/optional
     * parameters to be fed to the GDrive API call, as defined in [the API
     * docs](https://bit.ly/3AnQDR1)
     *
     * @returns a list of prop options
     */
    async listFilesOptions(pageToken, extraOpts = {}) {
      const {
        files,
        nextPageToken,
      } = await this.listFilesInPage(
        pageToken,
        extraOpts,
      );
      const options = files.map((file) => ({
        label: file.name,
        value: file.id,
      }));
      return {
        options,
        context: {
          nextPageToken,
        },
      };
    },
    /**
     * Method returns a list of folder options
     *
     * @param {string} [pageToken] - the page token for the next page of shared
     * drives
     * @param {object} [opts = {}] - an object containing extra/optional
     * parameters to be fed to the GDrive API call, as defined in [the API
     * docs](https://bit.ly/3AnQDR1)
     *
     * @returns a list of prop options
     */

    async listFolderOptions(pageToken, opts = {}) {
      return await this.listFilesOptions(pageToken, {
        ...opts,
        q: "mimeType = 'application/vnd.google-apps.folder'",
      });
    },
    /**
     * Gets a list of prop options for a GDrive file in a particular GDrive
     * drive, if provided
     *
     * @param {String} [drive] the ID value of a Google Drive, as provided by the
     * `drive` prop definition of this app, to which the file belongs
     * @param {string} [pageToken] - the page token for the next page of files
     * @param {object} [extraOpts = {}] - an object containing extra/optional
     * parameters to be fed to the GDrive API call, as defined in [the API
     * docs](https://bit.ly/3AnQDR1)
     *
     * @returns a list of prop options
     */
    async listDriveFilesOptions(drive, pageToken = null, extraOpts = {}) {
      const opts = {
        ...getListFilesOpts(drive, extraOpts),
        fields: "nextPageToken,files(id,name,parents)",
      };
      // Fetch folders to use to build file paths. If num folders in a drive exceeds 1000, file
      // paths may be incomplete.
      const foldersPromise = this.listFilesInPage(null, {
        ...opts,
        pageSize: 1000, // Max pageSize
        q: `mimeType = '${GOOGLE_DRIVE_FOLDER_MIME_TYPE}'`,
      });
      const filesPromise = this.listFilesInPage(
        pageToken,
        opts,
      );
      const [
        { files: folders },
        {
          files, nextPageToken,
        },
      ] = await Promise.all([
        foldersPromise,
        filesPromise,
      ]);
      const filePaths = this.getFilePaths(files, folders);
      const options = files.map((file) => ({
        label: filePaths[file.id],
        value: file.id,
      }));
      return {
        options,
        context: {
          nextPageToken,
        },
      };
    },
    /**
     * This method yields comments made to a particular GDrive file. It is a
     * wrapper around [the `drive.comments.list` API](https://bit.ly/2UjYajv)
     * but defined as a generator to enable lazy loading of multiple pages.
     *
     * @typedef {object} Comment - an object representing a comment in a GDrive
     * file, as defined by [the API](https://bit.ly/3htAd12)
     *
     * @yields
     * @type {Comment}
     */
    async *listComments(fileId, startModifiedTime = null) {
      const drive = this.drive();
      const opts = {
        fileId,
        fields: "*",
        pageSize: 100,
      };

      if (startModifiedTime !== null) {
        opts.startModifiedTime = new Date(startModifiedTime).toISOString();
      }

      while (true) {
        const { data } = await drive.comments.list(opts);
        const {
          comments = [],
          nextPageToken,
        } = data;

        for (const comment of comments) {
          yield comment;
        }

        if (!nextPageToken) {
          // The 'nextPageToken' field is only returned when there's still
          // comments to be retrieved (i.e. when the end of the list has not
          // been reached yet): https://bit.ly/3w9ru9m
          break;
        }

        opts.pageToken = nextPageToken;
      }
    },
    _makeWatchRequestBody(id, address) {
      const expiration =
        Date.now() + WEBHOOK_SUBSCRIPTION_EXPIRATION_TIME_MILLISECONDS;
      return {
        id, // the component-specific channel ID, a UUID
        type: "web_hook",
        address, // the component-specific HTTP endpoint
        expiration,
      };
    },
    async watchDrive(id, address, pageToken, driveId) {
      const drive = this.drive();
      const requestBody = this._makeWatchRequestBody(id, address);
      let watchRequest = {
        pageToken,
        requestBody,
      };

      // Google expects an entirely different object to be passed
      // when you make a watch request for My Drive vs. a shared drive
      // "My Drive" doesn't have a driveId, so if this method is called
      // without a driveId, we make a watch request for My Drive
      if (driveId) {
        watchRequest = {
          ...watchRequest,
          driveId,
          includeItemsFromAllDrives: true,
          supportsAllDrives: true,
        };
      }

      // When watching for changes to an entire account, we must pass a pageToken,
      // which points to the moment in time we want to start watching for changes:
      // https://developers.google.com/drive/api/v3/manage-changes
      const {
        expiration,
        resourceId,
      } = (
        await drive.changes.watch(watchRequest)
      ).data;
      console.log(`Watch request for drive successful, expiry: ${expiration}`);
      return {
        expiration: parseInt(expiration),
        resourceId,
      };
    },
    async watchFile(id, address, fileId) {
      const drive = this.drive();
      const requestBody = this._makeWatchRequestBody(id, address);
      const {
        expiration,
        resourceId,
      } = (
        await drive.files.watch({
          fileId,
          requestBody,
          supportsAllDrives: true,
        })
      ).data;
      console.log(
        `Watch request for file ${fileId} successful, expiry: ${expiration}`,
      );
      return {
        expiration: parseInt(expiration),
        resourceId,
      };
    },
    async stopNotifications(id, resourceId) {
      // id = channelID
      // See https://github.com/googleapis/google-api-nodejs-client/issues/627
      const drive = this.drive();

      // If for some reason the channel doesn't exist, this throws an error
      // It's OK for this to fail in those cases, since we'll renew the channel
      // immediately after trying to stop it if we still want notifications,
      // so we squash the error, log it, and move on.
      try {
        await drive.channels.stop({
          resource: {
            id,
            resourceId,
          },
        });
        console.log(`Stopped push notifications on channel ${id}`);
      } catch (err) {
        console.error(
          `Failed to stop channel ${id} for resource ${resourceId}: ${err}`,
        );
      }
    },
    /**
     * Get a file in a drive
     *
     * @param {string} fileId - the ID value of the file to get
     * @param {object} [params={}] - an object representing parameters used to
     * get a file
     * @param {string} [params.fields="*"] - the paths of the fields to include
     * in the response
     * @param {string} [params.alt] - if set to `media`, then the response
     * includes the file contents in the response body
     * @param {...*} [params.extraParams] - extra/optional parameters to be fed
     * to the GDrive API call, as defined in [the API
     * docs](https://bit.ly/3i5ctkS)
     * @returns the file
     */
    async getFile(fileId, params = {}) {
      const {
        fields = "*",
        alt,
        ...extraParams
      } = params;
      const drive = this.drive();
      return (
        await drive.files.get({
          fileId,
          fields,
          alt,
          supportsAllDrives: true,
          ...extraParams,
        }, (alt === "media")
          ? {
            responseType: "stream",
          }
          : undefined)
      ).data;
    },
    async getDrive(driveId) {
      const drive = this.drive();
      return (
        await drive.drives.get({
          driveId,
        })
      ).data;
    },
    async activateHook(channelID, url, drive) {
      const startPageToken = await this.getPageToken(drive);
      const {
        expiration,
        resourceId,
      } = await this.watchDrive(
        channelID,
        url,
        startPageToken,
        drive,
      );
      return {
        startPageToken,
        expiration,
        resourceId,
      };
    },
    async activateFileHook(channelID, url, fileId) {
      channelID = channelID || uuid();

      const {
        expiration,
        resourceId,
      } = await this.watchFile(
        channelID,
        url,
        fileId,
      );

      return {
        expiration,
        resourceId,
        channelID,
      };
    },
    async deactivateHook(channelID, resourceId) {
      if (!channelID) {
        console.log(
          "Channel not found, cannot stop notifications for non-existent channel",
        );
        return;
      }

      if (!resourceId) {
        console.log(
          "No resource ID found, cannot stop notifications for non-existent resource",
        );
        return;
      }

      await this.stopNotifications(channelID, resourceId);
    },
    async renewSubscription(drive, subscription, url, channelID, pageToken) {
      const newChannelID = channelID || uuid();
      const driveId = this.getDriveId(drive);
      const newPageToken = pageToken || (await this.getPageToken(driveId));

      const {
        expiration,
        resourceId,
      } = await this.checkResubscription(
        subscription,
        newChannelID,
        newPageToken,
        url,
        drive,
      );

      return {
        newChannelID,
        newPageToken,
        expiration,
        resourceId,
      };
    },
    async checkResubscription(
      subscription,
      channelID,
      pageToken,
      endpoint,
      drive,
    ) {
      const driveId = this.getDriveId(drive);
      if (subscription && subscription.resourceId) {
        console.log(
          `Notifications for resource ${subscription.resourceId} are expiring at ${subscription.expiration}.
          Stopping existing sub`,
        );
        await this.stopNotifications(channelID, subscription.resourceId);
      }

      const {
        expiration,
        resourceId,
      } = await this.watchDrive(
        channelID,
        endpoint,
        pageToken,
        driveId,
      );
      return {
        expiration,
        resourceId,
      };
    },
    async renewFileSubscription(subscription, url, channelID, fileId, nextRunTimestamp) {
      if (nextRunTimestamp && subscription?.expiration < nextRunTimestamp) {
        return subscription;
      }

      const newChannelID = channelID || uuid();

      if (subscription?.resourceId) {
        console.log(
          `Notifications for resource ${subscription.resourceId} are expiring at ${subscription.expiration}. Renewing`,
        );
        await this.stopNotifications(
          channelID,
          subscription.resourceId,
        );
      }
      const {
        expiration,
        resourceId,
      } = await this.watchFile(
        channelID,
        url,
        fileId,
      );

      return {
        newChannelID,
        expiration,
        resourceId,
      };
    },
    /**
     * Get a filtered list of folders
     *
     * @param {object} [opts={}] - an object representing configuration options
     * used to filter the folders that are listed
     * @param {string} [opts.drive] - the ID value of a Google Drive, as
     * provided by the `drive` prop definition of this app
     * @param {string} [opts.name] - the name of the folder to find
     * @param {string} [opts.parentId] - the ID of the parent folder of the
     * folder to find, used to filter the listed folders
     * @param {boolean} [opts.excludeTrashed=true] - `true` if folders in the
     * trash should be excluded
     * @returns the list of folders
     */
    async findFolder(opts = {}) {
      const {
        drive: driveProp,
        name,
        parentId,
        excludeTrashed = true,
      } = opts;
      const drive = this.drive();
      let q = `mimeType = '${GOOGLE_DRIVE_FOLDER_MIME_TYPE}'`;
      if (name) {
        q += ` and name = '${name}'`;
      }
      if (parentId) {
        q += ` and '${parentId}' in parents`;
      }
      if (excludeTrashed) {
        q += " and trashed != true";
      }
      const listOpts = getListFilesOpts(driveProp, {
        q,
      });
      return (await drive.files.list(listOpts)).data.files;
    },
    /**
     * Create a file in a drive
     *
     * @param {object} [opts={}] - an object representing configuration options
     * used to create a file
     * @param {stream.Readable} [opts.file] - a file stream to create the file
     * with
     * @param {string} [opts.mimeType] - the MIME type of the file to create
     * @param {string} [opts.name] - the name of the file to create
     * @param {string} [opts.parentId] - the ID value of the parent folder to
     * create the file in
     * @param {string} [opts.driveId] - the ID value of a Google Drive to create
     * the file in if `parentId` is undefined
     * @param {string} [opts.fields] - the paths of the fields to include in the
     * response
     * @param {string} [opts.supportsAllDrives=true] - whether the requesting
     * application supports both My Drives and shared drives
     * @param {object} [opts.requestBody] - extra/optional properties to be used
     * in the request body of the GDrive API, as defined in [the API
     * docs](https://bit.ly/3kuvbnq)
     * @param {...*} [opts.extraParams] - extra/optional parameters to be fed to
     * the GDrive API call, as defined in [the API docs](https://bit.ly/2VY0MVg)
     * @returns the created file
     */
    async createFile(opts = {}) {
      const {
        file,
        mimeType,
        name,
        parentId,
        driveId,
        fields,
        supportsAllDrives = true,
        requestBody,
        uploadType,
        ...extraParams
      } = opts;
      const drive = this.drive();
      const parent = parentId ?? driveId;
      return (
        await drive.files.create({
          fields,
          supportsAllDrives,
          media: file
            ? {
              mimeType,
              body: file,
              uploadType,
            }
            : undefined,
          requestBody: {
            name,
            mimeType,
            parents: parent
              ? [
                parent,
              ]
              : undefined,
            ...extraParams.resource,
            ...requestBody,
          },
          ...extraParams,
        })
      ).data;
    },
    /**
     * Create a folder in a drive
     *
     * @param {object} [opts={}] - an object representing configuration options
     * used to create a folder
     * @param {string} [opts.name] - the name of the folder to create
     * @param {string} [opts.parentId] - the ID value of the parent folder to
     * create the folder in
     * @param {string} [opts.fields="*"] - the paths of the fields to include in
     * the response
     * @param {...*} [opts.extraParams] - extra/optional parameters to be fed to
     * the GDrive API call, as defined in [the API docs](https://bit.ly/2VY0MVg)
     * @returns the created folder
     */
    async createFolder(opts = {}) {
      const {
        name,
        parentId,
        fields = "*",
        ...extraParams
      } = opts;
      return await this.createFile({
        name,
        parentId,
        fields,
        mimeType: `${GOOGLE_DRIVE_FOLDER_MIME_TYPE}`,
        ...extraParams,
      });
    },
    /**
     * Update a file's media content
     *
     * @param {string} fileId - the ID value of the file to update
     * @param {stream.Readable} [fileStream] - a file stream used to update the
     * content of the file
     * @param {object} [opts={}] - an object representing configuration options
     * used to update a file
     * @param {string} [opts.mimeType] - the MIME type of the file
     * used to update the file content
     * @param {string} [opts.supportsAllDrives=true] - whether the requesting
     * application supports both My Drives and shared drives
     * @param {...*} [opts.extraParams] - extra/optional parameters to be fed to
     * the GDrive API call, as defined in [the API docs](https://bit.ly/3lNg9Zw)
     * @returns the updated file
     */
    async updateFileMedia(fileId, fileStream, opts = {}) {
      const {
        mimeType,
        supportsAllDrives = true,
        ...extraParams
      } = opts;
      const drive = this.drive();
      return (
        await drive.files.update({
          fileId,
          supportsAllDrives,
          media: {
            mimeType,
            body: fileStream,
          },
          ...extraParams,
        })
      ).data;
    },
    /**
     * Update a file's metadata
     *
     * @param {string} fileId - the ID value of the file to update
     * @param {object} [opts={}] - an object representing configuration options
     * used to update a file
     * @param {string} [opts.name] - the updated name of the file
     * @param {string} [opts.mimeType] - the updated MIME type of the file
     * @param {string} [opts.fields] - the paths of the fields to include in
     * the response
     * @param {string} [opts.removeParents] - a comma-separated list of parent
     * folder IDs to add to the file's parents
     * @param {string} [opts.addParents] - a comma-separated list of parent
     * folder IDs to add to the file's parents
     * @param {string} [opts.supportsAllDrives=true] - whether the requesting
     * application supports both My Drives and shared drives
     * @param {object} [opts.requestBody] - extra/optional properties to be used
     * in the request body of the GDrive API, as defined in
     * [the API docs](https://bit.ly/3nTMi4n)
     * @param {...*} [opts.extraParams] - extra/optional parameters to be fed to
     * the GDrive API call, as defined in [the API docs](https://bit.ly/3lNg9Zw)
     * @returns the updated file
     */
    async updateFile(fileId, opts = {}) {
      const {
        name,
        mimeType,
        fields,
        removeParents,
        addParents,
        supportsAllDrives = true,
        requestBody,
        ...extraParams
      } = opts;
      const drive = this.drive();
      return (
        await drive.files.update({
          fileId,
          removeParents,
          addParents,
          fields,
          supportsAllDrives,
          requestBody: {
            name,
            mimeType,
            ...requestBody,
          },
          ...extraParams,
        })
      ).data;
    },
    /**
     * Copy a file
     *
     * @param {string} fileId - the ID value of the file to copy
     * @param {object} [opts={}] - an object representing configuration options
     * used to copy a file
     * @param {string} [opts.fields="*"] - the paths of the fields to include in
     * the response
     * @param {string} [opts.supportsAllDrives=true] - whether the requesting
     * application supports both My Drives and shared drives
     * @param {...*} [opts.extraParams] - extra/optional parameters to be fed to
     * the GDrive API call, as defined in [the API docs](https://bit.ly/3kq5eFO)
     * @returns the copy of the file
     */
    async copyFile(fileId, opts = {}) {
      const {
        fields = "*",
        supportsAllDrives = true,
        ...extraParams
      } = opts;
      const drive = this.drive();
      return (
        await drive.files.copy({
          fileId,
          fields,
          supportsAllDrives,
          ...extraParams,
        })
      ).data;
    },
    /**
     * Delete a file
     *
     * @param {string} fileId - the ID value of the file to delete
     * @param {object} [params={}] - an object representing parameters used to
     * delete a file
     * @param {string} [params.supportsAllDrives=true] - whether the requesting
     * application supports both My Drives and shared drives
     * @param {...*} [params.extraParams] - extra/optional parameters to be fed
     * to the GDrive API call, as defined in [the API
     * docs](https://bit.ly/3MjRkB7)
     * @returns {void}
     */
    async deleteFile(fileId, params = {}) {
      const {
        supportsAllDrives = true,
        ...extraParams
      } = params;
      const drive = this.drive();
      return (
        await drive.files.delete({
          fileId,
          supportsAllDrives,
          ...extraParams,
        })
      ).data;
    },
    /**
     * Download a Google Workspace document using the
     * [files.export](https://bit.ly/2Zkrxo8) method
     *
     * @param {string} fileId - the ID value of the file to download
     * @param {object} [params={}] - an object representing parameters used to
     * download a Workspace file
     * @param {string} [params.mimeType] - the MIME type to which to export the
     * document
     * @param {...*} [params.extraParams] - extra/optional parameters to be fed to
     * the GDrive API call, as defined in [the API docs](https://bit.ly/3o6rRRF)
     * @returns the file download
     */
    async downloadWorkspaceFile(fileId, params = {}) {
      const {
        mimeType,
        ...extraParams
      } = params;
      const drive = this.drive();
      return (
        await drive.files.export({
          fileId,
          mimeType,
          ...extraParams,
        }, {
          responseType: "stream",
        })
      ).data;
    },
    /**
     * Create a permission for a file
     *
     * @param {string} fileId - the ID value of the file for which to create a
     * Permission
     * @param {object} [opts={}] - an object representing configuration options
     * used to create a permission
     * @param {string} [opts.role="reader"] - the role granted by this
     * permission. Currently, one of `owner`,`organizer`,`fileOrganizer`,
     * `writer`,`commenter`, `reader`.
     * @param {string} [opts.type] - the type of the grantee. Valid values are:
     * `user`,`group`,`domain`,`anyone`.
     * @param {string} [opts.domain] - the domain to which this permission
     * refers
     * @param {string} [opts.emailAddress] - the email address of the user or
     * group to which this permission refers
     * @param {string} [opts.supportsAllDrives=true] - whether the requesting
     * application supports both My Drives and shared drives
     * @returns the created Permission
     */
    async createPermission(fileId, opts = {}) {
      const {
        role = "reader",
        type,
        domain,
        emailAddress,
        supportsAllDrives = true,
      } = opts;
      const drive = this.drive();
      return (
        await drive.permissions.create({
          fileId,
          supportsAllDrives,
          requestBody: omitEmptyStringValues({
            role,
            type,
            domain,
            emailAddress,
          }),
        })
      ).data;
    },
    /**
     * Get a shared drive
     *
     * @param {string} driveId - the ID value of the drive
     * @param {object} [opts={}] - an object representing configuration options
     * used to get a shared drive
     * @param {boolean} [opts.useDomainAccess] - if the request should issued a
     * domain administrator, granted if the requester an administrator of the
     * domain to which the shared drive belongs
     * @returns the shared drive
     */
    async getSharedDrive(driveId, opts = {}) {
      const { useDomainAdminAccess } = opts;
      const drive = this.drive();
      return (
        await drive.drives.get({
          driveId,
          useDomainAdminAccess,
        })
      ).data;
    },
    /**
     * Search for drives according to the list parameters
     *
     * @param {object} [opts={}] - an object representing configuration options
     * used to search for drives
     * @param {string} [opts.q] - query string for searching shared drives. See
     * the ["Search for shared drives"](https://bit.ly/2XJ1oik) guide for
     * supported syntax.
     * @param {boolean} [opts.useDomainAccess] - if the request should issued a
     * domain administrator, granted if the requester an administrator of the
     * domain to which the shared drive belongs
     * @param {...*} [opts.extraParams] - extra/optional parameters to be fed to
     * the GDrive API call, as defined in [the API docs](https://bit.ly/3CCf4e3)
     * the response
     * @returns a list of drives
     */
    async searchDrives(opts = {}) {
      const {
        q,
        useDomainAdminAccess,
        ...extraParams
      } = opts;
      const drive = this.drive();
      return (
        await drive.drives.list({
          q,
          useDomainAdminAccess,
          ...extraParams,
        })
      ).data;
    },
    /**
     * Create a drive
     *
     * @param {object} [opts={}] - an object representing configuration options
     * used to create a drive
     * @param {string} [opts.name] - the name of the drive to create
     * @param {object} [opts.requestBody] - extra/optional properties to be used
     * in the request body of the GDrive API, as defined in
     * [the API docs](https://bit.ly/2ZiyIgJ)
     * @returns the created drive
     */
    async createDrive(opts = {}) {
      const {
        name,
        requestBody,
      } = opts;
      const drive = this.drive();
      return (
        await drive.drives.create({
          requestId: uuid(),
          requestBody: {
            name,
            ...requestBody,
          },
        })
      ).data;
    },
    /**
     * Update a shared drive
     *
     * @param {string} driveId - the ID value of the drive
     * @param {object} [opts={}] - an object representing configuration options
     * used to update a shared drive
     * @param {boolean} [opts.useDomainAccess] - if the request should issued a
     * domain administrator, granted if the requester an administrator of the
     * domain to which the shared drive belongs
     * @param {object} [opts.requestBody] - extra/optional properties to be used
     * in the request body of the GDrive API, as defined in
     * [the API docs](https://bit.ly/3AxJP3c)
     * @returns the updated shared drive
     */
    async updateSharedDrive(driveId, opts = {}) {
      const {
        useDomainAdminAccess,
        requestBody,
      } = opts;
      const drive = this.drive();
      return (
        await drive.drives.update({
          driveId,
          useDomainAdminAccess,
          requestBody: {
            ...requestBody,
          },
        })
      ).data;
    },
    /**
     * Delete a shared drive
     *
     * @param {string} driveId - the ID value of the drive to delete
     * @returns {void}
     */
    async deleteSharedDrive(driveId) {
      const drive = this.drive();
      return (
        await drive.drives.delete({
          driveId,
        })
      ).data;
    },
    /**
     * Gets information about the user, the user's Drive, and system capabilities. It is a wrapper
     * around the [the `about.get`
     * API]{@link https://developers.google.com/drive/api/v3/reference/about/get}.
     *
     * @param {string} [fields="*"] - the paths of the fields to include in the response
     * @returns an About resource
     */
    async getAbout(fields = "*") {
      const drive = this.drive();
      return (
        await drive.about.get({
          fields,
        })
      ).data;
    },
    /**
     * Get a list of all supported export formats supported by the system for this user
     *
     * @see
     * {@link https://bit.ly/3HRbUqd Google Workspace documents and corresponding export MIME types}
     *
     * @returns a list of supported export formats for each Google Workspace format
     */
    async getExportFormats() {
      return (await this.getAbout("exportFormats")).exportFormats;
    },
  },
};
