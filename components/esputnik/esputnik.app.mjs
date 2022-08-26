import { axios } from "@pipedream/platform";
import constants from "./common/constants.mjs";

export default {
  type: "app",
  app: "esputnik",
  propDefinitions: {
    segment: {
      type: "string",
      label: "Segment",
      description: "Filter by segment",
      async options({ prevContext }) {
        const maxrows = constants.DEFAULT_PAGE_SIZE;
        const { startindex = 1 } = prevContext;
        const segments = await this.listSegments({
          params: {
            startindex,
            maxrows,
          },
        });
        if (!segments) {
          return [];
        }
        return {
          options: segments.map((segment) => ({
            label: segment.name,
            value: segment.id,
          })),
          context: {
            startindex: startindex + maxrows,
          },
        };
      },
    },
    contact: {
      type: "string",
      label: "Contact",
      description: "Select the contact to update",
      async options({ prevContext }) {
        const maxrows = constants.DEFAULT_PAGE_SIZE;
        const { startindex = 1 } = prevContext;
        const contacts = await this.listContacts({
          params: {
            startindex,
            maxrows,
          },
        });
        if (!contacts) {
          return [];
        }
        return {
          options: contacts.map((contact) => ({
            label: contact.firstName && contact.lastName
              ? `${contact.firstName} ${contact.lastName}`
              : `${contact.id}`,
            value: contact.id,
          })),
          context: {
            startindex: startindex + maxrows,
          },
        };
      },
    },
    maxRequests: {
      type: "integer",
      min: 1,
      max: 180,
      label: "Max API Requests per Execution",
      description: "The maximum number of API requests to make per execution (e.g., multiple requests are required to retrieve paginated results).",
      optional: true,
      default: constants.DEFAULT_MAX_REQUESTS,
    },
    firstName: {
      type: "string",
      label: "First Name",
      description: "First name of contact",
      optional: true,
    },
    lastName: {
      type: "string",
      label: "Last Name",
      description: "Last name of contact",
      optional: true,
    },
    email: {
      type: "string",
      label: "Email Address",
      description: "The email address of the contact",
    },
    address: {
      type: "string",
      label: "Contact Address",
      description: "The address of the contact",
      optional: true,
    },
    town: {
      type: "string",
      label: "City/Town",
      description: "The city/town of the contact",
      optional: true,
    },
    region: {
      type: "string",
      label: "Region/State",
      description: "The region/state address of the contact",
      optional: true,
    },
    postcode: {
      type: "string",
      label: "Postcode",
      description: "The postcode/zipcode of the contact",
      optional: true,
    },
  },
  methods: {
    _getBaseUrl() {
      return "https://esputnik.com/api/v1/";
    },
    _getAuth() {
      return {
        username: "",
        password: this.$auth.api_key,
      };
    },
    async _makeRequest(args = {}) {
      const {
        method = "GET",
        path,
        $ = this,
        ...otherArgs
      } = args;
      const config = {
        method,
        url: `${this._getBaseUrl()}${path}`,
        auth: this._getAuth(),
        ...otherArgs,
      };
      return axios($, config);
    },
    async getContact({
      contactId, ...args
    }) {
      return this._makeRequest({
        path: `contact/${contactId}`,
        ...args,
      });
    },
    async listSegments(args = {}) {
      return this._makeRequest({
        path: "groups",
        ...args,
      });
    },
    async listContacts(args = {}) {
      return this._makeRequest({
        path: "contacts",
        ...args,
      });
    },
    async listSegmentContacts({
      segmentId, ...args
    }) {
      return this._makeRequest({
        path: `group/${segmentId}/contacts`,
        ...args,
      });
    },
    async createContact(args = {}) {
      return this._makeRequest({
        method: "POST",
        path: "contact",
        ...args,
      });
    },
    async updateContact({
      contactId, ...args
    }) {
      return this._makeRequest({
        method: "PUT",
        path: `contact/${contactId}`,
        ...args,
      });
    },
    async subscribeContact(args = {}) {
      return this._makeRequest({
        method: "POST",
        path: "contact/subscribe",
        ...args,
      });
    },
  },
};
