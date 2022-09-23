import "graphql/language/index.js";
import {
  GraphQLClient, gql,
} from "graphql-request";

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
    members: {
      type: "string[]",
      label: "Members",
      description: "Select members",
      optional: true,
      async options({ orgId }) {
        const members = await this.listMembers(orgId);
        return members.map((member) => ({
          label: member.user.displayName,
          value: member.user.id,
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
    async _getGraphQLClient(endpoint) {
      return new GraphQLClient(`${this._getBaseUrl()}/${endpoint}`, {
        headers: this._getHeaders(),
      });
    },
    async _makeQueriesRequest(data, variables) {
      const client = await this._getGraphQLClient("queries");
      return client.request(data, variables);
    },
    async _makeGraphQlRequest(data, variables) {
      const client = await this._getGraphQLClient("graphql");
      return client.request(data, variables);
    },
    async createHook({
      pipe_id, name, url, actions,
    }) {
      const query = `
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
      `;
      return (await this._makeQueriesRequest(query)).createWebhook;
    },
    async deleteHook(hookId) {
      const query = `
        mutation { 
          deleteWebhook(input: { 
            id: ${hookId} 
          }) 
          { 
            success 
          } 
        }
      `;
      await this._makeQueriesRequest(query);
    },
    async getCard(id) {
      const query = `
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
      `;
      return this._makeGraphQlRequest(query);
    },
    async listCards(pipe_id) {
      const query = `
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
      `;
      return (await this._makeQueriesRequest(query)).cards;
    },
    async listOrganizations() {
      const query = `
        {
          organizations{
            id
            name
          }
        }
      `;
      return (await this._makeQueriesRequest(query)).organizations;
    },
    async listPipes(orgId) {
      const query = `
        {
          organization(id:${orgId}) {
            pipes {
              id
              name
            }
          }
        }
      `;
      return (await this._makeQueriesRequest(query)).organization.pipes;
    },
    async listPhases(pipeId) {
      const query = `
        {
          pipe(id:${pipeId}) {
            phases {
              id
              name
            }
          }
        }
      `;
      return (await this._makeQueriesRequest(query)).pipe.phases;
    },
    async listFields(phaseId) {
      const query = `
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
      `;
      return (await this._makeQueriesRequest(query)).phase.fields;
    },
    async listMembers(organizationId) {
      const query = `
        {
          organization(id: ${organizationId}) {
            members {
              user {
                id
                displayName
              }
            }
          }
        }
      `;
      return (await this._makeQueriesRequest(query)).organization.members;
    },
    async createCard(variables) {
      const mutation = gql`
        mutation(
          $pipeId: ID!
          $phaseId: ID!
          $title: String!
          $fieldsAttributes: [FieldValueInput]
        ){
          createCard( input: {
            pipe_id: $pipeId
            phase_id: $phaseId
            title: $title
            fields_attributes: $fieldsAttributes
          })
          { card { id title } }
        }
      `;
      return this._makeGraphQlRequest(mutation, variables);
    },
    async createPipe(variables) {
      const mutation = gql`
        mutation createNewPipe(
          $name: String!
          $organizationId: ID!
          $icon: String!
          $phases: [PhaseInput]
          $members: [MemberInput]
        ){
          createPipe( input: {
            name: $name
            organization_id: $organizationId
            icon: $icon
            phases: $phases
            members: $members
          })
          { pipe { id name} }
        }
      `;
      return this._makeGraphQlRequest(mutation, variables);
    },
  },
};
