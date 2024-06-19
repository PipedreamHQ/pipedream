import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "transifex",
  propDefinitions: {
    file: {
      type: "string",
      label: "File",
      description: "The actual file to be uploaded to the Transifex platform.",
    },
    fileName: {
      type: "string",
      label: "File Name",
      description: "The name this file will be given once uploaded to the platform.",
    },
    resourceId: {
      type: "string",
      label: "Resource ID",
      description: "The ID of the resource.",
      async options() {
        const resources = await this.listResources();
        return resources.map((resource) => ({
          label: resource.name,
          value: resource.id,
        }));
      },
    },
    languageCode: {
      type: "string",
      label: "Language Code",
      description: "The language code of the resource language.",
      async options() {
        const languages = await this.listLanguages();
        return languages.map((language) => ({
          label: language.name,
          value: language.code,
        }));
      },
    },
    taskId: {
      type: "string",
      label: "Task ID",
      description: "The ID of the task.",
    },
    asyncDownloadId: {
      type: "string",
      label: "Async Download ID",
      description: "The ID of the asynchronous download.",
    },
  },
  methods: {
    _baseUrl() {
      return "https://rest.api.transifex.com";
    },
    async _makeRequest(opts = {}) {
      const {
        $ = this,
        method = "GET",
        path = "/",
        headers,
        ...otherOpts
      } = opts;
      return axios($, {
        ...otherOpts,
        method,
        url: this._baseUrl() + path,
        headers: {
          ...headers,
          Authorization: `Bearer ${this.$auth.oauth_access_token}`,
        },
      });
    },
    async listResources(opts = {}) {
      return this._makeRequest({
        path: "/resources",
        ...opts,
      });
    },
    async listLanguages(opts = {}) {
      return this._makeRequest({
        path: "/languages",
        ...opts,
      });
    },
    async uploadFile({
      file, fileName,
    }) {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("file_name", fileName);

      return this._makeRequest({
        method: "POST",
        path: "/resource-strings-async-uploads",
        headers: {
          "Content-Type": "multipart/form-data",
        },
        data: formData,
      });
    },
    async downloadFile({ asyncDownloadId }) {
      return this._makeRequest({
        method: "GET",
        path: `/resource-strings-async-downloads/${asyncDownloadId}`,
        responseType: "arraybuffer",
      });
    },
    async getResourceLanguageStatus({
      resourceId, languageCode,
    }) {
      return this._makeRequest({
        path: `/resource_languages/${resourceId}/${languageCode}/status`,
      });
    },
    async emitResourceLanguageEvent({
      resourceId, languageCode,
    }) {
      const status = await this.getResourceLanguageStatus({
        resourceId,
        languageCode,
      });
      // Logic to emit an event based on the status
      if (status === "completed" || status === "reviewed" || status === "filled") {
        this.$emit(status, {
          summary: `Resource ${resourceId} in language ${languageCode} has status ${status}`,
        });
      }
    },
    async emitTaskStringEvent({ taskId }) {
      // Logic to emit an event when the strings of a task are selected or fully translated
      // Assuming a method getTaskStatus that fetches the task status
      const status = await this.getTaskStatus({
        taskId,
      });
      if (status === "selected" || status === "fully_translated") {
        this.$emit(status, {
          summary: `Task ${taskId} has status ${status}`,
        });
      }
    },
    async getTaskStatus({ taskId }) {
      return this._makeRequest({
        path: `/tasks/${taskId}/status`,
      });
    },
  },
};
