import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "bannerify",
  propDefinitions: {
    templateId: {
      type: "string",
      label: "Template ID",
      description: "The Bannerify template ID to render. Example: `template_abc123`.",
    },
    modifications: {
      type: "string",
      label: "Modifications JSON",
      description: "Optional JSON object or array of template field modifications. Example: `{\"headline\":\"Hello\"}`.",
      optional: true,
    },
  },
  methods: {
    /**
     * Normalize JSON modifications into the Bannerify API array format.
     *
     * @param {String|Object|Array} modifications - JSON string, object shorthand, or array
     * @returns {Array} Bannerify modifications array
     */
    _parseModifications(modifications) {
      if (!modifications) {
        return [];
      }

      if (typeof modifications === "string" && !modifications.trim()) {
        return [];
      }

      const parsed = typeof modifications === "string"
        ? JSON.parse(modifications)
        : modifications;

      if (Array.isArray(parsed)) {
        return parsed;
      }

      if (!parsed || typeof parsed !== "object") {
        return [];
      }

      return Object.entries(parsed).map(([
        name,
        value,
      ]) => {
        if (value && typeof value === "object" && !Array.isArray(value)) {
          return {
            name,
            ...value,
          };
        }

        return {
          name,
          text: String(value ?? ""),
        };
      });
    },
    _request({
      $, path, data, ...opts
    } = {}) {
      return axios($, {
        method: "POST",
        url: `https://api.bannerify.co${path}`,
        headers: {
          "Content-Type": "application/json",
        },
        data: {
          apiKey: this.$auth.api_key,
          ...data,
        },
        ...opts,
      });
    },
    /**
     * Render and store an image from a Bannerify template.
     *
     * @param {Object} opts - Render options
     * @param {String} opts.templateId - Bannerify template ID
     * @param {String} [opts.format=png] - Image format
     * @param {String|Object|Array} [opts.modifications] - Template field modifications
     * @returns {Object} Bannerify render response
     */
    renderStoredImage({
      $, templateId, format, modifications, ...opts
    } = {}) {
      return this._request({
        $,
        path: "/v1/templates/createStoredImage",
        data: {
          templateId,
          format,
          modifications: this._parseModifications(modifications),
        },
        ...opts,
      });
    },
    /**
     * Render and store a PDF from a Bannerify template.
     *
     * @param {Object} opts - Render options
     * @param {String} opts.templateId - Bannerify template ID
     * @param {String|Object|Array} [opts.modifications] - Template field modifications
     * @returns {Object} Bannerify render response
     */
    renderStoredPdf({
      $, templateId, modifications, ...opts
    } = {}) {
      return this._request({
        $,
        path: "/v1/templates/createStoredPdf",
        data: {
          templateId,
          modifications: this._parseModifications(modifications),
        },
        ...opts,
      });
    },
  },
};
