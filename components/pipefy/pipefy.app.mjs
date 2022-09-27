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
    table: {
      type: "string",
      label: "Table",
      description: "Select a table",
      async options({ orgId }) {
        const tables = await this.listTables(orgId);
        return tables.map((table) => ({
          label: table.node.name,
          value: table.node.internal_id,
        }));
      },
    },
    card: {
      type: "string",
      label: "Card",
      description: "Select a card",
      async options({
        pipeId, prevContext,
      }) {
        const { after } = prevContext;
        const cards = await this.listCards(pipeId, after);
        const options = cards.edges.map((card) => ({
          label: card.node.title,
          value: card.node.id,
        }));
        return {
          options,
          context: {
            after: cards.pageInfo.cursor,
          },
        };
      },
    },
    record: {
      type: "string",
      label: "Record",
      description: "Select a table record",
      async options({
        tableId, prevContext,
      }) {
        const { after } = prevContext;
        const records = await this.listTableRecords(tableId, after);
        const options = records.edges.map((record) => ({
          label: record.node.title,
          value: record.node.id,
        }));
        return {
          options,
          context: {
            after: records.pageInfo.cursor,
          },
        };
      },
    },
    status: {
      type: "string",
      label: "Status",
      description: "Select the record status",
      optional: true,
      async options({ tableId }) {
        const { table } = await this.getTable(tableId);
        const statuses = table.statuses;
        return statuses.map((status) => ({
          label: status.name,
          value: status.id,
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
            current_phase {
              id
              name
            }
          } 
        }
      `;
      return this._makeQueriesRequest(query);
    },
    async getPipe(id) {
      const query = `
        { 
          pipe(id: ${id}) { 
            id 
            name
            cards_count
            color
            created_at
            description
            emailAddress
            members {
              role_name
              user {
                id
                displayName
              }
            }
            users {
              id
              displayName
            }
            public
            uuid
          } 
        }
      `;
      return this._makeQueriesRequest(query);
    },
    async getPhase(id) {
      const query = `
        { 
          phase(id: ${id}) {
            id
            name 
            description 
            cards_count
            color
            created_at
            done
            expiredCardsCount
            lateCardsCount
            sequentialId
            fields{
              id
              label
              options
              required
            }
          } 
        }
      `;
      return this._makeQueriesRequest(query);
    },
    async getTable(id) {
      const query = `
        { 
          table(id: ${id}) {
            id
            name 
            description 
            color
            icon
            internal_id
            members {
              role_name
              user {
                id
                displayName
              }
            }
            table_fields {
              id
              label
              options
              required
            }
            statuses {
              id
              name
            }
            public
            table_records_count
            url
            users_count
            uuid
          } 
        }
      `;
      return this._makeQueriesRequest(query);
    },
    async getTableRecord(id) {
      const query = `
        { 
          table_record(id: ${id}) {
            id
            title
            due_date
            status {
              id
              name
            }
          } 
        }
      `;
      return this._makeQueriesRequest(query);
    },
    async getAuthenticatedUser(userFields) {
      const query = `
        {
          me { ${userFields} }
        }
      `;
      return this._makeQueriesRequest(query);
    },
    async listCards(pipeId, after = null) {
      const query = `
        { 
          cards(pipe_id: ${pipeId}, after: ${after}) { 
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
            pageInfo {
              endCursor
              hasNextPage
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
    async listPhaseFields(phaseId) {
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
    async listTableFields(tableId) {
      const query = `
        {
          table(id:${tableId}) {
            table_fields {
              id
              label
              required
              options
              description
            }
          }
        }
      `;
      return (await this._makeQueriesRequest(query)).table.table_fields;
    },
    async listTableRecords(tableId, after = null) {
      const query = `
        {
          table(id: ${tableId}) {
            table_records(after: ${after}) {
              edges {
                node {
                  id
                  title
                  record_fields {
                    name
                    value
                  }
                }
              }
              pageInfo {
                endCursor
                hasNextPage
              }
            }
          }
        }
      `;
      return (await this._makeQueriesRequest(query)).table.table_records;
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
    async listTables(organizationId) {
      const query = `
        {
          organization(id: ${organizationId}) {
            tables {
              edges {
                node {
                  internal_id
                  name
                }
              }
            }
          }
        }
      `;
      return (await this._makeQueriesRequest(query)).organization.tables.edges;
    },
    async createCard(variables) {
      const mutation = gql`
        mutation(
          $pipeId: ID!
          $phaseId: ID!
          $title: String!
          $dueDate: DateTime!
          $fieldsAttributes: [FieldValueInput]
        ){
          createCard( input: {
            pipe_id: $pipeId
            phase_id: $phaseId
            title: $title
            due_date: $dueDate
            fields_attributes: $fieldsAttributes
          })
          { card { id title } }
        }
      `;
      return this._makeGraphQlRequest(mutation, variables);
    },
    async updateCard(variables) {
      const mutation = gql`
        mutation(
          $id: ID!
          $title: String!
          $dueDate: DateTime!
          $assigneeIds: [ID]
        ){
          updateCard( input: {
            id: $id
            title: $title
            due_date: $dueDate
            assignee_ids: $assigneeIds
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
    async createTableRecord(variables) {
      const mutation = gql`
        mutation createNewTableRecord(
          $tableId: ID!
          $assigneeIds: [ID]
          $title: String!
          $fieldsAttributes: [FieldValueInput]
        ){
          createTableRecord( input: {
            table_id: $tableId
            assignee_ids: $assigneeIds
            title: $title
            fields_attributes: $fieldsAttributes
          })
          { table_record{ id title} }
        }
      `;
      return this._makeGraphQlRequest(mutation, variables);
    },
    async deleteCard(variables) {
      const mutation = gql`
        mutation deleteExistingCard(
          $id: ID!
        ){
          deleteCard( input: {
            id: $id
          })
          { success }
        }
      `;
      return this._makeGraphQlRequest(mutation, variables);
    },
    async updateCardField(variables) {
      const mutation = gql`
        mutation(
          $cardId: ID!
          $fieldId: ID!
          $newValue: [UndefinedInput]
        ){
          updateCardField( input: {
            card_id: $cardId
            field_id: $fieldId
            new_value: $newValue
          })
          { card { id title } }
        }
      `;
      return this._makeGraphQlRequest(mutation, variables);
    },
    async updateTable(variables) {
      const mutation = gql`
        mutation(
          $tableId: ID!
          $name: String!
          $icon: String!
          $color: Colors!
        ){
          updateTable( input: {
            id: $tableId
            name: $name
            icon: $icon
            color: $color
          })
          { table { id name } }
        }
      `;
      return this._makeGraphQlRequest(mutation, variables);
    },
    async updateTableRecord(variables) {
      const mutation = gql`
        mutation(
          $recordId: ID!
          $title: String!
          $statusId: ID!
        ){
          updateTableRecord( input: {
            id: $recordId
            title: $title
            statusId: $statusId
          })
          { table_record { id title } }
        }
      `;
      return this._makeGraphQlRequest(mutation, variables);
    },
  },
};
