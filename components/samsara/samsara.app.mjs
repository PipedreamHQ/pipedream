import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "samsara",
  propDefinitions: {
    contactIds: {
      type: "string[]",
      label: "Contact Ids",
      description: "An array of Contact IDs associated with this Address.",
      async options({ page }) {
        const { data } = await this.listContacts({
          params: {
            page,
          },
        });

        return data.map((contact) => ({
          label: `${contact.firstName} ${contact.lastName}` || contact.email || contact.phone,
          value: contact.id,
        }));
      },
    },
    driverId: {
      type: "string",
      label: "Driver Id",
      description: "ID of the driver.",
      async options({ page }) {
        const { data } = await this.listDrivers({
          params: {
            page,
          },
        });

        return data.map(({
          id: value, name: label,
        }) => ({
          label,
          value,
        }));
      },
    },
    tagIds: {
      type: "string[]",
      label: "Tag Ids",
      description: "An array of IDs of tags to associate with this address.",
      async options({ page }) {
        const { data } = await this.listTags({
          params: {
            page,
          },
        });

        return data.map(({
          id: value, name: label,
        }) => ({
          label,
          value,
        }));
      },
    },
    vehicleId: {
      type: "string",
      label: "Vehicle Id",
      description: "ID of the vehicle.",
      async options({ page }) {
        const { data } = await this.listVehicles({
          params: {
            page,
          },
        });

        return data.map(({
          id: value, name: label,
        }) => ({
          label,
          value,
        }));
      },
    },
    externalIds: {
      type: "object",
      label: "External Ids",
      description: "The external IDs for the given object.",
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.samsara.com";
    },
    _headers() {
      return {
        Authorization: `Bearer ${this.$auth.api_token}`,
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
    createContact(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/contacts",
        ...opts,
      });
    },
    listContacts(opts = {}) {
      return this._makeRequest({
        path: "/contacts",
        ...opts,
      });
    },
    listDrivers(opts = {}) {
      return this._makeRequest({
        path: "/fleet/drivers",
        ...opts,
      });
    },
    listTags(opts = {}) {
      return this._makeRequest({
        path: "/tags",
        ...opts,
      });
    },
    listVehicles(opts = {}) {
      return this._makeRequest({
        path: "/fleet/vehicles",
        ...opts,
      });
    },
    createAddress(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/addresses",
        ...opts,
      });
    },
    createRoute(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/fleet/routes",
        ...opts,
      });
    },
    createWebhook(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/webhooks",
        ...opts,
      });
    },
    deleteWebhook(webhookId) {
      return this._makeRequest({
        method: "DELETE",
        path: `/webhooks/${webhookId}`,
      });
    },
  },
};
