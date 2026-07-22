import { axios } from "@pipedream/platform";
import constants from "./common/constants.mjs";

const {
  SERVICE_CATALOG_BASE_PATH,
  KNOWLEDGE_BASE_PATH,
  SYS_USER_TABLE,
  SC_REQUEST_TABLE,
  KNOWLEDGE_BASE_TABLE,
  MAX_LIMIT,
} = constants;

export default {
  type: "app",
  app: "servicenow",
  propDefinitions: {
    table: {
      type: "string",
      label: "Table",
      description: "Search for a table or provide a table name (not label)",
      useQuery: true,
      async options({ query }) {
        if (!(query?.length > 1)) {
          console.log("Please input a search term");
          return [];
        }
        const data = await this.getTableRecords({
          table: "sys_db_object",
          params: {
            sysparm_query: `nameLIKE${query}^ORlabelLIKE${query}`,
            sysparm_fields: "name,label",
          },
        });
        return data.map(({
          label, name,
        }) => ({
          label,
          value: name,
        }));
      },
    },
    recordId: {
      type: "string",
      label: "Record ID",
      description: "The ID (`sys_id` field) of the record",
      async options({
        table, page,
      }) {
        if (!table) {
          return [];
        }
        const response = await this.getTableRecords({
          table,
          params: {
            sysparm_limit: 100,
            sysparm_offset: page * 100,
          },
        });
        return response.map(({
          sys_id: value, label,
        }) => ({
          label: label || value,
          value,
        }));
      },
    },
    responseDataFormat: {
      label: "Response Data Format",
      type: "string",
      description: "The format to return response fields in",
      optional: true,
      options: [
        {
          value: "true",
          label: "Returns the display values for all fields",
        },
        {
          value: "false",
          label: "Returns the actual values from the database",
        },
        {
          value: "all",
          label: "Returns both actual and display values",
        },
      ],
    },
    excludeReferenceLinks: {
      type: "boolean",
      label: "Exclude Reference Links",
      description: "If true, the response excludes Table API links for reference fields",
      optional: true,
    },
    responseFields: {
      type: "string[]",
      label: "Response Fields",
      description: "The fields to return in the response. By default, all fields are returned",
      optional: true,
    },
    inputDisplayValue: {
      label: "Input Display Value",
      type: "boolean",
      description: "If true, the input values are treated as display values (and are manipulated so they can be stored properly in the database)",
      optional: true,
    },
    responseView: {
      label: "Response View",
      type: "string",
      description: "Render the response according to the specified UI view (overridden by `Response Fields`)",
      optional: true,
      options: [
        "desktop",
        "mobile",
        "both",
      ],
    },
    queryNoDomain: {
      type: "boolean",
      label: "Query Across Domains",
      description: "If true, allows access to data across domains (if authorized)",
      optional: true,
    },
    limit: {
      type: "integer",
      label: "Limit",
      description: `Maximum number of results to return (1-${MAX_LIMIT}).`,
      min: 1,
      max: MAX_LIMIT,
      optional: true,
    },
    fields: {
      type: "string[]",
      label: "Fields",
      description: "Additional `kb_knowledge` fields to return under `fields`. Example: `short_description`, `sys_class_name`.",
      optional: true,
    },
    catalogItemSysId: {
      type: "string",
      label: "Catalog Item Sys ID",
      description: "The `sys_id` of the catalog item. Run **Search Catalog Items** first to find this value. Example: `e8d3d2f1c0a8016400e6b9e0f6e6f6e6`.",
    },
    quantity: {
      type: "integer",
      label: "Quantity",
      description: "Quantity to submit (maps to `sysparm_quantity`). Min 1. Example: `1`.",
      min: 1,
      default: 1,
      optional: true,
    },
    variables: {
      type: "object",
      label: "Variables",
      description: "JSON object of variable name-value pairs for the item. Run **Get Catalog Item Variables** to discover valid names. Example: `{\"justification\": \"new hire\"}`.",
      optional: true,
    },
    requestedFor: {
      type: "string",
      label: "Requested For",
      description: "Optional `sys_id` of the user this item is requested for (maps to `sysparm_requested_for`). Run **Find Users** to find it.",
      optional: true,
    },
  },
  methods: {
    async _makeRawRequest({
      $ = this,
      headers,
      ...args
    }) {
      return axios($, {
        baseURL: `https://${this.$auth.instance_name}.service-now.com/api/now`,
        headers: {
          ...headers,
          "Authorization": `Bearer ${this.$auth.oauth_access_token}`,
        },
        ...args,
      });
    },
    async _makeRequest({ ...args }) {
      const response = await this._makeRawRequest(args);
      return response.result;
    },
    async createTableRecord({
      table, ...args
    }) {
      return this._makeRequest({
        method: "post",
        url: `/table/${table}`,
        headers: {
          "Content-Type": "application/json",
        },
        ...args,
      });
    },
    async updateTableRecord({
      table, recordId, replace, ...args
    }) {
      return this._makeRequest({
        method: replace
          ? "put"
          : "patch",
        url: `/table/${table}/${recordId}`,
        headers: {
          "Content-Type": "application/json",
        },
        ...args,
      });
    },
    async deleteTableRecord({
      table, recordId, ...args
    }) {
      return this._makeRequest({
        method: "delete",
        url: `/table/${table}/${recordId}`,
        ...args,
      });
    },
    async getTableRecordById({
      table, recordId, ...args
    }) {
      return this._makeRequest({
        url: `/table/${table}/${recordId}`,
        ...args,
      });
    },
    async getTableRecords({
      table, ...args
    }) {
      return this._makeRequest({
        url: `/table/${table}`,
        ...args,
      });
    },
    async getRecordCountsByField({
      table, ...args
    }) {
      return this._makeRequest({
        url: `/stats/${table}`,
        ...args,
      });
    },
    _instanceBaseUrl() {
      return `https://${this.$auth.instance_name}.service-now.com`;
    },
    async searchCatalogItems({ ...args }) {
      return this._makeRequest({
        baseURL: `${this._instanceBaseUrl()}${SERVICE_CATALOG_BASE_PATH}`,
        url: "/items",
        ...args,
      });
    },
    async getCatalogItemVariables({
      catalogItemSysId, ...args
    }) {
      return this._makeRequest({
        baseURL: `${this._instanceBaseUrl()}${SERVICE_CATALOG_BASE_PATH}`,
        url: `/items/${catalogItemSysId}`,
        ...args,
      });
    },
    async addItemToCart({
      catalogItemSysId, ...args
    }) {
      return this._makeRequest({
        method: "post",
        baseURL: `${this._instanceBaseUrl()}${SERVICE_CATALOG_BASE_PATH}`,
        url: `/items/${catalogItemSysId}/add_to_cart`,
        headers: {
          "Content-Type": "application/json",
        },
        ...args,
      });
    },
    async checkoutCart({ ...args }) {
      return this._makeRequest({
        method: "post",
        baseURL: `${this._instanceBaseUrl()}${SERVICE_CATALOG_BASE_PATH}`,
        url: "/cart/checkout",
        headers: {
          "Content-Type": "application/json",
        },
        ...args,
      });
    },
    async submitOrder({ ...args }) {
      return this._makeRequest({
        method: "post",
        baseURL: `${this._instanceBaseUrl()}${SERVICE_CATALOG_BASE_PATH}`,
        url: "/cart/submit_order",
        headers: {
          "Content-Type": "application/json",
        },
        ...args,
      });
    },
    async getCart({ ...args }) {
      return this._makeRequest({
        baseURL: `${this._instanceBaseUrl()}${SERVICE_CATALOG_BASE_PATH}`,
        url: "/cart",
        ...args,
      });
    },
    async deleteCartItem({
      cartItemId, ...args
    }) {
      return this._makeRequest({
        method: "delete",
        baseURL: `${this._instanceBaseUrl()}${SERVICE_CATALOG_BASE_PATH}`,
        url: `/cart/${cartItemId}`,
        ...args,
      });
    },
    async emptyCart({
      cartSysId, ...args
    }) {
      return this._makeRequest({
        method: "delete",
        baseURL: `${this._instanceBaseUrl()}${SERVICE_CATALOG_BASE_PATH}`,
        url: `/cart/${cartSysId}/empty`,
        ...args,
      });
    },
    async orderNow({
      catalogItemSysId, ...args
    }) {
      return this._makeRequest({
        method: "post",
        baseURL: `${this._instanceBaseUrl()}${SERVICE_CATALOG_BASE_PATH}`,
        url: `/items/${catalogItemSysId}/order_now`,
        headers: {
          "Content-Type": "application/json",
        },
        ...args,
      });
    },
    async submitRecordProducer({
      catalogItemSysId, ...args
    }) {
      return this._makeRequest({
        method: "post",
        baseURL: `${this._instanceBaseUrl()}${SERVICE_CATALOG_BASE_PATH}`,
        url: `/items/${catalogItemSysId}/submit_producer`,
        headers: {
          "Content-Type": "application/json",
        },
        ...args,
      });
    },
    async searchKnowledgeArticles({ ...args }) {
      return this._makeRequest({
        baseURL: `${this._instanceBaseUrl()}${KNOWLEDGE_BASE_PATH}`,
        url: "/articles",
        ...args,
      });
    },
    async getKnowledgeArticle({
      articleId, ...args
    }) {
      return this._makeRequest({
        baseURL: `${this._instanceBaseUrl()}${KNOWLEDGE_BASE_PATH}`,
        url: `/articles/${articleId}`,
        ...args,
      });
    },
    // Returns the attachment file itself, not a `{ result }` envelope, so this
    // bypasses _makeRequest's `.result` extraction.
    async getKnowledgeArticleAttachment({
      articleSysId, attachmentSysId, ...args
    }) {
      return this._makeRawRequest({
        baseURL: `${this._instanceBaseUrl()}${KNOWLEDGE_BASE_PATH}`,
        url: `/articles/${articleSysId}/attachments/${attachmentSysId}`,
        responseType: "arraybuffer",
        headers: {
          Accept: "*/*",
        },
        ...args,
      });
    },
    async listKnowledgeBases({ ...args }) {
      return this.getTableRecords({
        table: KNOWLEDGE_BASE_TABLE,
        ...args,
      });
    },
    async listUsers({ ...args }) {
      return this.getTableRecords({
        table: SYS_USER_TABLE,
        ...args,
      });
    },
    async getRequests({ ...args }) {
      return this.getTableRecords({
        table: SC_REQUEST_TABLE,
        ...args,
      });
    },
  },
};
