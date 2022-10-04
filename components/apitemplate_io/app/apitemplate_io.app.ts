import { defineApp } from "@pipedream/types";
import { axios } from "@pipedream/platform";

export default defineApp({
  type: "app",
  app: "apitemplate_io",
  propDefinitions: {
    apiEndpoints: {
      type: "string",
      label: "API Endpoints",
      description: "A regional API endpoint is intended for customers in the same region. The data for the request and generated PDFs/images are processed and stored within the region. [see docs](https://apitemplate.io/apiv2/#section/Regional-API-endpoint(s))",
      optional: true,
      options: [
        {
          label: "Default (Singapore)",
          value: "https://rest.apitemplate.io",
        },
        {
          label: "Europe (Frankfurt)",
          value: "https://rest-de.apitemplate.io",
        },
        {
          label: "US East (N. Virginia)",
          value: "https://rest-us.apitemplate.io",
        },
        {
          label: "Australia (Sydney)",
          value: "https://rest-au.apitemplate.io",
        },
        {
          label: "Alternative Default (Singapore)",
          value: "https://rest-alt.apitemplate.io",
        },
        {
          label: "Alternative Europe (Frankfurt)",
          value: "https://rest-alt-de.apitemplate.io",
        },
        {
          label: "Alternative US East (N. Virginia)",
          value: "https://rest-alt-us.apitemplate.io",
        },
      ],
    },
    templateId: {
      type: "string",
      label: "Template Id",
      description: "The ID of the template that you want to use.",
      async options({
        prevContext,
        format,
      }) {
        const limit = 300;
        let offset = 0;
        if (prevContext && Number.isInteger(prevContext.offset)) {
          offset = ((prevContext.offset / limit) + 1) * limit;
        }
        return this.getTemplateOpts(limit, offset, format);
      },
    },
    expiration: {
      type: "integer",
      label: "Expiration",
      description: "Expiration of the generated image in minutes(default to `0`, store permanently).",
      optional: true,
    },
    meta: {
      type: "string",
      label: "Meta",
      description: "Specify an external reference ID for your own reference. It appears in the `list-objects` API.",
      optional: true,
    },
    overrides: {
      type: "any",
      label: "Overrides",
      description: "Array of objects with the property name and the replaced values on the template, as shown below:\n\n`[{\"name\": \"text_name\",\"text\": \"My Name\"}, {\"name\": \"text_quote\",\"text\": \"Lorem ipsum dolor sit...\"}]`",
    },
  },
  methods: {
    _getUrl(api, path) {
      if (api) {
        return `${api}/v2${path}`;
      }
      return `https://rest.apitemplate.io/v2${path}`;
    },
    _getHeaders(headers = {}) {
      return {
        "Authorization": this.$auth.api_key,
        "Content-Type": "application/json",
        ...headers,
      };
    },
    _getRequestParams(opts: any) {
      return {
        ...opts,
        url: this._getUrl(opts.api, opts.path),
        headers: this._getHeaders(),
      };
    },
    async getTemplates($ = this, limit, offset, format) {
      const response = await axios($, this._getRequestParams({
        method: "GET",
        path: "/list-templates",
        params: {
          limit,
          offset,
          format,
        },
      }));
      return response;
    },
    async getTemplateOpts(limit, offset, format) {
      const { templates } = await this.getTemplates(this, limit, offset, format);
      const options = templates.map((template) => ({
        label: template.name,
        value: template.template_id,
      }));
      return {
        context: {
          offset,
        },
        options,
      };
    },
    async createImage($ = this, api, params, data) {
      const response = await axios($, this._getRequestParams({
        method: "POST",
        api,
        path: "/create-image",
        params,
        data,
      }));
      return response;
    },
  },
});
