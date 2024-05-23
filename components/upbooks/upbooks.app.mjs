import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "upbooks",
  propDefinitions: {
    collectionName: {
      type: "string",
      label: "Collection Name",
      description: "The name of the collection to monitor for new data.",
    },
    timeInterval: {
      type: "integer",
      label: "Time Interval",
      description: "Time interval to look back for new data (in minutes).",
      optional: true,
    },
    amount: {
      type: "integer",
      label: "Amount",
      description: "The amount of the outward payment.",
    },
    recipient: {
      type: "string",
      label: "Recipient",
      description: "The recipient of the payment.",
    },
    date: {
      type: "string",
      label: "Date",
      description: "The date of the payment.",
    },
    referenceNumber: {
      type: "string",
      label: "Reference Number",
      description: "An optional reference number for the payment.",
      optional: true,
    },
    categoryName: {
      type: "string",
      label: "Category Name",
      description: "The name of the new expense category.",
    },
    description: {
      type: "string",
      label: "Description",
      description: "A description for the new expense category.",
      optional: true,
    },
    employeeDetails: {
      type: "string",
      label: "Employee Details",
      description: "Details of the new employee in JSON format including full name, job position, and contact details.",
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.upbooks.io/v1";
    },
    async _makeRequest(opts = {}) {
      const {
        $ = this,
        method = "GET",
        path,
        data,
        params,
        headers,
        ...otherOpts
      } = opts;
      return axios($, {
        method,
        url: this._baseUrl() + path,
        headers: {
          Authorization: `Bearer ${this.$auth.oauth_access_token}`,
          ...headers,
        },
        data,
        params,
        ...otherOpts,
      });
    },
    async emitNewDataEvent({
      collectionName, timeInterval,
    }) {
      return this._makeRequest({
        method: "POST",
        path: "/events/new-data",
        data: {
          collectionName,
          timeInterval,
        },
      });
    },
    async recordOutwardPayment({
      amount, recipient, date, referenceNumber,
    }) {
      return this._makeRequest({
        method: "POST",
        path: "/payments/outward",
        data: {
          amount,
          recipient,
          date,
          referenceNumber,
        },
      });
    },
    async createExpenseCategory({
      categoryName, description,
    }) {
      return this._makeRequest({
        method: "POST",
        path: "/expense-categories",
        data: {
          categoryName,
          description,
        },
      });
    },
    async addNewEmployee({ employeeDetails }) {
      const details = JSON.parse(employeeDetails);
      return this._makeRequest({
        method: "POST",
        path: "/employees",
        data: details,
      });
    },
  },
  version: "0.0.1",
};
