import { axios } from "@pipedream/platform";
import constants from "./common/constants.mjs";

export default {
  type: "app",
  app: "quentn",
  propDefinitions: {
    email: {
      type: "string",
      label: "Email",
      description: "The email address of the contact to find.",
    },
    title: {
      type: "string",
      label: "Gender",
      description: "Possible values: `m` : Mr. and `f` : Mrs.",
      options: constants.TITLE_OPTIONS,
      optional: true,
    },
    firstName: {
      type: "string",
      label: "First Name",
      description: "First name",
      optional: true,
    },
    lastName: {
      type: "string",
      label: "Last Name",
      description: "Last name",
      optional: true,
    },
    company: {
      type: "string",
      label: "Company",
      description: "Company",
      optional: true,
    },
    jobTitle: {
      type: "string",
      label: "Job Title",
      description: "Job title",
      optional: true,
    },
    phoneType: {
      type: "string",
      label: "Phone Type",
      description: "Possible values: `work` : Work, `home` : Home, `mobile` : Mobile and `other` : other",
      optional: true,
      options: constants.PHONE_TYPE_OPTIONS,
    },
    phone: {
      type: "string",
      label: "Phone",
      description: "Phone number",
      optional: true,
    },
    skype: {
      type: "string",
      label: "Skype",
      description: "Skype",
      optional: true,
    },
    fb: {
      type: "string",
      label: "Facebook",
      description: "Facebook",
      optional: true,
    },
    twitter: {
      type: "string",
      label: "Twitter",
      description: "Twitter",
      optional: true,
    },
    street: {
      type: "string",
      label: "Street",
      description: "Street (Billing Address)",
      optional: true,
    },
    city: {
      type: "string",
      label: "City",
      description: "City (Billing Address)",
      optional: true,
    },
    postalCode: {
      type: "string",
      label: "Postal Code",
      description: "Postal Code (Billing Address)",
      optional: true,
    },
    state: {
      type: "string",
      label: "State",
      description: "State (Billing Address)",
      optional: true,
    },
    country: {
      type: "string",
      label: "Country",
      description: "Country as ISO 3166-1 alpha-2. Example: `DE` for Germany",
      optional: true,
    },
    dateOfBirth: {
      type: "string",
      label: "Date of Birth",
      description: "Date of birth as ISO 8601. Example: `2004-02-12T15:19:21+00:00`",
      optional: true,
    },
    termId: {
      type: "string",
      label: "Tag ID",
      description: "Tag ID",
      optional: true,
      async options({ prevContext }) {
        const { offset = 0 } = prevContext;
        const terms = await this.listTerms({
          params: {
            offset,
            limit: constants.DEFAULT_LIMIT,
          },
        });
        return {
          options: terms.map(({
            id: value, name: label,
          }) => ({
            label,
            value,
          })),
          context: {
            offset: offset + constants.DEFAULT_LIMIT,
          },
        };
      },
    },
  },
  methods: {
    getBaseUrl(versionPath) {
      const baseUrl = constants.BASE_URL
        .replace(constants.SYSTEM_ID_PLACEHOLDER, this.$auth.system_id)
        .replace(constants.SERVER_ID_PLACEHOLDER, this.$auth.server_id);
      return `${baseUrl}${versionPath || constants.VERSION_PATH}`;
    },
    getUrl(path, versionPath) {
      return `${this.getBaseUrl(versionPath)}${path}`;
    },
    getHeaders(headers) {
      return {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${this.$auth.api_key}`,
        ...headers,
      };
    },
    async makeRequest({
      step = this, path, headers, versionPath, ...args
    } = {}) {

      const config = {
        headers: this.getHeaders(headers),
        url: this.getUrl(path, versionPath),
        ...args,
      };

      return axios(step, config);
    },
    listContactsByEmail({
      email, ...args
    } = {}) {
      return this.makeRequest({
        path: `/contact/${email}`,
        ...args,
      });
    },
    createContact(args = {}) {
      return this.makeRequest({
        method: "post",
        path: "/contact",
        ...args,
      });
    },
    listTerms(args = {}) {
      return this.makeRequest({
        path: "/terms",
        ...args,
      });
    },
  },
};
