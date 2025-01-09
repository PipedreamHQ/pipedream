import { axios } from "@pipedream/platform";
import constants from "./common/constants.mjs";

export default {
  type: "app",
  app: "remote_retrieval",
  propDefinitions: {
    orderId: {
      type: "string",
      label: "Order ID",
      description: "ID of the Order",
      async options() {
        const response = await this.getOrders();
        const orderIds = response.results;
        return orderIds?.map(({
          order_id, employee_info,
        }) => ({
          value: order_id,
          label: employee_info.name,
        })) || [];
      },
    },
    typeOfEquipment: {
      type: "string",
      label: "Type of Equipment",
      description: "The type of equipment",
      options: constants.EQUIPMENT_TYPES,
    },
    orderType: {
      type: "string",
      label: "Order Type",
      description: "The type of order",
      options: constants.ORDER_TYPES,
    },
    email: {
      type: "string",
      label: "Employee Email",
      description: "Employee email address",
    },
    name: {
      type: "string",
      label: "Employee Name",
      description: "Employee full name",
    },
    addressLine1: {
      type: "string",
      label: "Employee Address Line 1",
      description: "Employee Address in line 1",
    },
    addressLine2: {
      type: "string",
      label: "Employee Address Line 2",
      description: "Employee Address in line 2, it is not a mandatory field",
      optional: true,
    },
    addressCity: {
      type: "string",
      label: "Employee City",
      description: "Employee city",
    },
    addressState: {
      type: "string",
      label: "Employee State",
      description: "Employee state",
    },
    addressCountry: {
      type: "string",
      label: "Employee Country",
      description: "Employee country",
    },
    addressZip: {
      type: "string",
      label: "Employee Zip",
      description: "Employee zip",
    },
    phone: {
      type: "string",
      label: "Employee Phone",
      description: "Employee phone",
    },
    returnPersonName: {
      type: "string",
      label: "Return Person Name",
      description: "Company person name",
    },
    returnCompanyName: {
      type: "string",
      label: "Return Company Name",
      description: "Company name",
    },
    returnAddressLine1: {
      type: "string",
      label: "Return Address Line 1",
      description: "Company address in line 1",
    },
    returnAddressLine2: {
      type: "string",
      label: "Return Address Line 2",
      description: "Company address in line 2, it is not a mandatory field",
      optional: true,
    },
    returnAddressCity: {
      type: "string",
      label: "Return Address City",
      description: "Company city",
    },
    returnAddressState: {
      type: "string",
      label: "Return Address State",
      description: "Company state",
    },
    returnAddressCountry: {
      type: "string",
      label: "Return Address Country",
      description: "Company country",
    },
    returnAddressZip: {
      type: "string",
      label: "Return Address Zip",
      description: "Company zip",
    },
    companyEmail: {
      type: "string",
      label: "Company Email",
      description: "Company email",
    },
    companyPhone: {
      type: "string",
      label: "Company Phone",
      description: "Company phone",
    },
  },
  methods: {
    _baseUrl() {
      // return "https://remoteretrieval.com/RR-enterprise/remoteretrieval/public/index.php/api/v1";
      return "https://remoteretrieval.com/api/v1";
    },
    async _makeRequest(opts = {}) {
      const {
        $ = this,
        path,
        headers,
        ...otherOpts
      } = opts;
      return axios($, {
        ...otherOpts,
        url: this._baseUrl() + path,
        headers: {
          ...headers,
          Authorization: `Bearer ${this.$auth.api_key}`,
        },
      });
    },
    async createOrder(args = {}) {
      return this._makeRequest({
        path: "/create-order",
        method: "post",
        ...args,
      });
    },
    async getOrders(args = {}) {
      return this._makeRequest({
        path: "/orders",
        ...args,
      });
    },
    async getOrderDetails(args = {}) {
      return this._makeRequest({
        path: "/device_returns",
        ...args,
      });
    },
  },
};
