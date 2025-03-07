import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "neo4j_auradb",
  version: "0.0.{{ts}}",
  propDefinitions: {
    nodeLabel: {
      type: "string",
      label: "Node Label",
      description: "The label of the node to filter events for new node creation.",
    },
    relationshipType: {
      type: "string",
      label: "Relationship Type",
      description: "The type of the relationship to filter events for new relationship creation.",
    },
    monitorCypherQuery: {
      type: "string",
      label: "Monitor Cypher Query",
      description: "The Cypher query to monitor for new results.",
    },
    createNodeLabel: {
      type: "string",
      label: "Create Node Label",
      description: "The label of the node to create.",
    },
    createNodeProperties: {
      type: "string[]",
      label: "Create Node Properties",
      description: "An array of JSON strings representing the properties of the node to create.",
    },
    createRelationshipType: {
      type: "string",
      label: "Create Relationship Type",
      description: "The type of the relationship to create.",
    },
    createStartNode: {
      type: "string",
      label: "Start Node ID",
      description: "The ID of the start node for the relationship.",
    },
    createEndNode: {
      type: "string",
      label: "End Node ID",
      description: "The ID of the end node for the relationship.",
    },
    createRelationshipProperties: {
      type: "string[]",
      label: "Create Relationship Properties",
      description: "An array of JSON strings representing the properties of the relationship to create.",
    },
    executeCypherQuery: {
      type: "string",
      label: "Execute Cypher Query",
      description: "A valid Cypher query to execute against the Neo4j AuraDB instance.",
    },
  },
  methods: {
    authKeys() {
      console.log(Object.keys(this.$auth));
    },
    _baseUrl() {
      return `https://${this.$auth.host}/db/neo4j`;
    },
    async _makeRequest(opts = {}) {
      const {
        $ = this, method = "GET", path = "/tx/commit", headers, ...otherOpts
      } = opts;
      return axios($, {
        method,
        url: this._baseUrl() + path,
        headers: {
          ...headers,
          Authorization: `Bearer ${this.$auth.api_token}`,
        },
        ...otherOpts,
      });
    },
    async createNode({
      createNodeLabel, createNodeProperties,
    }) {
      const properties = createNodeProperties.map(JSON.parse);
      const cypher = `CREATE (n:${createNodeLabel} $properties) RETURN n`;
      const mergedProperties = Object.assign({}, ...properties);
      return this._makeRequest({
        method: "POST",
        data: {
          statements: [
            {
              statement: cypher,
              parameters: {
                properties: mergedProperties,
              },
            },
          ],
        },
      });
    },
    async createRelationship({
      createRelationshipType,
      createStartNode,
      createEndNode,
      createRelationshipProperties,
    }) {
      const properties = createRelationshipProperties.map(JSON.parse);
      const cypher = `
        MATCH (a), (b)
        WHERE id(a) = $startNode AND id(b) = $endNode
        CREATE (a)-[r:${createRelationshipType} $properties]->(b)
        RETURN r
      `;
      const mergedProperties = Object.assign({}, ...properties);
      return this._makeRequest({
        method: "POST",
        data: {
          statements: [
            {
              statement: cypher,
              parameters: {
                startNode: parseInt(createStartNode, 10),
                endNode: parseInt(createEndNode, 10),
                properties: mergedProperties,
              },
            },
          ],
        },
      });
    },
    async executeCypherQuery({ executeCypherQuery }) {
      return this._makeRequest({
        method: "POST",
        data: {
          statements: [
            {
              statement: executeCypherQuery,
            },
          ],
        },
      });
    },
    async emitNewNodeEvent({ nodeLabel }) {
      const cypher = `MATCH (n:${nodeLabel}) RETURN n`;
      return this._makeRequest({
        method: "POST",
        data: {
          statements: [
            {
              statement: cypher,
            },
          ],
        },
      });
    },
    async emitNewRelationshipEvent({ relationshipType }) {
      const cypher = `MATCH ()-[r:${relationshipType}]->() RETURN r`;
      return this._makeRequest({
        method: "POST",
        data: {
          statements: [
            {
              statement: cypher,
            },
          ],
        },
      });
    },
    async emitCypherQueryEvent({ monitorCypherQuery }) {
      return this.executeCypherQuery({
        executeCypherQuery: monitorCypherQuery,
      });
    },
    async paginate(fn, ...opts) {
      let results = [];
      let moreData = true;
      let currentPage = 0;
      while (moreData) {
        const response = await fn({
          page: currentPage,
          ...opts,
        });
        if (response.length === 0) {
          moreData = false;
        } else {
          results = results.concat(response);
          currentPage += 1;
        }
      }
      return results;
    },
  },
};
