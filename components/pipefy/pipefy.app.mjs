import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "pipefy",
  propDefinitions: {
    organization: {
      type: "string",
      label: "Organization",
      description: "Select your organization",
      async options() {
        const orgs = await this.listOrganizations();
        return orgs.map((org) => ({
          label: org.name,
          value: org.id,
        }));
      },
    },
    pipe: {
      type: "string",
      label: "Pipe",
      description: "Select a pipe",
      async options({ orgId }) {
        const pipes = await this.listPipes(orgId);
        return pipes.map((pipe) => ({
          label: pipe.name,
          value: pipe.id,
        }));
      },
    },
    phase: {
      type: "string",
      label: "Phase",
      description: "Select a phase",
      async options({ pipeId }) {
        const phases = await this.listPhases(pipeId);
        return phases.map((phase) => ({
          label: phase.name,
          value: phase.id,
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
    async _makeRequest(data, endpoint, $ = this) {
      const config = {
        method: "POST",
        url: `${this._getBaseUrl()}/${endpoint}`,
        headers: this._getHeaders(),
        data,
      }; console.log(config);
      return axios($, config);
    },
    async _makeQueriesRequest(data = null) {
      return this._makeRequest(data, "queries");
    },
    async _makeGraphQlRequest(data = null) {
      return this._makeRequest(data, "graphql");
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
      return this._makeGraphQlRequest(data);
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
    async listPipes(orgId) {
      const data = {
        query: `
          {
            organization(id:${orgId}) {
              pipes {
                id
                name
              }
            }
          }
        `,
      };
      return (await this._makeQueriesRequest(data)).data.organization.pipes;
    },
    async listPhases(pipeId) {
      const data = {
        query: `
          {
            pipe(id:${pipeId}) {
              phases {
                id
                name
              }
            }
          }
        `,
      };
      return (await this._makeQueriesRequest(data)).data.pipe.phases;
    },
    async listFields(phaseId) {
      const data = {
        query: `
          {
            phase(id:${phaseId}) {
              fields {
                id
                label
                required
                options
                description
              }
            }
          }
        `,
      };
      return (await this._makeQueriesRequest(data)).data.phase.fields;
    },
  },
};
