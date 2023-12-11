import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "gravity_forms",
  propDefinitions: {
    formId: {
      type: "string",
      label: "Form ID",
      description: "The ID of the form for which to create or get entries.",
      async options({ prevContext }) {
        const page = prevContext.page
          ? prevContext.page
          : 0;
        const forms = await this.getForms({
          page,
        });
        return {
          options: forms.map((form) => ({
            label: form.title,
            value: form.id,
          })),
          context: {
            page: page + 1,
          },
        };
      },
    },
    entryData: {
      type: "object",
      label: "Entry Data",
      description: "The form data to submit, using field input names (e.g., `input_1`) as keys.",
    },
    fieldValues: {
      type: "object",
      label: "Field Values",
      description: "An object of dynamic population parameter keys with their corresponding values used to populate the fields.",
      optional: true,
    },
    targetPage: {
      type: "integer",
      label: "Target Page",
      description: "For multi-page forms, indicates which page would be loaded next if the current page passes validation.",
      optional: true,
    },
    sourcePage: {
      type: "integer",
      label: "Source Page",
      description: "For multi-page forms, indicates which page was active when the values were submitted for validation.",
      optional: true,
    },
    additionalProps: {
      type: "object",
      label: "Additional Properties",
      description: "An object containing additional properties for the entry.",
      optional: true,
    },
  },
  methods: {
    _baseUrl() {
      return "https://yourdomain.gravityforms.com/wp-json/gf/v2";
    },
    async _makeRequest(opts = {}) {
      const {
        $ = this,
        method = "GET",
        path,
        headers,
        data,
        params,
        ...otherOpts
      } = opts;
      return axios($, {
        method,
        url: `${this._baseUrl()}${path}`,
        headers: {
          ...headers,
          "Authorization": `Bearer ${this.$auth.oauth_access_token}`,
        },
        data,
        params,
        ...otherOpts,
      });
    },
    async getForms({ page }) {
      return this._makeRequest({
        path: "/forms",
        params: {
          page,
        },
      });
    },
    async createEntry({
      formId, entryData, additionalProps = {},
    }) {
      const data = {
        ...entryData,
        ...additionalProps,
      };
      return this._makeRequest({
        method: "POST",
        path: `/forms/${formId}/entries`,
        data,
      });
    },
    async submitForm({
      formId, entryData, fieldValues, targetPage, sourcePage, additionalProps = {},
    }) {
      const data = {
        ...entryData,
        field_values: fieldValues,
        target_page: targetPage,
        source_page: sourcePage,
        ...additionalProps,
      };
      return this._makeRequest({
        method: "POST",
        path: `/forms/${formId}/submissions`,
        data,
      });
    },
  },
};
