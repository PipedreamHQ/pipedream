import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "samsara",
  propDefinitions: {
    routeName: {
      type: "string",
      label: "Route Name",
      description: "The name of the route.",
    },
    jobReference: {
      type: "string",
      label: "Job Reference",
      description: "A specific job reference on a route (optional).",
      optional: true,
    },
    firstName: {
      type: "string",
      label: "First Name",
      description: "First name of the contact.",
    },
    lastName: {
      type: "string",
      label: "Last Name",
      description: "Last name of the contact.",
    },
    email: {
      type: "string",
      label: "Email",
      description: "Email address of the contact.",
    },
    phoneNumber: {
      type: "string",
      label: "Phone Number",
      description: "Phone number of the contact.",
    },
    formattedAddress: {
      type: "string",
      label: "Formatted Address",
      description: "The full street address for this address/geofence, as it might be recognized by Google Maps.",
    },
    geofence: {
      type: "object",
      label: "Geofence",
      description: "The geofence that defines this address and its bounds. This can either be a circle or a polygon, but not both.",
    },
    destinationAddress: {
      type: "string",
      label: "Destination Address",
      description: "The destination address for the new route.",
    },
    contactNameOrEmail: {
      type: "string",
      label: "Contact Name or Email",
      description: "The name or email of the contact to search for.",
      optional: true,
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.samsara.com";
    },
    async _makeRequest(opts = {}) {
      const {
        $ = this, method = "GET", path, headers, ...otherOpts
      } = opts;
      return axios($, {
        ...otherOpts,
        method,
        url: this._baseUrl() + path,
        headers: {
          ...headers,
          Authorization: `Bearer ${this.$auth.oauth_access_token}`,
        },
      });
    },
    async createContact({
      firstName, lastName, email, phoneNumber,
    }) {
      return this._makeRequest({
        method: "POST",
        path: "/contacts",
        data: {
          firstName,
          lastName,
          email,
          phone: phoneNumber,
        },
      });
    },
    async searchOrCreateContact({ contactNameOrEmail }) {
      if (!contactNameOrEmail) {
        throw new Error("Contact name or email must be provided.");
      }
      // This is a simplified example. You would implement search logic here,
      // and if the contact does not exist, use the createContact method to create a new one.
      return {}; // Return the contact object
    },
    async createAddress({
      formattedAddress, geofence, name,
    }) {
      return this._makeRequest({
        method: "POST",
        path: "/addresses",
        data: {
          formattedAddress,
          geofence,
          name,
        },
      });
    },
    async createRoute({ destinationAddress }) {
      return this._makeRequest({
        method: "POST",
        path: "/fleet/routes",
        data: {
          destinationAddress,
        },
      });
    },
  },
};
