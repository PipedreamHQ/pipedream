import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "jobber",
  propDefinitions: {
    clientId: {
      type: "string",
      label: "Client ID",
      description: "The ID of the client",
      async options() {
        const { data: { clients: { nodes } } } = await this.post({
          data: {
            query: `query GetClients {
              clients {
                nodes {
                  id
                  firstName
                  lastName
                  companyName
                }
              }
            }`,
          },
        });
        return nodes.map(({
          id: value, firstName, lastName, companyName,
        }) => ({
          value,
          label: companyName || `${firstName} ${lastName}`,
        }));
      },
    },
    propertyId: {
      type: "string",
      label: "Property ID",
      description: "The ID of a property",
      async options() {
        const { data: { properties: { nodes } } } = await this.post({
          data: {
            query: `query GetProperties {
              properties {
                nodes {
                  id
                  address {
                    street
                  }
                }
              }
            }`,
          },
        });
        return nodes.map(({
          id: value, address,
        }) => ({
          value,
          label: address.street,
        }));
      },
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.getjobber.com/api";
    },
    _makeRequest(opts = {}) {
      const {
        $ = this,
        path,
        ...otherOpts
      } = opts;
      return axios($, {
        ...otherOpts,
        url: `${this._baseUrl()}${path}`,
        headers: {
          "Authorization": `Bearer ${this.$auth.oauth_access_token}`,
          "X-JOBBER-GRAPHQL-VERSION": "2023-11-15",
        },
      });
    },
    post(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/graphql",
        ...opts,
      });
    },
  },
};
