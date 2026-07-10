import xmlrpc from "xmlrpc";
const DEFAULT_LIMIT = 20;

export default {
  type: "app",
  app: "odoo",
  propDefinitions: {
    modelName: {
      type: "string",
      label: "Model Name",
      description: "The technical name of the Odoo model to interact with (e.g. `res.partner`, `helpdesk.ticket`, `sale.order`, `crm.lead`). Use the **List Models** action to get the model name.",
      default: "res.partner",
      async options({ page }) {
        const models = await this.listModels({
          limit: DEFAULT_LIMIT,
          offset: page * DEFAULT_LIMIT,
        });
        return models?.map(({ model }) => model) || [];
      },
    },
    fields: {
      type: "string[]",
      label: "Fields",
      description: "The fields to return in the results. If not provided, all fields will be returned.",
      optional: true,
      async options({ modelName }) {
        const fields = await this.getFields(modelName ?? "res.partner", [], {
          attributes: [
            "string",
          ],
        });
        return Object.keys(fields)?.map((key) => ({
          value: key,
          label: fields[key].string,
        })) || [];
      },
    },
    recordId: {
      type: "integer",
      label: "Record ID",
      description: "The ID of the record to interact with. Use the **Search and Read Records** action to get the record ID.",
      async options({
        modelName, page,
      }) {
        const records = await this.searchAndReadRecords(modelName, [], {
          fields: [
            "id",
            "display_name",
          ],
          limit: DEFAULT_LIMIT,
          offset: page * DEFAULT_LIMIT,
        });
        return records?.map(({
          id: value, display_name: label,
        }) => ({
          value,
          label,
        })) || [];
      },
    },
  },
  methods: {
    getClient(type = "common") {
      return xmlrpc.createSecureClient(`${this.$auth.server_url}/xmlrpc/2/${type}`);
    },
    async getUid() {
      const db = this.$auth.db;
      const username = this.$auth.username;
      const password = this.$auth.password;
      const common = this.getClient("common");
      const uid = await new Promise((resolve, reject) => {
        common.methodCall("authenticate", [
          db,
          username,
          password,
          {},
        ], (error, value) => {
          if (error) reject(error);
          else resolve(value);
        });
      });
      return uid;
    },
    async makeRequest(model, method, filter = [], args = {}) {
      const db = this.$auth.db;
      const uid = await this.getUid();
      const password = this.$auth.password;
      const models = this.getClient("object");
      const results = await new Promise((resolve, reject) => {
        models.methodCall("execute_kw", [
          db,
          uid,
          password,
          model,
          method,
          filter,
          args,
        ], (error, value) => {
          if (error) reject(error);
          else resolve(value);
        });
      });
      return results;
    },
    async getFieldProps(model, { update = false } = {}) {
      const props = {};
      const fields = await this.getFields(model, [], {});
      Object.keys(fields).forEach((key) => {
        if (fields[key].readonly === true) return;
        props[key] = {
          type: fields[key].type === "integer" || fields[key].type === "boolean"
            ? fields[key].type
            : fields[key].type.includes("id")
              ? "integer"
              : fields[key].type.includes("2many")
                ? "string[]"
                : "string",
          label: fields[key].string,
          description: `Value for "${key}"`,
          optional: update || fields[key].required === false,
        };
      });
      return props;
    },
    getFields(model, filter = [], args = {}) {
      return this.makeRequest(model, "fields_get", filter, args);
    },
    searchAndReadRecords(model, filter = [], args = {}) {
      return this.makeRequest(model, "search_read", [
        filter,
      ], args);
    },
    readRecords(model, ids, fields) {
      return this.makeRequest(model, "read", [
        ids,
      ], {
        fields,
      });
    },
    createRecord(model, data) {
      return this.makeRequest(model, "create", data);
    },
    updateRecord(model, data) {
      return this.makeRequest(model, "write", data);
    },
    deleteRecord(model, id) {
      return this.makeRequest(model, "unlink", [
        [
          id,
        ],
      ]);
    },
    listModels() {
      return this.makeRequest("ir.model", "search_read", [], {
        fields: [
          "name",
          "model",
        ],
      });
    },
  },
};
