import { axios } from "@pipedream/platform";
import constants from "./constants.mjs";

export default {
  type: "app",
  app: "typeform",
  propDefinitions: {
    formId: {
      type: "string",
      label: "Form",
      description: "Unique ID for the form, which you can find in your form URL. For example, in the URL, `https://mysite.typeform.com/to/u6nXL7`, the form_id is `u6nXL7`.",
      async options({ page }) {
        const { items } = await this.getForms({
          params: {
            page: page + 1, // pipedream page 0-indexed, typeform is 1
            page_size: 10,
          },
        });
        return items.map((form) => {
          return {
            label: form.title,
            value: form.id,
          };
        });
      },
    },
    search: {
      type: "string",
      label: "Search",
      description: "Returns items that contain the specified string.",
      optional: true,
    },
    pageSize: {
      type: "integer",
      label: "Page size",
      description: "Maximum number of responses. Maximum value is 1000. If your typeform has more than 1000 responses, use the `since`/`until` or `before`/`after` parameters to narrow the scope of your request.",
      optional: true,
      default: 25,
    },
    page: {
      type: "integer",
      label: "Page number",
      description: "The page of results to retrieve. Default `1` is the first page of results.",
      optional: true,
      default: 1,
    },
    since: {
      type: "string",
      label: "Since",
      description: "Limit request to responses submitted since the specified date and time. Could be passed as int (timestamp in seconds) or in ISO 8601 format, UTC time, to the second, with `T` as a delimiter between the date and time (`2020-03-20T14:00:59`).",
      optional: true,
    },
    until: {
      type: "string",
      label: "Until",
      description: "Limit request to responses submitted until the specified date and time. Could be passed as int (timestamp in seconds) or in ISO 8601 format, UTC time, to the second, with `T` as a delimiter between the date and time (`2020-03-20T14:00:59`).",
      optional: true,
    },
    after: {
      type: "string",
      label: "After",
      description: "Limit request to responses submitted after the specified token. Could not be used together with `sort` parameter, as it sorts responses in the order that the system processed them (`submitted_at`). This ensures that you can traverse the complete set of responses without repeating entries.",
      optional: true,
    },
    before: {
      type: "string",
      label: "Before",
      description: "Limit request to responses submitted before the specified token. Could not be used together with `sort` parameter, as it sorts responses in the order that the system processed them (`submitted_at`). This ensures that you can traverse the complete set of responses without repeating entries.",
      optional: true,
    },
    title: {
      type: "string",
      label: "Title",
      description: "Title to use for the typeform",
    },
    workspaceHref: {
      type: "string",
      label: "Workspace",
      description: "URL of the workspace to use for the typeform. If you don't specify a URL for the workspace, Typeform saves the form in the default workspace.",
      optional: true,
      async options({ page }) {
        const { items } = await this.getWorkspaces({
          params: {
            page_size: 10,
            page: page + 1, // pipedream page 0-indexed, github is 1
          },
        });

        return items.map(({
          name, self,
        }) => ({
          label: name,
          value: self.href,
        }));
      },
    },
    fieldId: {
      type: "string",
      label: "Field",
      description: "Unique ID for the field",
      async options({
        formId, allowedFields = constants.ALL_FIELD_TYPES,
      }) {
        const { fields } =
          await this.getForm({
            formId,
          });

        if (!fields) {
          return [];
        }

        return fields.reduce((reduction, field) => {
          if (!allowedFields.includes(field.type)) {
            return reduction;
          }

          return [
            ...reduction,
            {
              label: field.title,
              value: field.id,
            },
          ];
        }, []);
      },
    },
    query: {
      type: "string",
      label: "Query",
      description: "Limit request to only responses that include the specified string. The string will be escaped and it will be matched against all answers fields, hidden fields and variables values.",
    },
    responseId: {
      type: "string",
      label: "Response",
      description: "The unique ID for the response (.e.g., `21085286190ffad1248d17c4135ee56f`)",
      async options({
        page, formId, fieldId,
      }) {
        const { items: responses } = await this.getResponses({
          formId,
          params: {
            answered_fields: fieldId,
            page_size: 20,
            page: page + 1,
          },
        });

        return responses.map((response) => ({
          label: response.response_id,
          value: response.response_id,
        }));
      },
    },
    workspaceId: {
      type: "string",
      label: "Workspace ID",
      description: "Retrieve typeforms for the specified workspace.",
      optional: true,
      async options({ page }) {
        const { items } = await this.getWorkspaces({
          params: {
            page_size: 10,
            page: page + 1, // pipedream page 0-indexed, github is 1
          },
        });

        return items.map(({
          name, id,
        }) => ({
          label: name,
          value: id,
        }));
      },
    },
  },
  methods: {
    async _makeRequest(opts) {
      const {
        $,
        fileUrl,
        path,
        ...otherOpts
      } = opts;

      const baseUrl = `${constants.BASE_URL}${path}`;
      const url = fileUrl ?? baseUrl;

      const authorization = `Bearer ${this.$auth.oauth_access_token}`;
      const headers = {
        ...otherOpts?.headers,
        authorization,
      };

      const config = {
        ...otherOpts,
        headers,
        url,
        timeout: 10000,
      };

      return await axios($ ?? this, config);
    },
    async getFile({
      $, fileUrl,
    }) {
      return await this._makeRequest({
        $,
        fileUrl,
        responseType: "stream",
      });
    },
    async getWorkspaces({
      $, params,
    } = {}) {
      return await this._makeRequest({
        $,
        method: "get",
        path: "/workspaces",
        params,
      });
    },
    async getForms({
      $, params,
    } = {}) {
      return await this._makeRequest({
        $,
        method: "get",
        path: "/forms",
        params,
      });
    },
    async getImages($) {
      return await this._makeRequest({
        $,
        method: "get",
        path: "/images",
      });
    },
    async getForm({
      $, formId,
    } = {}) {
      return await this._makeRequest({
        $,
        method: "get",
        path: `/forms/${formId}`,
      });
    },
    async deleteForm({
      $, formId,
    } = {}) {
      return await this._makeRequest({
        $,
        method: "delete",
        path: `/forms/${formId}`,
      });
    },
    async createForm({
      $, data,
    } = {}) {
      return await this._makeRequest({
        $,
        method: "post",
        path: "/forms",
        data,
      });
    },
    async patchForm({
      $, formId, data,
    } = {}) {
      return await this._makeRequest({
        $,
        method: "patch",
        path: `/forms/${formId}`,
        data,
      });
    },
    async updateForm({
      $, formId, data,
    } = {}) {
      return await this._makeRequest({
        $,
        method: "put",
        path: `/forms/${formId}`,
        data,
      });
    },
    async createImage({
      $, data,
    } = {}) {
      return await this._makeRequest({
        $,
        method: "post",
        path: "/images",
        data,
      });
    },
    async deleteImage({
      $, imageId,
    } = {}) {
      return await this._makeRequest({
        $,
        method: "delete",
        path: `/images/${imageId}`,
      });
    },
    async getResponses({
      $, formId, params,
    } = {}) {
      return await this._makeRequest({
        $,
        method: "get",
        path: `/forms/${formId}/responses`,
        params,
      });
    },
    async getResponseFile({
      $, formId, responseId, fieldId, filename,
    } = {}) {
      return await this._makeRequest({
        $,
        method: "get",
        path: `/forms/${formId}/responses/${responseId}/fields/${fieldId}/files/${filename}`,
        responseType: "stream",
      });
    },
    async createHook(opts = {}) {
      const {
        formId,
        endpoint,
        tag,
        secret,
      } = opts;
      return await this._makeRequest({
        method: "put",
        path: `/forms/${encodeURIComponent(formId)}/webhooks/${encodeURIComponent(tag)}`,
        data: {
          url: endpoint,
          enabled: true,
          verify_ssl: true,
          secret,
        },
      });
    },
    async deleteHook(opts = {}) {
      const {
        formId,
        tag,
      } = opts;
      return await this._makeRequest({
        method: "delete",
        path: `/forms/${encodeURIComponent(formId)}/webhooks/${encodeURIComponent(tag)}`,
      });
    },
  },
};
