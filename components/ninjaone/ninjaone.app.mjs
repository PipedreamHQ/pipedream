import { axios } from "@pipedream/platform";
import { LIMIT } from "./common/constants.mjs";

export default {
  type: "app",
  app: "ninjaone",
  propDefinitions: {
    clientId: {
      type: "string",
      label: "Client ID",
      description: "The ID of the client related to the ticket",
      async options({ prevContext }) {
        const data = await this.listOrganizations({
          params: {
            pageSize: LIMIT,
            after: prevContext.lastId,
          },
        });

        return {
          options: data.map(({
            id: value, name: label,
          }) => ({
            label,
            value,
          })),
          context: {
            lastId: data[data.length - 1]?.id,
          },
        };
      },
    },
    ticketFormId: {
      type: "string",
      label: "Ticket Form ID",
      description: "The ID of the ticket form to the ticket",
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
    locationId: {
      type: "string",
      label: "Location ID",
      description: "The ID of the location to the ticket",
      async options({
        prevContext, organizationId,
      }) {
        const data = await this.listLocations({
          organizationId,
          params: {
            pageSize: LIMIT,
            after: prevContext.lastId,
          },
        });

        return {
          options: data.map(({
            id: value, name: label,
          }) => ({
            label,
            value,
          })),
          context: {
            lastId: data[data.length - 1]?.id,
          },
        };
      },
    },
    deviceId: {
      type: "string",
      label: "Device ID",
      description: "The ID of the device to the ticket",
      async options({
        prevContext, organizationId,
      }) {
        const data = await this.listDevices({
          organizationId,
          params: {
            pageSize: LIMIT,
            after: prevContext.lastId,
          },
        });

        return {
          options: data.map(({
            id: value, systemName: label,
          }) => ({
            label,
            value,
          })),
          context: {
            lastId: data[data.length - 1]?.id,
          },
        };
      },
    },
    tags: {
      type: "string[]",
      label: "Tags",
      description: "A list of tags related to ticket.",
      async options({ prevContext }) {
        const { tags } = await this.listTags({
          params: {
            pageSize: LIMIT,
            after: prevContext.lastId,
          },
        });

        return tags.map(({ name }) => name);
      },
    },
    status: {
      type: "string",
      label: "Status",
      description: "The status of the ticket",
      async options() {
        const data = await this.listStatuses();

        return data.map(({
          statusId: value, displayName: label,
        }) => ({
          label,
          value,
        }));
      },
    },
    assignedAppUserId: {
      type: "string",
      label: "Assigned App User ID",
      description: "User ID that will be assigned to the ticket",
      async options() {
        const data = await this.listUsers({
          params: {
            userType: "TECHNICIAN",
          },
        });

        return data.map(({
          id: value, firstName, lastName, email,
        }) => ({
          label: `${firstName} ${lastName} - ${email}`,
          value,
        }));
      },
    },
    nodeRoleId: {
      type: "string",
      label: "Node Role Id",
      description: "The ID of the device role",
      async options() {
        const data = await this.listRoles();

        return data.map(({
          id: value, name: label,
        }) => ({
          label,
          value,
        }));
      },
    },
    policyId: {
      type: "string",
      label: "Policy ID",
      description: "The ID of the policy override",
      async options() {
        const data = await this.listPolicies();

        return data.map(({
          id: value, name: label,
        }) => ({
          label,
          value,
        }));
      },
    },
    organizationId: {
      type: "string",
      label: "Organization ID",
      description: "The ID of the organization",
      async options({ prevContext }) {
        const data = await this.listOrganizations({
          params: {
            pageSize: LIMIT,
            after: prevContext.lastId,
          },
        });

        return {
          options: data.map(({
            id: value, name: label,
          }) => ({
            label,
            value,
          })),
          context: {
            lastId: data[data.length - 1]?.id,
          },
        };
      },
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.ninjaone.com/v2";
    },
    _headers() {
      return {
        Authorization: `Bearer ${this.$auth.oauth_access_token}`,
      };
    },
    _makeRequest({
      $ = this, path, ...opts
    }) {
      return axios($, {
        url: this._baseUrl() + path,
        headers: this._headers(),
        ...opts,
      });
    },
    createSupportTicket(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/ticketing/ticket",
        ...opts,
      });
    },
    listOrganizations(opts = {}) {
      return this._makeRequest({
        path: "/organizations",
        ...opts,
      });
    },
    listTicketForms(opts = {}) {
      return this._makeRequest({
        path: "/ticketing/ticket-form",
        ...opts,
      });
    },
    listLocations({
      organizationId, ...opts
    }) {
      return this._makeRequest({
        path: `/organization/${organizationId}/locations`,
        ...opts,
      });
    },
    listDevices({
      organizationId, ...opts
    }) {
      return this._makeRequest({
        path: `/organization/${organizationId}/devices`,
        ...opts,
      });
    },
    listTags(opts = {}) {
      return this._makeRequest({
        path: "/tag",
        ...opts,
      });
    },
    listStatuses(opts = {}) {
      return this._makeRequest({
        path: "/ticketing/statuses",
        ...opts,
      });
    },
    listUsers(opts = {}) {
      return this._makeRequest({
        path: "/users",
        ...opts,
      });
    },
    listRoles(opts = {}) {
      return this._makeRequest({
        path: "/roles",
        ...opts,
      });
    },
    listPolicies(opts = {}) {
      return this._makeRequest({
        path: "/policies",
        ...opts,
      });
    },
    listActivities(opts = {}) {
      return this._makeRequest({
        path: "/activities",
        ...opts,
      });
    },
    updateDevice({
      deviceId, ...opts
    }) {
      return this._makeRequest({
        method: "PATCH",
        path: `/device/${deviceId}`,
        ...opts,
      });
    },
    async *paginate({
      fn, params = {}, maxResults = null, ...opts
    }) {
      let hasMore = false;
      let count = 0;
      let lastId = 0;
      const newerThan = params.newerThan;

      do {
        if (lastId) {
          params.olderThan = lastId;
          if (params.newerThan) delete params.newerThan;
        }

        const { activities } = await fn({
          params,
          ...opts,
        });
        for (const d of activities) {
          yield d;

          if (maxResults && ++count === maxResults) {
            return count;
          }
        }

        hasMore = activities.length && (lastId && (lastId > newerThan));

      } while (hasMore);
    },
  },
};
