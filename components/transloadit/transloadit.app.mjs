import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "transloadit",
  propDefinitions: {
    templateId: {
      type: "string",
      label: "Template ID",
      description: "The ID of the template to use for the assembly.",
    },
    assemblyId: {
      type: "string",
      label: "Assembly ID",
      description: "The ID of the assembly.",
    },
    notifyUrl: {
      type: "string",
      label: "Notify URL",
      description: "The URL to send the webhook notification to.",
    },
    fileUrl: {
      type: "string",
      label: "File URL",
      description: "The URL of the file to upload and trigger an assembly.",
    },
    steps: {
      type: "string",
      label: "Steps",
      description: "JSON string defining the assembly processing steps.",
      optional: true,
    },
    files: {
      type: "string[]",
      label: "Files",
      description: "A list of files to process in the assembly.",
    },
  },
  methods: {
    _baseUrl() {
      return "https://api2.transloadit.com";
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
          "Content-Type": "application/json",
          "Authorization": `Transloadit ${this.$auth.api_key}`,
        },
      });
    },
    async createAssembly({
      templateId, steps, files, notifyUrl,
    }) {
      return this._makeRequest({
        method: "POST",
        path: "/assemblies",
        data: {
          params: {
            auth: {
              key: this.$auth.api_key,
            },
            template_id: templateId,
            steps: JSON.parse(steps),
            notify_url: notifyUrl,
          },
          files,
        },
      });
    },
    async getAssemblyStatus({ assemblyId }) {
      return this._makeRequest({
        method: "GET",
        path: `/assemblies/${assemblyId}`,
      });
    },
    async cancelAssembly({ assemblyId }) {
      return this._makeRequest({
        method: "DELETE",
        path: `/assemblies/${assemblyId}`,
      });
    },
    async replayAssemblyNotification({ assemblyId }) {
      return this._makeRequest({
        method: "POST",
        path: `/assembly_notifications/${assemblyId}/replay`,
        data: {
          params: {
            auth: {
              key: this.$auth.api_key,
            },
          },
        },
      });
    },
    async emitAssemblyFinishedEvent() {
      // Logic to handle the webhook for assembly finished
    },
    async emitAssemblyErrorEvent() {
      // Logic to handle the webhook for assembly error
    },
    async emitFileUploadedEvent() {
      // Logic to handle the webhook for file uploaded
    },
    authKeys() {
      console.log(Object.keys(this.$auth));
    },
  },
};
