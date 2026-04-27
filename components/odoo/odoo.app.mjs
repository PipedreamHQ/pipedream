import xmlrpc from "xmlrpc";

export default {
  type: "app",
  app: "odoo",
  propDefinitions: {
    modelName: {
      type: "string",
      label: "Model Name",
      description: "The technical name of the Odoo model to interact with (e.g. `res.partner`, `helpdesk.ticket`, `sale.order`, `crm.lead`).",
      default: "res.partner",
      options: [
        "res.partner",
        "helpdesk.ticket",
        "sale.order",
        "crm.lead",
      ],
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
          optional: (key !== "name" || update) && fields[key].required === false,
        };
      });
      return props;
    },
    getFields(model, filter = [], args = {}) {
      return this.makeRequest(model, "fields_get", filter, args);
    },
    searchAndReadRecords(model, filter = [], args = {}) {
      return this.makeRequest(model, "search_read", filter, args);
    },
    createRecord(model, data) {
      return this.makeRequest(model, "create", data);
    },
    updateRecord(model, data) {
      return this.makeRequest(model, "write", data);
    },
  },
};
