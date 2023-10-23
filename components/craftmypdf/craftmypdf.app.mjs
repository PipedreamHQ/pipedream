import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "craftmypdf",
  propDefinitions: {
    cloudStorage: {
      type: "integer",
      label: "Cloud Storage",
      description: "Upload the generated PDFs/images to our storage CDN(Except export_type=file), default to `1`. If you have configured `Post Actions` to upload the PDFs/Images to your own S3, please set it to `0`.",
    },
    data: {
      type: "string",
      label: "Data",
      description: "JSON data based on the template structure.",
    },
    expiration: {
      type: "integer",
      label: "Expiration (in minutes)",
      min: 1,
      max: 1440,
      description: "Expiration of the generated PDF in minutes. Default to 5 minutes. Range between 1 minute and 24 hours.",
    },
    loadDataFrom: {
      type: "string",
      label: "Load Data From",
      description: "Load data from an external URL. If this is specified, it will overwrite the `data`` property.",
    },
    outputFile: {
      type: "string",
      label: "Output File",
      description: "Default to 'output.pdf'.",
    },
    templateId: {
      type: "string",
      label: "Template Id",
      description: "The Id of the template.",
      async options({ page }) {
        const { templates } = await this.listTemplates({
          params: {
            offset: page * 300,
          },
        });

        return templates.map(({
          template_id: value, name: label,
        }) => ({
          label,
          value,
        }));
      },
    },
    templateVersion: {
      type: "string",
      label: "Template Version",
      description: "To generate a PDF using a specific version of the template. We use the latest template version unless you specify otherwise.",
      async options({
        page, templateId,
      }) {
        const { versions } = await this.listTemplateVersions({
          params: {
            offset: page * 300,
            template_id: templateId,
          },
        });

        return versions.map(({
          version: value, description: label,
        }) => ({
          label,
          value,
        }));
      },
    },
  },
  methods: {
    _apiUrl() {
      return "https://api.craftmypdf.com/v1";
    },
    _getHeaders() {
      return {
        "X-API-KEY": this.$auth.api_key,
      };
    },
    async _makeRequest({
      $ = this, path, ...opts
    }) {
      const config = {
        url: `${this._apiUrl()}/${path}`,
        headers: this._getHeaders(),
        ...opts,
      };
      return axios($, config);
    },
    createEditorSession(args = {}) {
      return this._makeRequest({
        method: "POST",
        path: "create-editor-session",
        ...args,
      });
    },
    createImage(args = {}) {
      return this._makeRequest({
        method: "POST",
        path: "create-image",
        ...args,
      });
    },
    createPDF(args = {}) {
      return this._makeRequest({
        method: "POST",
        path: "create",
        ...args,
      });
    },
    listTemplates(args = {}) {
      return this._makeRequest({
        path: "list-templates",
        ...args,
      });
    },
    listTemplateVersions(args = {}) {
      return this._makeRequest({
        path: "list-template-versions",
        ...args,
      });
    },
    mergePDF(args = {}) {
      return this._makeRequest({
        method: "POST",
        path: "create-merge",
        ...args,
      });
    },
  },
};
