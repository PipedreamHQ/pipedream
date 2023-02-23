import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "planyo_online_booking",
  propDefinitions: {
    resourceId: {
      type: "string",
      label: "Resource ID",
      description: "If you specify resource ID, the vacation will be added only for this resource. If you leave this empty, vacation will be added for the whole site.",
      async options({ page }) {
        const { data } = await this.listResources({
          params: {
            page,
          },
        });
        return Object.values(data.resources).map((resource) => ({
          label: resource.name,
          value: resource.id,
        }));
      },
      optional: true,
    },
    userId: {
      type: "string",
      label: "User ID",
      description: "Optionally you can pass an existing user ID for the reservation. If you don't do this, planyo will identify the user ID by their email address.",
      optional: true,
      async options({ page }) {
        const { data } = await this.listUsers({
          params: {
            page,
          },
        });
        return Object.values(data.users).map((user) => ({
          label: `${user.first_name} ${user.last_name}`,
          value: user.id,
        }));
      },
    },
    startTime: {
      type: "string",
      label: "Start Time",
      description: "Datetime [in ISO 8601 format](https://en.wikipedia.org/wiki/ISO_8601). Start time of the event. For example `2023-02-22T23:31:23+00:00`",
    },
    endTime: {
      type: "string",
      label: "End time",
      description: "Datetime [in ISO 8601 format](https://en.wikipedia.org/wiki/ISO_8601). End time of the event. For example `2023-02-22T23:31:23+00:00`",
    },
    quantity: {
      type: "integer",
      label: "Quantity",
      description: "Enter the number of resources which should be made unavailable",
      optional: true,
    },
    email: {
      type: "string",
      label: "Email",
      description: "User's email address",
      optional: true,
    },
    firstName: {
      type: "string",
      label: "First Name",
      description: "User's first name",
      optional: true,
    },
    lastName: {
      type: "string",
      label: "Last Name",
      description: "User's last name",
      optional: true,
    },
    address: {
      type: "string",
      label: "Address",
      description: "User's address",
      optional: true,
    },
    city: {
      type: "string",
      label: "City",
      description: "User's city",
      optional: true,
    },
    zip: {
      type: "string",
      label: "Zip",
      description: "Zip or postal code",
      optional: true,
    },
    state: {
      type: "string",
      label: "State",
      description: "State or province",
      optional: true,
    },
    country: {
      type: "string",
      label: "Country",
      description: "Two-letter country code (ISO 3166-1 alpha-2)",
      optional: true,
    },
    phonePrefix: {
      type: "string",
      label: "Phone Prefix",
      description: "Phone country code (e.g. 1 for USA and Canada)",
      optional: true,
    },
    phoneNumber: {
      type: "string",
      label: "Phone Number",
      description: "Phone number (excluding country code)",
      optional: true,
    },
  },
  methods: {
    _baseUrl() {
      return "https://www.planyo.com/rest/";
    },
    _baseParams() {
      return {
        api_key: this.$auth.api_key,
      };
    },
    async _makeRequest({
      $ = this,
      params,
      ...args
    }) {
      const config = {
        url: `${this._baseUrl()}`,
        params: {
          ...this._baseParams(),
          ...params,
        },
        ...args,
      };
      return axios($, config);
    },
    listResources({
      params, ...args
    }) {
      return this._makeRequest({
        params: {
          method: "list_resources",
          ...params,
        },
        ...args,
      });
    },
    listUsers({
      params, ...args
    }) {
      return this._makeRequest({
        params: {
          method: "list_users",
          ...params,
        },
        ...args,
      });
    },
    createVacation({
      params, ...args
    }) {
      return this._makeRequest({
        method: "POST",
        params: {
          method: "add_vacation",
          ...params,
        },
        ...args,
      });
    },
    createReservation({
      params, ...args
    }) {
      return this._makeRequest({
        method: "POST",
        params: {
          method: "make_reservation",
          ...params,
        },
        ...args,
      });
    },
    createUser({
      params, ...args
    }) {
      return this._makeRequest({
        method: "POST",
        params: {
          method: "add_user",
          ...params,
        },
        ...args,
      });
    },
  },
};
