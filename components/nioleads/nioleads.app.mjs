import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "nioleads",
  propDefinitions: {
    email: {
      type: "string",
      label: "Email",
      description: "The email address of the contact",
    },
    firstName: {
      type: "string",
      label: "First Name",
      description: "The first name of the contact",
      optional: true,
    },
    lastName: {
      type: "string",
      label: "Last Name",
      description: "The last name of the contact",
      optional: true,
    },
    fullName: {
      type: "string",
      label: "Full Name",
      description: "The full name of the person",
    },
    websiteDomain: {
      type: "string",
      label: "Website Domain",
      description: "The domain of the website",
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.nioleads.com/v1/openapi";
    },
    async _makeRequest(opts = {}) {
      const {
        $ = this,
        method = "GET",
        path,
        data,
        headers,
        ...otherOpts
      } = opts;
      return axios($, {
        ...otherOpts,
        method,
        url: this._baseUrl() + path,
        data,
        headers: {
          ...headers,
          "Authorization": `Bearer ${this.$auth.oauth_access_token}`,
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
      });
    },
    async verifyEmail(email) {
      return this._makeRequest({
        method: "POST",
        path: "/verify_email",
        data: {
          email,
        },
      });
    },
    async findEmail(fullName, websiteDomain) {
      return this._makeRequest({
        method: "POST",
        path: "/find_email",
        data: {
          name: fullName,
          domain: websiteDomain,
        },
      });
    },
    async emitNewContactData(email, firstName, lastName) {
      return this.$emit(
        {
          email,
          firstName,
          lastName,
        },
        {
          summary: `New contact data found for ${email}`,
        },
      );
    },
    async emitNewWatchedContact(email, firstName, lastName) {
      return this.$emit(
        {
          email,
          firstName,
          lastName,
        },
        {
          summary: `New contact is watched for ${email}`,
        },
      );
    },
  },
};
