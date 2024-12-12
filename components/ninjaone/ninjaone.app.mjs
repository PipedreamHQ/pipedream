import { axios } from "@pipedream/platform";
import constants from "./common/constants.mjs";

export default {
  type: "app",
  app: "ninjaone",
  propDefinitions: {
    organizationId: {
      type: "string",
      label: "Organization ID",
      description: "The identifier of the organization.",
      async options({ prevContext: { after } }) {
        if (after === null) {
          return [];
        }
        const data = await this.listOrganizations({
          params: {
            pageSize: constants.DEFAULT_LIMIT,
            after: after || 0,
          },
        });
        const options = data.map(({
          id: value, name: label,
        }) => ({
          label,
          value,
        }));
        return {
          options,
          context: {
            after: data.length
              ? data[data.length - 1].id
              : null,
          },
        };
      },
    },
    ticketFormId: {
      type: "string",
      label: "Ticket Form ID",
      description: "The identifier of the ticket form",
      async options() {
        const data = await this.listTicketForms();
        return data.map(({
          id: value, name: label,
        }) => ({
          label,
          value,
        }));
      },
    },
    ticketStatus: {
      type: "string",
      label: "Ticket Status",
      description: "The status of the ticket.",
      async options() {
        const data = await this.listTicketStatuses();
        return data.map(({
          name: value, displayName: label,
        }) => ({
          label,
          value,
        }));
      },
    },
    assignedAppUserId: {
      type: "string",
      label: "Assigned Technician",
      description: "The technician assigned to the ticket",
      optional: true,
      async options({ params }) {
        const data = await this.listAppUserContacts({
          params,
        });
        return data.map(({
          id: value, firstName, lastName, email,
        }) => ({
          label: `${firstName} ${lastName} (${email})`,
          value,
        }));
      },
    },
    deviceId: {
      type: "string",
      label: "Device ID",
      description: "The identifier of the device.",
      async options({ prevContext: { after } }) {
        if (after === null) {
          return [];
        }
        const data = await this.listDevices({
          params: {
            pageSize: constants.DEFAULT_LIMIT,
            after: after || 0,
          },
        });
        const options = data.map(({
          id: value, displayName: label,
        }) => ({
          label,
          value,
        }));
        return {
          options,
          context: {
            after: data.length
              ? data[data.length - 1].id
              : null,
          },
        };
      },
    },
  },
  methods: {
    getUrl(path) {
      return `${constants.BASE_URL}${constants.VERSION_PATH}${path}`;
    },
    getHeaders(headers) {
      return {
        ...headers,
        Authorization: `Bearer ${this.$auth.oauth_access_token}`,
      };
    },
    _makeRequest({
      $ = this, path, headers, ...args
    } = {}) {
      return axios($, {
        ...args,
        debug: true,
        url: this.getUrl(path),
        headers: this.getHeaders(headers),
      });
    },
    post(args = {}) {
      return this._makeRequest({
        method: "POST",
        ...args,
      });
    },
    patch(args = {}) {
      return this._makeRequest({
        method: "PATCH",
        ...args,
      });
    },
    delete(args = {}) {
      return this._makeRequest({
        method: "DELETE",
        ...args,
      });
    },
    listOrganizations(args = {}) {
      return this._makeRequest({
        path: "/organizations",
        ...args,
      });
    },
    listTicketForms(args = {}) {
      return this._makeRequest({
        path: "/ticketing/ticket-form",
        ...args,
      });
    },
    listTicketStatuses(args = {}) {
      return this._makeRequest({
        path: "/ticketing/statuses",
        ...args,
      });
    },
    listGroups(args = {}) {
      return this._makeRequest({
        path: "/groups",
        ...args,
      });
    },
    listDeviceTypes(args = {}) {
      return this._makeRequest({
        path: "/device/types",
        ...args,
      });
    },
    listAppUserContacts(args = {}) {
      return this._makeRequest({
        path: "/ticketing/app-user-contact",
        ...args,
      });
    },
    listDevices(args = {}) {
      return this._makeRequest({
        path: "/devices",
        ...args,
      });
    },
  },
};
