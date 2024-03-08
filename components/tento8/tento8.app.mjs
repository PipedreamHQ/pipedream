import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "tento8",
  propDefinitions: {
    service: {
      type: "string",
      label: "Service",
      description: "The service resource URI that the appointment will be booked for.",
      optional: true,
      async options() {
        const services = await this.getServices();
        return services.map(({
          resource_uri: value, name: label,
        }) => ({
          label,
          value,
        }));
      },
    },
    staff: {
      type: "string",
      label: "Staff",
      description: "The staff you wish to book. Default is the Organisation's first Staff member.",
      optional: true,
      async options({ prevContext }) {
        const { nextUrl } = prevContext;
        if (nextUrl === null) {
          return [];
        }
        const {
          next,
          results,
        } = await this.getStaff();
        const options = results.map(({
          resource_uri: value, name: label,
        }) => ({
          label,
          value,
        }));
        return {
          options,
          context: {
            nextUrl: next,
          },
        };
      },
    },
    location: {
      type: "string",
      label: "Location",
      description: "The location you wish to book at. Default is the Organisation's first Location.",
      optional: true,
      async options({ prevContext }) {
        const { nextUrl } = prevContext;
        if (nextUrl === null) {
          return [];
        }
        const {
          next,
          results,
        } = await this.getLocations();
        const options = results.map(({
          resource_uri: value, name: label,
        }) => ({
          label,
          value,
        }));
        return {
          options,
          context: {
            nextUrl: next,
          },
        };
      },
    },
  },
  methods: {
    _baseUrl() {
      return "https://10to8.com/api/booking/v2";
    },
    _makeRequest({
      $ = this, path, headers, ...args
    } = {}) {
      const config = {
        ...args,
        url: this._baseUrl() + path,
        headers: {
          ...headers,
          "Content-Type": "application/json",
          "Authorization": `token ${this.$auth.api_token}`,
        },
      };
      return axios($, config);
    },
    post(args = {}) {
      return this._makeRequest({
        method: "POST",
        ...args,
      });
    },
    getServices(args = {}) {
      return this._makeRequest({
        path: "/service/",
        ...args,
      });
    },
    getStaff(args = {}) {
      return this._makeRequest({
        path: "/staff/",
        ...args,
      });
    },
    getLocations(args = {}) {
      return this._makeRequest({
        path: "/location/",
        ...args,
      });
    },
  },
};
