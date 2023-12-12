import get from "lodash/get.js";
import retry from "async-retry";
import pcloudSdk from "pcloud-sdk-js";

export default {
  type: "app",
  app: "pcloud",
  propDefinitions: {
    fileId: {
      type: "integer",
      label: "File ID",
      async options() {
        return this.getFileOptions();
      },
    },
    folderId: {
      type: "integer",
      label: "Folder ID",
      async options() {
        return this.getFolderOptions();
      },
      default: 0,
    },
    name: {
      type: "string",
      label: "Name",
      description: "Name of the folder to be created.",
    },
    overwrite: {
      type: "boolean",
      label: "Overwrite?",
      description: `If true, and an entry with the same name already exists, it will be overwritten.
        \\
        Otherwise, an error \`2004\` will be returned instead.`,
      default: false,
      optional: true,
    },
    showDeleted: {
      type: "boolean",
      label: "Show Deleted?",
      description:
        "If true, deleted files and folders that can be undeleted will be displayed.",
      default: false,
      optional: true,
    },
    modifiedTime: {
      type: "integer",
      label: "Modified Time",
      description: "Must be Unix time (seconds).",
      optional: true,
    },
    createdTime: {
      type: "integer",
      label: "Created Time",
      description: `Must be Unix time (seconds).
        \\
        Requires \`Modified Time\` to be set.`,
      optional: true,
    },
  },
  methods: {
    async api() {
      global.locationid = Number(this.$auth.locationid);
      // eslint-disable-next-line no-unused-vars
      /*
      const locations = {
        1: "api.pcloud.com",
        2: "eapi.pcloud.com",
      };
      */
      return pcloudSdk.createClient(
        this.$auth.oauth_access_token,
        "oauth",
      );
    },
    _isRetriableStatusCode(statusCode) {
      return [
        408,
        429,
        500,
      ].includes(statusCode);
    },
    async _withRetries(apiCall) {
      const retryOpts = {
        retries: 3,
        factor: 2,
        minTimeout: 500,
        maxTimeout: 1500,
      };
      return retry(async (bail) => {
        try {
          return await apiCall();
        } catch (err) {
          const statusCode = [
            get(err, [
              "response",
              "status",
            ]),
          ];
          if (!this._isRetriableStatusCode(statusCode)) {
            if (err.result) {
              bail(`
                Error processing pCloud request (result: ${err.result}):
              ${JSON.stringify(err.error)}
            `);
            } else {
              bail(`
                Unexpected error (status code: ${statusCode}):
              ${JSON.stringify(err.message)}
            `);
              console.warn(`Temporary error: ${err.error}`);
            }
          }
          throw err;
        }
      }, retryOpts);
    },
    /**
     * Takes one file and copies it as another file in the user's filesystem.
     * pCloud API domain URL depends on the location of pCLoud data center associated to the
     * account.
     * @params {integer} fileId - ID of the file to copy.
     * @params {integer} toFolderId - ID of the destination folder.
     * @params {string} toName - Name of the destination file.
     * @params {boolean} noOver - If `true` and a file with the specified name already exists,
     * no overwriting will be performed.
     * @params {string} modifiedTime - Must be a UNIX timestamp.
     * seconds.
     * @params {string} createdTime - If specified, file created time is set. It's required to
     * provide `modifiedTime` to set `createdTime`. Must be in unix time seconds.
     * @returns {metadata: array, result: integer } An array with the [metadata](https://docs.pcloud.com/structures/metadata.html) of the newly copied file. A `result` integer that indicates the results of the API operation, 0 means success, a non-zero result means an error occurred, when the result is non-zero an `error` message is included.
     */
    async copyFile(
      fileId,
      toFolderId,
      toName,
      noOver,
      modifiedTime,
      createdTime,
    ) {
      const params = {
        fileid: fileId,
        tofolderid: toFolderId,
      };

      if (toName) {
        params.toname = toName;
      }
      if (noOver) {
        params.noover = 1;
      }
      if (modifiedTime) {
        params.mtime = modifiedTime;
      }
      if (createdTime) {
        params.ctime = createdTime;
      }
      return (
        await this.api()
      ).api("copyfile", {
        params,
      });
    },
    /**
     * Takes one file and moves it to another location in the user's filesystem.
     * pCloud API domain URL depends on the location of pCLoud data center associated to the
     * account.
     * @params {integer} fileId - ID of the file to move.
     * @params {integer} toFolderId - ID of the destination folder.
     * @returns {metadata: array, result: integer } An array with the [metadata](https://docs.pcloud.com/structures/metadata.html) of the newly copied file. A `result` integer that indicates the results of the API operation, 0 means success, a non-zero result means an error occurred, when the result is non-zero an `error` message is included.
     */
    async moveFile(
      fileId,
      toFolderId,
    ) {
      const params = {
        fileid: fileId,
        tofolderid: toFolderId,
      };
      return (
        await this.api()
      ).api("renamefile", {
        params,
      });
    },
    /**
     * Takes one file and renames it.
     * pCloud API domain URL depends on the location of pCLoud data center associated to the
     * account.
     * @params {integer} fileId - ID of the file to rename.
     * @params {string} toName - New name for the file.
     * @returns {metadata: array, result: integer } An array with the [metadata](https://docs.pcloud.com/structures/metadata.html) of the newly copied file. A `result` integer that indicates the results of the API operation, 0 means success, a non-zero result means an error occurred, when the result is non-zero an `error` message is included.
     */
    async renameFile(
      fileId,
      toName,
    ) {
      const params = {
        fileid: fileId,
        toname: toName,
      };
      return (
        await this.api()
      ).api("renamefile", {
        params,
      });
    },
    /**
     * Copies a folder to the specified folder.
     *  @params {integer} folderId - ID of the folder to copy.
     * @params {integer} toFolderId - ID of the destination folder.
     * @params {boolean} noOver - If `true` and files with the same name already exist it will
     * return a `2004` error code. Othrwise files will be overwritten.
     * @params {boolean} copyContentOnly - If set, only the content of source folder will be copied
     * otherwise the folder itself is copied.
     * @returns {metadata: array, result: integer } An array with the [metadata](https://docs.pcloud.com/structures/metadata.html) of the newly copied folder. A `result` integer that indicates the results of the API operation, 0 means success, a non-zero result means an error occurred, when the result is non-zero an `error` message is included.
     */
    async copyFolder(folderId, toFolderId, noOver, copyContentOnly) {
      const params = {};
      params.folderid = folderId;
      params.tofolderid = toFolderId;
      if (noOver) {
        params.noover = 1;
      }
      if (copyContentOnly) {
        params.copycontentonly = 1;
      }
      return (
        await this.api()
      ).api("copyfolder", {
        params,
      });
    },
    /**
     * Creates a folder in the specified folder.
     * @params {string} name - Name of the folder to be created.
     * @params {integer} folderId - ID of the parent folder where the new folder will be created.
     * @returns {metadata: array, result: integer } An array with the [metadata](https://docs.pcloud.com/structures/metadata.html) of the newly created folder. A `result` integer that indicates the results of the API operation, 0 means success, a non-zero result means an error occurred, when the result is non-zero an `error` message is included.
     */
    async createFolder(name, folderId) {
      return (await this.api()).createfolder(name, folderId);
    },
    /**
     * Takes one folder and moves it to another location in the user's filesystem.
     * pCloud API domain URL depends on the location of pCLoud data center associated to the
     * account.
     * @params {integer} folderId - ID of the folder to move.
     * @params {integer} toFolderId - ID of the destination folder.
     * @returns {metadata: array, result: integer } An array with the [metadata](https://docs.pcloud.com/structures/metadata.html) of the newly copied file. A `result` integer that indicates the results of the API operation, 0 means success, a non-zero result means an error occurred, when the result is non-zero an `error` message is included.
     */
    async moveFolder(
      folderId,
      toFolderId,
    ) {
      const params = {
        folderid: folderId,
        tofolderid: toFolderId,
      };
      return (
        await this.api()
      ).api("renamefolder", {
        params,
      });
    },
    /**
     * Takes one folder and renames it.
     * pCloud API domain URL depends on the location of pCLoud data center associated to the
     * account.
     * @params {integer} folderId - ID of the folder to rename.
     * @params {string} toName - New name for the folder.
     * @returns {metadata: array, result: integer } An array with the [metadata](https://docs.pcloud.com/structures/metadata.html) of the newly copied file. A `result` integer that indicates the results of the API operation, 0 means success, a non-zero result means an error occurred, when the result is non-zero an `error` message is included.
     */
    async renameFolder(
      folderId,
      toName,
    ) {
      const params = {
        folderid: folderId,
        toname: toName,
      };
      return (
        await this.api()
      ).api("renamefolder", {
        params,
      });
    },
    /**
     * Downloads one or more files from links supplied in the url parameter.
     * @params {array} urls - URL(s) of the files to download.
     * @params {integer} folderId - ID of the folder, in which to download the files.
     * @returns {metadata: array, result: integer } An array with the [metadata]
     * (https://docs.pcloud.com/structures/metadata.html) of each of the downloaded files. A
     * `result` integer that indicates the results of the API operation, 0 means success, a
     * non-zero result means an error occurred, when the result is non-zero an `error` message is
     * included.
     */
    async downloadFiles(urls, folderId) {
      return (await this.api()).remoteupload(urls.join(" "), folderId);
    },
    /**
     * Gets the dynamically populated options for file related props.
     * @returns {array} An array to use as dynamically populated options in file ID related
     * props.
     */
    async getFileOptions() {
      const folderItems = await this._withRetries(() =>
        this.listContents(
          0, //0 - ID for the root folder
          true,
          null,
          false,
        ));
      let options = [];
      let name = "";
      let populateOptions = function (name, folderItem) {
        if (folderItem.name === "/" || name === "/") {
          name = `${name}${folderItem.name}`;
        } else {
          name = `${name}/${folderItem.name}`;
        }
        if (!folderItem.isfolder) {
          options.push({
            label: name,
            value: folderItem.fileid,
          });
        }
        if (folderItem.isfolder && folderItem.contents.length) {
          folderItem.contents.forEach((content) => {
            populateOptions(name, content);
          });
        } else {
          return;
        }
      };
      populateOptions(name, folderItems);
      return options;
    },
    /**
     * Gets the dynamically populated options for folder related props.
     * @returns {array} An array to use as dynamically populated options in folder ID related
     * props.
     */
    async getFolderOptions() {
      const folders = await this._withRetries(() =>
        this.listContents(
          0, //0 - ID for the root folder
          true,
          null,
          true,
        ));
      const options = [];
      let name = "";
      let populateOptions = function (name, folder) {
        if (folder.name === "/" || name === "/") {
          name = `${name}${folder.name}`;
        } else {
          name = `${name}/${folder.name}`;
        }
        options.push({
          label: name,
          value: folder.folderid,
        });
        if (folder.contents.length) {
          folder.contents.forEach((content) => {
            populateOptions(name, content);
          });
        } else {
          return;
        }
      };
      populateOptions(name, folders);
      return options;
    },
    /**
     * Lists the metadata of the specified folder's contents.
     * pCloud API domain URL depends on the location of pCLoud data center associated to the
     * account.
     * @params {integer} folderId - ID of the folder to list contents. If not specified, the root
     * folder will be used.
     * @params {boolean} recursive - If is set full directory tree will be returned, which means
     * that all directories will have contents filed.
     * @params {boolean} showDeleted - If is set, deleted files and folders that can be undeleted
     * will be displayed.
     * @params {boolean} noFiles - If is set, only the folder (sub)structure will be returned.
     * @params {boolean} noShares - If is set, only user's own folders and files will be displayed.
     * @returns {metadata: array, result: integer } An array with the [metadata](https://docs.pcloud.com/structures/metadata.html) of each of the retrieved files and folders, if `recursive` is set, an additional `contents` element will be presented for the contents of inner folders. A `result` integer that indicates the results of the API operation, 0 means success, a non-zero result means an error occurred, when the result is non-zero an `error` message is included.
     */
    async listContents(folderId, recursive, showDeleted, noFiles, noShares) {
      const optionalParams = {};
      if (recursive) {
        optionalParams.recursive = 1; //Need to use an integer for `recursive`, `showDeleted`, `noFiles`,
        //and `noShares` if `true`
      }
      if (showDeleted) {
        optionalParams.showdeleted = 1;
      }
      if (noFiles) {
        optionalParams.nofiles = 1;
      }
      if (noShares) {
        optionalParams.noshares = 1;
      }
      return (await this.api()).listfolder(folderId, optionalParams);
    },
    /**
     * Uploads a file to the user's filesystem.
     * @params {integer} folderid - ID of the folder where the file will be uploaded.
     * @params {string} name - Name of the file to upload.
     * @params {boolean} renameIfExists - When `true`, the uploaded file will
     * be renamed, if file with
     * the requested name exists in the folder.
     * @params {integer} modifiedTime - If set, file modified time is set. Must be a unix timestamp.
     * @params {integer} createdTime - If set, file created time is set. Must be a unix timestamp.
     * It's required to provide `modifiedTime` to set `createdTime`.
     * @returns {checksums: array, fileids: array, metadata: array, result: integer} A `checksums` array, each element with the file checksums calculated with `md5` and `sha1` algorithms, the `id` of the created file under the one element `fileids` array, and an array with the [metadata](https://docs.pcloud.com/structures/metadata.html) of the newly uploaded file.  A `result` integer that indicates the results of the API operation, 0 means success, a non-zero result means an error occurred, when the result is non-zero an `error` message is included.
     */
    async uploadFile(
      folderid,
      name,
      renameIfExists,
      modifiedTime,
      createdTime,
    ) {
      const params = {
        folderid,
      };
      const files = [
        {
          name,
          file: `/tmp/${name}`,
        },
      ];
      if (renameIfExists) {
        params.renameifexists = 1;
      }
      if (modifiedTime) {
        params.mtime = modifiedTime;
      }
      if (createdTime) {
        params.ctime = createdTime;
      }
      return (
        await this.api()
      ).api("uploadfile", {
        method: "post",
        params,
        files,
      });
    },
  },
};
