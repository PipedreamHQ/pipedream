import { axios } from "@pipedream/platform";
import languages from "./common/languages.mjs";

export default {
  type: "app",
  app: "maestra",
  propDefinitions: {
    operationType: {
      type: "string",
      label: "Operation Type",
      description: "The type of operation to perform with the file",
      options: [
        "transcription",
        "caption",
        "voiceover",
      ],
    },
    fileUrl: {
      type: "string",
      label: "File URL",
      description: "The URL of the file to upload",
    },
    fileId: {
      type: "string",
      label: "File ID",
      description: "The ID of the file to translate",
      async options() {
        const files = await this.listFiles();
        return Object.entries(files)
          .reduce((acc, [
            fileId,
            { fileName: label },
          ]) => {
            return [
              ...acc,
              {
                label,
                value: fileId,
              },
            ];
          }, []);
      },
    },
    targetLanguages: {
      type: "string[]",
      label: "Target Languages",
      description: "The languages to translate the file to",
      options: languages,
    },
    folderPath: {
      type: "string",
      label: "Folder Path",
      description: "The path of the folder where the file is stored, e.g., `root/-MbixMpLJ05xgjvwNnPm/-McCIYUrFqeXQGrEqQpR`",
      optional: true,
      async options() {
        const response = await this.listFolders();
        return this.getPathOptions(response);
      },
    },
    channelId: {
      type: "string",
      label: "Channel ID",
      description: "The ID of the channel where the file is stored",
      optional: true,
      async options() {
        const response = await this.listChannels();
        return Object.entries(response)
          .reduce((acc, [
            value,
            { channelName: label },
          ]) => {
            return [
              ...acc,
              {
                label,
                value,
              },
            ];
          }, []);
      },
    },
  },
  methods: {
    getUrl(path) {
      return `https://${this.$auth.base_url}/api${path}`;
    },
    getHeaders(headers) {
      return {
        ...headers,
        apiKey: this.$auth.api_key,
      };
    },
    _makeRequest({
      $ = this, path, headers, ...args
    } = {}) {
      const config = {
        ...args,
        url: this.getUrl(path),
        headers: this.getHeaders(headers),
      };
      return axios($, config);
    },
    post(args = {}) {
      return this._makeRequest({
        method: "POST",
        ...args,
      });
    },
    listFiles(args = {}) {
      return this._makeRequest({
        path: "/getFiles",
        ...args,
      });
    },
    listFolders(args = {}) {
      return this._makeRequest({
        path: "/getFolders",
        ...args,
      });
    },
    listChannels(args = {}) {
      return this._makeRequest({
        path: "/getChannels",
        ...args,
      });
    },
    getPathOptions(obj, currentPath = "", currentLabel = "") {
      const initialSate = currentLabel
        ? [
          {
            label: currentLabel,
            value: currentPath,
          },
        ]
        : [];
      return Object.keys(obj)
        .reduce((paths, key) => {
          if (obj[key] instanceof Object && key !== "folderName") {
            const newPath = `${currentPath}/${key}`;
            const newLabel = obj[key].folderName || key;
            return [
              ...paths,
              ...this.getPathOptions(obj[key], newPath, newLabel),
            ];
          }
          return paths;
        }, initialSate)
        .filter(Boolean);
    },
  },
};
