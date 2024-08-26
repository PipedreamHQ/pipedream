import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "swapcard_exhibitor",
  propDefinitions: {
    eventId: {
      type: "string",
      label: "Event ID",
      description: "The ID of the event to monitor for new connections (leads).",
    },
  },
  methods: {
    _baseUrl() {
      return "https://developer.swapcard.com/event-admin/graphql";
    },
    async _makeRequest(opts = {}) {
      const {
        $ = this,
        method = "POST",
        path = "/",
        headers,
        ...otherOpts
      } = opts;
      return axios($, {
        ...otherOpts,
        method,
        url: this._baseUrl() + path,
        headers: {
          ...headers,
          "Content-Type": "application/json",
          "Authorization": `Bearer ${this.$auth.oauth_access_token}`,
        },
      });
    },
    async getEventPeople(eventId) {
      const query = `
        query ($eventId: ID!) {
          eventPerson(eventId: $eventId) {
            edges {
              node {
                id
                firstName
                lastName
                email
              }
            }
          }
        }
      `;
      const variables = {
        eventId,
      };
      const response = await this._makeRequest({
        data: {
          query,
          variables,
        },
      });
      return response.data.data.eventPerson.edges.map((edge) => edge.node);
    },
    async emitNewConnection(eventId) {
      const leads = await this.getEventPeople(eventId);
      leads.forEach((lead) => {
        this.$emit(lead, {
          summary: `New connection: ${lead.firstName} ${lead.lastName}`,
          id: lead.id,
        });
      });
    },
    authKeys() {
      console.log(Object.keys(this.$auth));
    },
  },
};
