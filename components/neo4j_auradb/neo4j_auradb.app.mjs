import { axios } from "@pipedream/platform";
import { LIMIT } from "./common/constants.mjs";

export default {
  type: "app",
  app: "neo4j_auradb",
  propDefinitions: {},
  methods: {
    _baseUrl() {
      return `${this.$auth.api_url}`;
    },
    _auth() {
      return {
        username: `${this.$auth.username}`,
        password: `${this.$auth.password}`,
      };
    },
    _makeRequest({
      $ = this, path = "", ...opts
    }) {
      return axios($, {
        url: this._baseUrl() + path,
        auth: this._auth(),
        ...opts,
      });
    },
    createNode({
      label, properties, ...opts
    }) {
      const cypher = `CREATE (n:${label} $properties) RETURN n AS Node`;
      return this._makeRequest({
        method: "POST",
        data: {
          statement: cypher,
          parameters: {
            properties,
          },
        },
        ...opts,
      });
    },
    createRelationship({
      relationshipType,
      startNode,
      endNode,
      relationshipProperties = {},
      ...opts
    }) {
      const stringStartNode = JSON.stringify(startNode).replace(/"[^"]*":/g, (match) => match.replace(/"/g, ""));
      const stringEndNode = JSON.stringify(endNode).replace(/"[^"]*":/g, (match) => match.replace(/"/g, ""));
      const cypher = `
        MATCH (a ${stringStartNode})
        MATCH (b ${stringEndNode})
        CREATE (a)-[r:${relationshipType} $properties]->(b)
        RETURN r
      `;
      return this._makeRequest({
        method: "POST",
        data: {
          statement: cypher,
          parameters: {
            startNode,
            endNode,
            properties: relationshipProperties,
          },
        },
        ...opts,
      });
    },
    executeCypherQuery({
      cypherQuery, ...opts
    }) {
      return this._makeRequest({
        method: "POST",
        data: {
          statement: cypherQuery,
        },
        ...opts,
      });
    },
    async *paginate({
      query, maxResults = null,
    }) {
      let hasMore = false;
      let count = 0;
      let page = 0;
      let cypherQuery = "";

      do {
        cypherQuery = `${query} SKIP ${LIMIT * page} LIMIT ${LIMIT}`;
        page++;

        const { data: { values } } = await this.executeCypherQuery({
          cypherQuery,
        });
        for (const d of values) {
          yield d[0];

          if (maxResults && ++count === maxResults) {
            return count;
          }
        }

        hasMore = values.length;

      } while (hasMore);
    },
  },
};
