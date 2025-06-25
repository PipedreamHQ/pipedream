import xmlrpc from "xmlrpc";

export default {
  type: "app",
  app: "odoo",
  propDefinitions: {
    fields: {
      type: "string[]",
      label: "Fields",
      description: "The fields to return in the results. If not provided, all fields will be returned.",
      optional: true,
      async options() {
        const fields = await this.getFields([], {
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
          resolve(value);
        });
      });
      return uid;
    },
    async makeRequest(method, filter = [], args = {}) {
      const db = this.$auth.db;
      const uid = await this.getUid();
      const password = this.$auth.password;
      const models = this.getClient("object");
      const results = await new Promise((resolve, reject) => {
        models.methodCall("execute_kw", [
          db,
          uid,
          password,
          "res.partner",
          method,
          filter,
          args,
        ], (error, value) => {
          if (error) reject(error);
          resolve(value);
        });
      });
      return results;
    },
    async getFieldProps({ update = false } = {}) {
      const props = {};
      const fields = await this.getFields();
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
    getFields(filter = [], args = {}) {
      return this.makeRequest("fields_get", filter, args);
    },
    searchAndReadRecords(filter = [], args = {}) {
      return this.makeRequest("search_read", filter, args);
    },
    readRecord(data) {
      return this.makeRequest("read", data);
    },
    createRecord(data) {
      return this.makeRequest("create", data);
    },
    updateRecord(data) {
      return this.makeRequest("write", data);
    },
  },
};
