const axios = require("axios");

module.exports = {
  type: "app",
  app: "pipefy",
  propDefinitions: {
    organizations: {
      type: "string",
      label: "Organization",
      description: "Select yor organization",
      async options() {
        const orgs = await this.listOrganizations();
        return orgs.map((org) => ({
          label: org.name,
          value: org.id,
        }));
      },
    },
  },
  methods: {
    _getBaseUrl() {
      return "https://app.pipefy.com";
    },
    _getHeaders() {
      return {
        "Accept": "application/json",
        "Authorization": `Bearer ${this.$auth.token}`,
        "User-Agent": "@PipedreamHQ/pipedream v0.1",
      };
    },
    async _makeRequest(data, endpoint) {
      const config = {
        method: "POST",
        url: `${this._getBaseUrl()}/${endpoint}`,
        headers: this._getHeaders(),
        data,
      };
      return (await axios(config)).data;
    },
    async _makeQueriesRequest(data = null) {
      return await this._makeRequest(data, "queries");
    },
    async _makeGraphQlRequest(data = null) {
      return await this._makeRequest(data, "graphql");
    },
    async createHook({
      pipe_id, name, url, actions,
    }) {
      const data = {
        query: `
          mutation { 
            createWebhook(input: { 
              pipe_id: ${pipe_id} 
              name: "${name}" 
              url: "${url}" 
              actions: ["${actions}"] 
              headers: "{\\"token\\": \\"${this.$auth.token}\\"}" 
            }) 
            { 
              webhook { 
                id 
                name 
              } 
            } 
          }
        `,
      };
      return (await this._makeQueriesRequest(data)).data.createWebhook;
    },
    async deleteHook(hookId) {
      const data = {
        query: `
          mutation { 
            deleteWebhook(input: { 
              id: ${hookId} 
            }) 
            { 
              success 
            } 
          }
        `,
      };
      await this._makeQueriesRequest(data);
    },
    async getCard(id) {
      const data = {
        query: `
          { 
            card(id: ${id}) { 
              id 
              title 
              url 
              comments{text} 
              createdAt 
              createdBy{name} 
              due_date 
            } 
          }
        `,
      };
      return await this._makeGraphQlRequest(data);
    },
    async listCards(pipe_id) {
      const data = {
        query: `
          { 
            cards(pipe_id: ${pipe_id}, first: 100) { 
              edges { 
                node { 
                  id 
                  title 
                  assignees { 
                    id 
                  } 
                  comments { 
                    text 
                  } 
                  comments_count 
                  current_phase { 
                    name 
                    id 
                  } 
                  done 
                  late 
                  expired 
                  due_date 
                  fields { 
                    name 
                    value 
                  } 
                  labels { 
                    name 
                  } 
                  phases_history { 
                    phase { 
                      name 
                    } 
                    firstTimeIn 
                    lastTimeOut 
                  } 
                  url 
                } 
              } 
            } 
          }
        `,
      };
      return (await this._makeQueriesRequest(data)).data.cards;
    },
    async listOrganizations() {
      const data = {
        query: `
          {
            organizations{
              id
              name
            }
          }
        `,
      };
      return (await this._makeQueriesRequest(data)).data.organizations;
    },
  },
};
