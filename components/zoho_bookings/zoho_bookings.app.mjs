import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "zoho_bookings",
  propDefinitions: {
    serviceId: {
      type: "string",
      label: "Service ID",
      description: "The ID of the service for the appointment",
      async options() {
        const { response } = await this.getServices({
          $: this,
        });
        return (response.returnvalue.data || []).map((item) => ({
          label: item.name,
          value: item.id,
        }));
      },
    },
    staffId: {
      type: "string",
      label: "Staff ID",
      description: "The ID of the staff member for the appointment. Either staff or resource is mandatory",
      optional: true,
      async options() {
        const { response } = await this.getStaffs({
          $: this,
        });
        return (response.returnvalue.data || []).map((item) => ({
          label: item.name,
          value: item.id,
        }));
      },
    },
    resourceId: {
      type: "string",
      label: "Resource ID",
      description: "The ID of the resource for the appointment. Either resource or staff is mandatory",
      optional: true,
      async options() {
        const { response } = await this.getResources({
          $: this,
        });
        return (response.returnvalue.data || []).map((item) => ({
          label: item.name,
          value: item.id,
        }));
      },
    },
  },
  methods: {
    _getBaseUrl() {
      return this.$auth.api_domain;
    },
    _getHeaders(headers) {
      return {
        Authorization: `Zoho-oauthtoken ${this.$auth.oauth_access_token}`,
        ...headers,
      };
    },
    async _makeRequest(args = {}) {
      const {
        method = "GET",
        path,
        $ = this,
        headers = {},
        ...otherArgs
      } = args;
      const config = {
        method,
        url: `${this._getBaseUrl()}${path}`,
        headers: this._getHeaders(headers),
        ...otherArgs,
      };
      return axios($, config);
    },
    getServices({ $ = this }) {
      return this._makeRequest({
        $,
        path: "/bookings/v1/json/services",
      });
    },
    getStaffs({ $ = this }) {
      return this._makeRequest({
        $,
        path: "/bookings/v1/json/staffs",
      });
    },
    getResources({ $ = this }) {
      return this._makeRequest({
        $,
        path: "/bookings/v1/json/resources",
      });
    },
    getAppointment({
      $ = this,
      params,
    }) {
      return this._makeRequest({
        $,
        method: "GET",
        path: "/bookings/v1/json/getappointment",
        params,
      });
    },
    fetchAvailability({
      $ = this,
      params,
    }) {
      return this._makeRequest({
        $,
        method: "GET",
        path: "/bookings/v1/json/availableslots",
        params,
      });
    },
    bookAppointment({
      $ = this,
      data,
      headers,
    }) {
      return this._makeRequest({
        $,
        method: "POST",
        path: "/bookings/v1/json/appointment",
        data,
        headers,
      });
    },
    rescheduleAppointment({
      $ = this,
      data,
      headers,
    }) {
      return this._makeRequest({
        $,
        method: "POST",
        path: "/bookings/v1/json/rescheduleappointment",
        data,
        headers,
      });
    },
  },
};
