import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "quickbooks",
  propDefinitions: {},
  methods: {
    _companyId() {
      return this.$auth.company_id;
    },
    _accessToken() {
      return this.$auth.oauth_access_token;
    },
    _apiUrl() {
      return "https://quickbooks.api.intuit.com/v3";
    },
    async _makeRequest(path, options = {}, $ = undefined) {
      return axios($ ?? this, {
        url: `${this._apiUrl()}/${path}`,
        headers: {
          Authorization: `Bearer ${this._accessToken()}`,
        },
        ...options,
      });
    },
    async createPayment({
      $, data,
    }) {
      return this._makeRequest(`company/${this._companyId()}/payment`, {
        method: "post",
        data,
      }, $);
    },
    async createBill({
      $, data, params,
    }) {
      return this._makeRequest(`company/${this._companyId()}/bill`, {
        method: "post",
        data,
        params,
      }, $);
    },
    async createCustomer({
      $, data, params,
    }) {
      return this._makeRequest(`company/${this._companyId()}/customer`, {
        method: "post",
        data,
        params,
      }, $);
    },
    async createInvoice({
      $, data, params,
    }) {
      return this._makeRequest(`company/${this._companyId()}/invoice`, {
        method: "post",
        data,
        params,
      }, $);
    },
    async getBill({
      $, billId, params,
    }) {
      return this._makeRequest(`company/${this._companyId()}/bill/${billId}`, {
        params,
      }, $);
    },
    async getCustomer({
      $, customerId, params,
    }) {
      return this._makeRequest(`company/${this._companyId()}/customer/${customerId}`, {
        params,
      }, $);
    },
    async getInvoice({
      $, invoiceId, params,
    }) {
      return this._makeRequest(`company/${this._companyId()}/invoice/${invoiceId}`, {
        params,
      }, $);
    },
    async getMyCompany({ $ } = {}) {
      return this._makeRequest(`company/${this._companyId()}/companyinfo/${this._companyId()}`, {}, $);
    },
    async getPurchase({
      $, purchaseId, params,
    }) {
      return this._makeRequest(`company/${this._companyId()}/purchase/${purchaseId}`, {
        params,
      }, $);
    },
    async getPurchaseOrder({
      $, purchaseOrderId, params,
    }) {
      return this._makeRequest(`company/${this._companyId()}/purchaseorder/${purchaseOrderId}`, {
        params,
      }, $);
    },
    async getSalesReceipt({
      $, salesReceiptId, params,
    }) {
      return this._makeRequest(`company/${this._companyId()}/salesreceipt/${salesReceiptId}`, {
        params,
      }, $);
    },
    async getTimeActivity({
      $, timeActivityId, params,
    }) {
      return this._makeRequest(`company/${this._companyId()}/timeactivity/${timeActivityId}`, {
        params,
      }, $);
    },
    async query({
      $, params,
    }) {
      return this._makeRequest(`company/${this._companyId()}/query`, {
        params,
      }, $);
    },
    async updateCustomer({
      $, data, params,
    }) {
      return this._makeRequest(`company/${this._companyId()}/customer`, {
        method: "post",
        data,
        params,
      }, $);
    },
  },
};
