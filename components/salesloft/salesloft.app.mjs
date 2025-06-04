import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "salesloft",
  propDefinitions: {
    personId: {
      type: "string",
      label: "Person ID",
      description: "Select a person to add to the cadence or provide a person ID",
      async options({ page }) {
        const { data } = await this.listPeople({
          params: {
            per_page: 100,
            page: page + 1,
          },
        });
        return data?.map((person) => ({
          label: person.full_email_address ?? person.email_address ?? person.display_name,
          value: person.id,
        }));
      },
    },
    cadenceId: {
      type: "string",
      label: "Cadence ID",
      description: "Select a cadence or provide a cadence ID",
      async options({ page }) {
        const { data } = await this.listCadences({
          params: {
            per_page: 100,
            page: page + 1,
          },
        });
        return data?.map((cadence) => ({
          label: cadence.name,
          value: cadence.id,
        }));
      },
    },
    userId: {
      type: "string",
      label: "User ID",
      description: "Select a user who will own this cadence membership or provide a user ID. Defaults to the authenticated user if not provided.",
      optional: true,
      async options({ page }) {
        const { data } = await this.listUsers({
          params: {
            per_page: 100,
            page: page + 1,
          },
        });
        return data?.map((user) => ({
          label: user.name ?? user.email,
          value: user.id,
        }));
      },
    },
  },
  methods: {
    _apiUrl() {
      return "https://api.salesloft.com/v2";
    },
    async _makeRequest({
      $ = this,
      path,
      ...args
    }) {
      const response = await axios($, {
        url: `${this._apiUrl()}${path}`,
        headers: {
          Authorization: `Bearer ${this.$auth.api_key}`,
        },
        ...args,
      });
      return response.data;
    },
    async createPerson(args = {}) {
      return this._makeRequest({
        path: "/people",
        method: "POST",
        ...args,
      });
    },
    async addPersonToCadence(args = {}) {
      return this._makeRequest({
        path: "/cadence_memberships",
        method: "POST",
        ...args,
      });
    },
    async createNote(args = {}) {
      return this._makeRequest({
        path: "/notes",
        method: "POST",
        ...args,
      });
    },
    async createWebhookSubscription(args = {}) {
      return this._makeRequest({
        path: "/webhook_subscriptions",
        method: "POST",
        ...args,
      });
    },
    async deleteWebhookSubscription(subscriptionId) {
      return this._makeRequest({
        path: `/webhook_subscriptions/${subscriptionId}`,
        method: "DELETE",
      });
    },
    async listPeople(args = {}) {
      return this._makeRequest({
        path: "/people",
        ...args,
      });
    },
    async listCadences(args = {}) {
      return this._makeRequest({
        path: "/cadences",
        ...args,
      });
    },
    async listUsers(args = {}) {
      return this._makeRequest({
        path: "/users",
        ...args,
      });
    },
  },
};
