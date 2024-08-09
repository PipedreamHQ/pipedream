import "isomorphic-fetch";
import { Client } from "@microsoft/microsoft-graph-client";
import get from "lodash.get";
import mimeTypes from "./sources/common/mime-types.mjs";
import httpRequest from "./common/httpRequest.mjs";

export default {
  type: "app",
  app: "microsoft_onedrive",
  propDefinitions: {
    folder: {
      type: "string",
      label: "Folder",
      description: "The folder to watch for new files. Use the \"Load More\" button to load subfolders.",
      async options({
        driveId, folderId, prevContext,
      }) {
        const responses = await Promise.all((prevContext.options ?? [
          {
            value: folderId,
          },
        ]).map(async ({
          label, value,
        }) => {
          const drivePath = this._getDrivePath(driveId);
          const driveItemPath = this._getDriveItemPath(value);
          const firstLink = drivePath + driveItemPath + "/children";
          const url = get(prevContext, "nextLink", firstLink);

          const response = await this.client()
            .api(url)
            .select(
              "folder",
              "id",
              "name",
            )
            .orderby("name")
            .get();

          const {
            "@odata.nextLink": nextLink,
            "value": children,
          } = response;

          const folders = children.filter((child) => !!child.folder);

          const options = folders.map((folder) => ({
            value: folder.id,
            label: (label
              ? `${label} > `
              : "") + folder.name,
          }));

          return {
            options,
            context: {
              nextLink,
              options,
            },
          };
        }));

        return {
          options: responses.flatMap(({ options }) => options),
          context: {
            nextLink: responses.find(({ context }) => !!context.nextLink)?.context.nextLink,
            options: responses.flatMap(({ context }) => context.options),
          },
        };
      },
    },
    fileTypes: {
      type: "string[]",
      label: "File Types",
      description: "The types of files to watch for",
      optional: true,
      options: mimeTypes,
    },
    sharedFolderReference: {
      type: "string",
      label: "Shared Folder Reference",
      description: "The reference of the shared folder which the the new folder should be created.\n\nE.g. `/drives/{driveId}/items/{folderId}/children`",
      async options() {
        const { value } = await this.httpRequest({
          url: "/sharedWithMe",
        });
        return value.map((shared) => ({
          label: shared.name,
          value: `/drives/${shared.remoteItem.parentReference.driveId}/items/${shared.remoteItem.id}/children`,
        }));
      },
    },
    fileId: {
      type: "string",
      label: "File ID",
      description: "The file to download. You can either search for the file here, provide a custom *File ID*, or use the `File Path` prop to specify the path directly.",
      useQuery: true,
      async options({
        query, excludeFolders = true,
      }) {
        const response = query
          ? await this.httpRequest({
            url: `/search(q='${query}')?select=folder,name,id`,
          })
          : await this.listDriveItems();
        const values = excludeFolders
          ? response.value.filter(({ folder }) => !folder)
          : response.value;
        return values
          .map(({
            name, id,
          }) => ({
            label: name,
            value: id,
          }));
      },
    },
    excelFileId: {
      type: "string",
      label: "Spreadsheet",
      description: "**Search for the file by name.** Only xlsx files are supported.",
      useQuery: true,
      async options({ query }) {
        const response = await this.httpRequest({
          url: `/search(q='${query ?? ""} .xlsx')?select=name,id`,
        });
        return response.value
          .filter(({ name }) => name.endsWith(".xlsx"))
          .map(({
            name, id,
          }) => ({
            label: name,
            value: id,
          }));
      },
    },
    tableName: {
      type: "string",
      label: "Table name",
      description: "This is set in the **Table Design** tab of the ribbon.",
      async options({ itemId }) {
        const response = await this.httpRequest({
          url: `/items/${itemId}/workbook/tables?$select=name`,
        });
        return response.value.map(({ name }) => name);
      },
    },
    excludeFolders: {
      type: "boolean",
      label: "Exclude Folders?",
      description: "Set to `true` to return only files in the response. Defaults to `false`",
      optional: true,
    },
  },
  methods: {
    httpRequest,
    /**
     * @returns Microsoft Graph Client instance
     */
    client() {
      return new Client.initWithMiddleware({
        authProvider: {
          getAccessToken: () => Promise.resolve(this.$auth.oauth_access_token),
        },
      });
    },
    /**
     * This is a utility method that returns the path to a OneDrive drive based
     * on its identifier, or the authenticated user's drive if an identifier is
     * not specified.
     *
     * @param {string}  [driveId] the OneDrive drive identifier. When not
     * provided, the method returns the path of the authenticated user's drive.
     * @returns the path to the specified drive
     */
    _getDrivePath(driveId) {
      return driveId
        ? `/drives/${driveId}`
        : "/me/drive";
    },
    /**
     * This is a utility method that returns the path to a OneDrive item based
     * on its identifier, or the root if an identifier is not specified.
     *
     * @param {string}  [driveItemId] the OneDrive item identifier. When not
     * provided, the method returns the path of the root item.
     * @returns the path to the specified drive
     */
    _getDriveItemPath(driveItemId) {
      return driveItemId
        ? `/items/${driveItemId}`
        : "/root";
    },
    _subscriptionsEndpoint(id) {
      return id
        ? `/subscriptions/${id}`
        : "/subscriptions";
    },
    _getDefaultHookExpirationDateTime() {
      // 30 days from now
      const futureTimestamp = Date.now() + 43200 * 60 * 1000;
      return new Date(futureTimestamp).toISOString();
    },
    /**
     * This method creates a [OneDrive webhook](https://bit.ly/2PxfQ9j) to
     * monitor a specific resource, defaulted to the authenticated user's drive.
     *
     * @param {string}  notificationUrl the target URL of the webhook
     * @param {object}  [opts] an object containing the different options for
     * the hook creation
     * @param {string}  [opts.driveId] the resource to which the webhook will
     * subscribe for events
     * @param {string}  [opts.expirationDateTime] the timestamp of the hook
     * subscription expiration, in ISO-8601 format. Defaults to 30 days after
     * the time this method is called.
     * @returns the ID of the created webhook
     */
    async createHook(notificationUrl, {
      driveId,
      expirationDateTime = this._getDefaultHookExpirationDateTime(),
    } = {}) {
      return new Promise((resolve, reject) => {
        this.client()
          .api(this._subscriptionsEndpoint())
          .post({
            notificationUrl,
            resource: this._getDrivePath(driveId) + "/root",
            expirationDateTime,
            changeType: "updated",
          })
          .then((data) => resolve(data.id))
          .catch((err) => reject(err));
      });
    },
    /**
     * This method performs an update to a [OneDrive
     * webhook](https://bit.ly/2PxfQ9j). An example of such operation is to
     * extend the expiration time of a webhook subscription.
     *
     * @param {string}  id the ID of the webhook to update
     * @param {object}  [opts] the fields to update in the webhook
     * @param {string}  [opts.expirationDateTime] the new expiration date of the
     * webhook subscription
     */
    async updateHook(id, { expirationDateTime } = {}) {
      await this.client()
        .api(this._subscriptionsEndpoint(id))
        .patch({
          expirationDateTime,
        });
    },
    /**
     * This method deletes an existing [OneDrive
     * webhook](https://bit.ly/2PxfQ9j)
     *
     * @param {string}  id the ID of the webhook to delete
     */
    async deleteHook(id) {
      await this.client()
        .api(this._subscriptionsEndpoint(id))
        .delete();
    },
    /**
     * This method returns a parameterized [OneDrive Delta
     * Link](https://bit.ly/3fNawcs) for a particular drive and/or item
     * (defaulting to the root of the authenticated user's drive). The link will
     * also include additional query parameters, depending on the options
     * provded by the caller.
     *
     * @param {object}  [opts] an object containing the different options to
     * customize the Delta Link
     * @param {string}  [opts.driveId] the OneDrive drive identifier. When not
     * provided, the method uses the ID of the authenticated user's drive.
     * @param {string}  [opts.folderId] the top-level folder that the returned
     * Delta Link will track. When left unset, the link will refer to the entire
     * drive.
     * @param {number}  [opts.pageSize] the size of the page that a call to the
     * returned Delta Link will retrieve (see the `$top` parameter in the [Delta
     * Link docs](https://bit.ly/3sRzRpn))
     * @param {string}  [opts.token] a [Delta Link
     * token](https://bit.ly/3ncApEf), which will be directly added to the
     * returned link. Especially useful when retrieving the _latest_ Delta Link.
     * @returns a [OneDrive Delta Link](https://bit.ly/3fNawcs)
     */
    getDeltaLink({
      driveId,
      folderId,
      pageSize = null,
      token = "latest",
    } = {}) {
      const drivePath = this._getDrivePath(driveId);
      const driveItemPath = this._getDriveItemPath(folderId);
      const url = drivePath + driveItemPath + "/delta";

      const params = new URLSearchParams();
      if (pageSize) {
        params.set("$top", Math.max(pageSize, 1));
      }
      if (token) {
        params.set("token", token);
      }
      const paramsString = params.toString();

      return paramsString
        ? `${url}?${paramsString}`
        : url;
    },
    /**
     * This method retrieves the [latest OneDrive Delta
     * Link](https://bit.ly/3wB5d5O) for the authenticated user's drive
     *
     * @param {object}  [opts] an object containing the different options to
     * customize the retrieved Delta Link
     * @param {string}  [opts.driveId] the OneDrive drive identifier. When not
     * provided, the method uses the ID of the authenticated user's drive.
     * @param {string}  [opts.folderId] the top-level folder to track with the
     * Delta Link. When left unset, the link will refer to the entire drive.
     * @returns the [latest OneDrive Delta Link](https://bit.ly/3wB5d5O)
     */
    async getLatestDeltaLink({
      driveId, folderId,
    } = {}) {
      const drivePath = this._getDrivePath(driveId);
      const driveItemPath = this._getDriveItemPath(folderId);
      const response = await this.client()
        .api(drivePath + driveItemPath + "/delta?token=latest")
        .get();
      return response["@odata.deltaLink"];
    },
    /**
     * This generator method scans the latest updated items in a OneDrive drive
     * based on the provided Delta Link. It yields drive items until the updated
     * items collection is exhausted, after which it finally returns the Delta
     * Link to use in future scans.
     *
     * @param {string}  deltaLink the [OneDrive Delta
     * Link](https://bit.ly/3fNawcs) from where to start scanning the drive's
     * items
     * @yields the next updated item in the drive
     * @returns the Delta Link to use in the next drive scan
     */
    async *scanDeltaItems(deltaLink) {
      const client = this.client();

      let url = deltaLink;
      while (url) {
        // See the docs for more information on the format of the delta API
        // response: https://bit.ly/31I0wZP
        const {
          "@odata.nextLink": nextLink,
          "@odata.deltaLink": nextDeltaLink,
          "value": driveItems,
        } = await client.api(url).get();

        for (const driveItem of driveItems) {
          yield driveItem;
        }

        if (driveItems.length === 0 || nextDeltaLink) {
          return nextDeltaLink;
        }

        url = nextLink;
      }
    },
    createLink({
      driveItemId, ...args
    } = {}) {
      const client = this.client();
      return client
        .api(`/me/drive/items/${driveItemId}/createLink`)
        .post(args);
    },
    createFolder({
      folderName, parentFolderId, sharedFolderReference,
    }) {
      let url = "/root/children";
      if (parentFolderId) {
        url = `/items/${parentFolderId}/children`;
      }
      if (sharedFolderReference) {
        url = sharedFolderReference;
      }
      return this.httpRequest({
        url,
        useSharedDrive: !!sharedFolderReference,
        headers: {
          "Content-Type": "application/json",
        },
        data: {
          name: folderName,
          folder: {},
          ["@microsoft.graph.conflictBehavior"]: "rename",
        },
        method: "POST",
      });
    },
    getExcelTable({
      itemId, tableName, ...args
    }) {
      return this.httpRequest({
        url: `/items/${itemId}/workbook/tables/${tableName}/range`,
        ...args,
      });
    },
    uploadFile({
      uploadFolderId, name, ...args
    }) {
      return this.httpRequest({
        url: `/items/${uploadFolderId}:/${encodeURI(name)}:/content`,
        headers: {
          "Content-Type": "application/octet-stream",
        },
        method: "PUT",
        ...args,
      });
    },
    listDriveItems(args = {}) {
      const client = this.client();
      return client
        .api("/me/drive/root/children")
        .get(args);
    },
  },
};
