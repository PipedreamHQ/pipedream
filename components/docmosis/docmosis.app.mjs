import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "docmosis",
  propDefinitions: {
    templateName: {
      type: "string",
      label: "Template Name",
      description: "The name of the template to merge data with",
      async options() {
        const { templateList } = await this.listTemplates();
        return templateList
          .filter(({ name }) => !name.endsWith("/"))
          .map(({ name: value }) => value);
      },
    },
    data: {
      type: "object",
      label: "Data To Merge",
      description: "The data to be merged with the template",
    },
    outputName: {
      type: "string",
      label: "Output Name",
      description: "The name of the generated document. Eg `result.pdf`",
    },
    outputFormat: {
      type: "string",
      label: "Output Format",
      description: "The output format of the generated document",
      optional: true,
      options: [
        "pdf",
        "docx",
        "odt",
        "rtf",
        "html",
        "txt",
      ],
    },
  },
  methods: {
    getUrl(path) {
      return `${this.$auth.location_base_url}${path}`;
    },
    getHeaders(headers) {
      return {
        ...headers,
        "Content-Type": "application/json",
      };
    },
    getAuthData(data) {
      return {
        ...data,
        accessKey: this.$auth.access_key,
      };
    },
    async _makeRequest({
      $ = this, path = "", headers, data, ...args
    } = {}) {
      try {
        return await axios($, {
          ...args,
          url: this.getUrl(path),
          headers: this.getHeaders(headers),
          data: this.getAuthData(data),
        });

      } catch (error) {
        if (Buffer.isBuffer(error?.response?.data)) {
          const decoder = new TextDecoder();
          const msg = decoder.decode(error.response.data);
          throw new Error(msg);
        }
        throw error;
      }
    },
    post(args = {}) {
      return this._makeRequest({
        method: "POST",
        ...args,
      });
    },
    listTemplates(args = {}) {
      return this.post({
        path: "/listTemplates",
        ...args,
      });
    },
  },
};
