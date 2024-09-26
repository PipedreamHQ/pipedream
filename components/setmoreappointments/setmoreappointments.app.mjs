import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "setmoreappointments",
  propDefinitions: {
    staffKey: {
      type: "string",
      label: "Staff",
      description: "",
      async options({ prevContext }) {
        const { cursor } = prevContext;
        const params = cursor
          ? {
            cursor,
          }
          : {};
        const { data } = await this.listStaff({
          params,
        });
        const {
          cursor: newCursor, staffs,
        } = data;
        const options = staffs?.map(({
          key: value, first_name, last_name,
        }) => ({
          value,
          label: `${first_name} ${last_name}`,
        })) || [];
        return {
          options,
          context: {
            cursor: newCursor,
          },
        };
      },
    },
    serviceKey: {
      type: "string",
      label: "Service",
      description: "",
      async options() {
        const { data } = await this.listServices();
        return data.services?.map(({
          key: value, service_name: label,
        }) => ({
          value,
          label,
        })) || [];
      },
    },
  },
  methods: {
    _baseUrl() {
      return "https://developer.setmore.com/api/v1/bookingapi";
    },
    _headers() {
      return {
        "Authorization": `Bearer ${this.$auth.oauth_access_token}`,
        "Content-Type": "application/json",
      };
    },
    _makeRequest({
      $ = this,
      path,
      ...args
    }) {
      return axios($, {
        url: `${this._baseUrl()}${path}`,
        headers: this._headers(),
        ...args,
      });
    },
    getCustomer(args = {}) {
      return this._makeRequest({
        path: "/customer",
        ...args,
      });
    },
    listStaff(args = {}) {
      return this._makeRequest({
        path: "/staffs",
        ...args,
      });
    },
    listServices(args = {}) {
      return this._makeRequest({
        path: "/services",
        ...args,
      });
    },
    createCustomer(args = {}) {
      return this._makeRequest({
        path: "/customer/create",
        method: "POST",
        ...args,
      });
    },
    createAppointment(args = {}) {
      return this._makeRequest({
        path: "/appointment/create",
        method: "POST",
        ...args,
      });
    },
  },
};
