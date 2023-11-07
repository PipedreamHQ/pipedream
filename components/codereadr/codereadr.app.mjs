import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "codereadr",
  propDefinitions: {
    status: {
      type: "string",
      label: "Status",
      description: "Filter scans by status",
      options: [
        {
          label: "Valid",
          value: "valid",
        },
        {
          label: "Invalid",
          value: "invalid",
        },
        {
          label: "All",
          value: "all",
        },
      ],
      optional: true,
    },
    databaseId: {
      type: "string",
      label: "Database ID",
      description: "Select the database to add or update a barcode value",
      async options() {
        const databases = await this.listDatabases();
        return databases.map((db) => ({
          label: db.name,
          value: db.id,
        }));
      },
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.codereadr.com/api/";
    },
    async _makeRequest(opts = {}) {
      const {
        $ = this,
        method = "GET",
        path,
        headers,
        ...otherOpts
      } = opts;
      return axios($, {
        ...otherOpts,
        method,
        url: this._baseUrl() + path,
        headers: {
          ...headers,
          Authorization: `Bearer ${this.$auth.api_key}`,
        },
      });
    },
    async listDatabases() {
      return this._makeRequest({
        path: "/databases",
      });
    },
    async createDatabase(data) {
      return this._makeRequest({
        method: "POST",
        path: "/databases",
        data,
      });
    },
    async addOrUpdateBarcode(databaseId, data) {
      return this._makeRequest({
        method: "POST",
        path: `/databases/${databaseId}/barcodes`,
        data,
      });
    },
    async generateQRCode(data) {
      return this._makeRequest({
        method: "POST",
        path: "/barcodegenerator",
        data,
      });
    },
    authKeys() {
      console.log(Object.keys(this.$auth));
    },
  },
};
