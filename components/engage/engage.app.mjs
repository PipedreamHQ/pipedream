import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "engage",
  propDefinitions: {
    userId: {
      type: "string",
      label: "User ID",
      description: "Unique identifier for the user",
    },
    firstName: {
      type: "string",
      label: "First name",
      description: "The user's first name",
    },
    lastName: {
      type: "string",
      label: "Last name",
      description: "The user's last name",
    },
    isAccount: {
      type: "boolean",
      label: "Is account",
      description: "Indicates whether the user is also an account",
    },
    number: {
      type: "string",
      label: "Number",
      description: "A contact number associated with the user",
    },
    email: {
      type: "string",
      label: "Email",
      description: "The user's email address",
    },
    uid: {
      type: "string",
      label: "User ID",
      description: "ID of the user",
      async options() {
        const response = await this.getUsers();
        const usersIds = response.data;
        return usersIds.map(({
          uid, first_name, last_name,
        }) => ({
          label: `${first_name} ${last_name}`,
          value: uid,
        }));
      },
    },
    customerId: {
      type: "string",
      label: "Customer ID",
      description: "ID of the customer that will be added to the user",
      async options() {
        const response = await this.getUsers();
        const usersIds = response.data;
        return usersIds.map(({
          uid, first_name, last_name,
        }) => ({
          label: `${first_name} ${last_name}`,
          value: uid,
        }));
      },
    },
    event: {
      type: "string",
      label: "Event",
      description: "The name of the event associated with the user",
    },
    timestamp: {
      type: "string",
      label: "Timestamp",
      description: "Timestamp of the event. If none is provided, the current time is used",
      optional: true,
    },
    properties: {
      type: "object",
      label: "Properties",
      description: "The properties of the event",
      optional: true,
    },
    value: {
      type: "string",
      label: "Value",
      description: "The event value",
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.engage.so/v1";
    },
    async _makeRequest(opts = {}) {
      const {
        $ = this,
        path,
        auth,
        ...otherOpts
      } = opts;
      return axios($, {
        ...otherOpts,
        url: this._baseUrl() + path,
        auth: {
          ...auth,
          username: `${this.$auth.public_key}`,
          password: `${this.$auth.secret_key}`,
        },
      });
    },
    async createUser(args = {}) {
      return this._makeRequest({
        path: "/users",
        method: "post",
        ...args,
      });
    },
    async addCustomer({
      uid, ...args
    }) {
      return this._makeRequest({
        path: `/users/${uid}/accounts`,
        method: "post",
        ...args,
      });
    },
    async addEvent({
      uid, ...args
    }) {
      return this._makeRequest({
        path: `/users/${uid}/events`,
        method: "post",
        ...args,
      });
    },
    async getUsers(args = {}) {
      return this._makeRequest({
        path: "/users",
        ...args,
      });
    },
  },
};
