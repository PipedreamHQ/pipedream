import { XMLParser } from "fast-xml-parser";
import { axios } from "@pipedream/platform";
import constants from "./common/constants.mjs";

const parser = new XMLParser({
  ignoreAttributes: false,
  arrayMode: true,
  textNodeName: "value",
});

export default {
  type: "app",
  app: "azure_storage",
  propDefinitions: {
    containerName: {
      type: "string",
      label: "Container Name",
      description: "The name of the container within the specified storage account.",
      async options() {
        const { EnumerationResults: { Containers: { Container: containers } } } =
          await this.listContainers();
        if (!containers) {
          return [];
        }
        return Array.isArray(containers)
          ? containers.map(({ Name: value }) => value)
          : [
            containers.Name,
          ];
      },
    },
    blobName: {
      type: "string",
      label: "Blob Name",
      description: "The name of the blob within the specified container.",
      async options({ containerName }) {
        const { EnumerationResults: { Blobs: { Blob: blobs } } } = await this.listBlobs({
          containerName,
        });
        if (!blobs) {
          return [];
        }
        return Array.isArray(blobs)
          ? blobs.map(({ Name: value }) => value)
          : [
            blobs.Name,
          ];
      },
    },
  },
  methods: {
    getUrl(path) {
      const { storage_account_name: storageAccount } = this.$auth;
      const baseUrl = constants.BASE_URL
        .replace(constants.STORAGE_ACCOUNT_PLACEHOLDER, storageAccount);
      return `${baseUrl}${path}`;
    },
    getHeaders(headers) {
      return {
        ...headers,
        "x-ms-date": new Date().toUTCString(),
        "x-ms-version": constants.API_VERSION,
        "Authorization": `Bearer ${this.$auth.oauth_access_token}`,
      };
    },
    async _makeRequest({
      $ = this, path, headers, jsonOutput = true, ...args
    } = {}) {
      let response;
      try {
        response = await axios($, {
          ...args,
          url: this.getUrl(path),
          headers: this.getHeaders(headers),
        });

      } catch (error) {
        const errorResponse = parser.parse(error.response.data);
        if (errorResponse.Error) {
          throw new Error(JSON.stringify(errorResponse.Error, null, 2));
        }
        throw error;
      }

      return jsonOutput
        ? parser.parse(response)
        : response;
    },
    put(args = {}) {
      return this._makeRequest({
        method: "PUT",
        ...args,
      });
    },
    delete(args = {}) {
      return this._makeRequest({
        method: "DELETE",
        ...args,
      });
    },
    listContainers(args = {}) {
      return this._makeRequest({
        ...args,
        path: "/",
        params: {
          ...args.params,
          comp: "list",
        },
      });
    },
    listBlobs({
      containerName, ...args
    } = {}) {
      return this._makeRequest({
        ...args,
        path: `/${containerName}`,
        params: {
          ...args.params,
          restype: "container",
          comp: "list",
        },
      });
    },
  },
};
