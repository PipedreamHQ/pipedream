import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "specific",
  propDefinitions: {
    customFields: {
      type: "string",
      label: "customFields",
      description: "customFields",
    },
    insertedAt: {
      type: "string",
      label: "Inserted At",
      description: "Date and time when the conversation was inserted in format YYYY-MM-DDTHH:mm:ss.sssZ",
      default: (new Date).toISOString(),
    },
    sourceId: {
      type: "string",
      label: "Source Id",
      description: "The Id of the source associated with the conversation",
      async options() {
        return await this.listAsyncOptions({
          model: "sources",
        });
      },
    },
    contactId: {
      type: "string",
      label: "Contact Id",
      description: "The id of the contact associated with the conversation",
      async options() {
        return await this.listAsyncOptions({
          model: "contacts",
        });
      },
    },
    contactEmail: {
      type: "string",
      label: "Contact Email",
      description: "The email of the contact",
      async options() {
        return await this.listAsyncOptions({
          model: "contacts",
          fields: `
          name
          email`,
        });
      },
    },
    companyId: {
      type: "string",
      label: "Company ID",
      description: "The ID of the company to retrieve details for",
      async options() {
        return await this.listAsyncOptions({
          model: "companies",
        });
      },
    },
  },
  methods: {
    _baseUrl() {
      return "https://public-api.specific.app/graphql";
    },
    _headers() {
      return {
        Authorization: `${this.$auth.api_key}`,
      };
    },
    _makeRequest({
      $ = this, ...opts
    }) {
      return axios($, {
        method: "POST",
        url: this._baseUrl(),
        headers: this._headers(),
        ...opts,
      });
    },
    query({
      model, where, fields,
    }) {
      return this._makeRequest({
        data: {
          query: `query {
            ${model} ${where
  ? `(where: ${where})`
  : ""} {
            ${fields}
            }
          }`,
        },
      });
    },
    mutation({
      model, data = null, fields, on, where, onValidationError = false,
    }) {
      return this._makeRequest({
        data: {
          query: `mutation {
            ${model} (
            ${data
    ? `data: ${data}`
    : ""} ${where
  ? `where: ${where}`
  : ""}) {
              ...on ${on || model} {
                ${fields} 
              }
              ...on DbError {
                message
              }
              ...on GraphQLError {
                message
              }
              ${onValidationError
    ? `
                ...on ValidationError {
                  message
                  fieldErrors {
                  message
                  path
                }
              }`
    : ""}
            }
          }`,
        },
      });
    },
    async listAsyncOptions ({
      model, fields = `
        id
        name`,
    }) {
      const { data } = await this.query({
        model,
        fields,
      });

      return data
        ? data[model]?.map(({
          id, email, name: label,
        }) => ({
          label,
          value: id || email,
        }))
        : [];
    },
    parseCustomFields(data) {
      let customFields = Object.keys(data)
        .filter((key) => key.startsWith("customField-"))
        .reduce((res, key) => {
          res[key.substring(12)] = data[key];
          return res;
        }, {});

      return  JSON.stringify(customFields)
        .replace(/"([^"]+)":/g, `
        $1:`)
        .replace(/,/g, `
        `);
    },
  },
};
