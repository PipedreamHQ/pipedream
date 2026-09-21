import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "xray_cloud",
  propDefinitions: {
    jql: {
      type: "string",
      label: "JQL Query",
      description:
        "JQL filter to narrow results (e.g., `project = 'PROJ'`). [See the Jira JQL documentation](https://support.atlassian.com/jira-service-management-cloud/docs/use-advanced-search-with-jira-query-language-jql/)",
      optional: true,
    },
    limit: {
      type: "integer",
      label: "Limit",
      description: "Max results to return (1-100)",
      default: 50,
      min: 1,
      max: 100,
      optional: true,
    },
    start: {
      type: "integer",
      label: "Start Offset",
      description: "Pagination offset — number of results to skip (e.g. `50` to fetch the second page when Limit is 50)",
      default: 0,
      min: 0,
      optional: true,
    },
  },
  methods: {
    /**
     * Returns the base URL for the Xray Cloud API v2.
     *
     * @returns {string} The base API URL
     */
    _baseUrl() {
      return "https://xray.cloud.getxray.app/api/v2";
    },
    /**
     * Authenticates with Xray Cloud using client credentials and returns a JWT
     * token. Tokens expire after 24 hours.
     *
     * @param {object} $ - The Pipedream context object for HTTP requests
     * @returns {string} A JWT bearer token
     */
    async _authenticate($) {
      return axios($ ?? this, {
        method: "POST",
        url: `${this._baseUrl()}/authenticate`,
        headers: {
          "Content-Type": "application/json",
        },
        data: {
          client_id: this.$auth.client_id,
          client_secret: this.$auth.client_secret,
        },
      });
    },
    /**
     * Sends an authenticated GraphQL request to the Xray Cloud API. Checks
     * the response for GraphQL-level errors and throws if present.
     *
     * @param {object} opts - Options object
     * @param {object} [opts.$=this] - The Pipedream context object
     * @param {string} opts.query - The GraphQL query string
     * @param {object} [opts.variables={}] - GraphQL query variables
     * @returns {object} The GraphQL response data
     */
    async _makeGraphqlRequest({
      $ = this, query, variables = {},
    }) {
      if (!this._cachedToken) {
        this._cachedToken = await this._authenticate($);
      }
      const token = this._cachedToken;
      const response = await axios($, {
        method: "POST",
        url: `${this._baseUrl()}/graphql`,
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        data: {
          query,
          variables,
        },
      });
      if (response?.errors?.length) {
        const messages = response.errors.map((e) => e.message).join("; ");
        throw new Error(`GraphQL error: ${messages}`);
      }
      return response;
    },
    /**
     * Retrieves Xray test cases matching an optional JQL filter. Supports
     * offset-based pagination via the `start` parameter.
     *
     * @param {object} [opts] - Options object
     * @param {object} [opts.$] - The Pipedream context object
     * @param {string} [opts.jql] - JQL filter string
     * @param {number} [opts.limit=50] - Max results per page (1-100)
     * @param {number} [opts.start=0] - Pagination offset
     * @returns {object} The GraphQL response containing tests
     */
    async getTests({
      $, jql, limit = 50, start = 0,
    } = {}) {
      return this._makeGraphqlRequest({
        $,
        query: `
          query ($jql: String, $limit: Int!, $start: Int) {
            getTests(jql: $jql, limit: $limit, start: $start) {
              total
              start
              limit
              results {
                issueId
                testType { name }
                steps {
                  action
                  expectedResult
                }
                preconditions(limit: 10) {
                  total
                  results { issueId }
                }
              }
            }
          }
        `,
        variables: {
          jql,
          limit,
          start,
        },
      });
    },
    /**
     * Executes an arbitrary GraphQL query against the Xray Cloud API.
     *
     * @param {object} [opts] - Options object
     * @param {object} [opts.$] - The Pipedream context object
     * @param {string} opts.query - The GraphQL query string
     * @param {object} [opts.variables={}] - GraphQL query variables
     * @returns {object} The GraphQL response data
     */
    async executeGraphqlQuery({
      $, query, variables = {},
    } = {}) {
      return this._makeGraphqlRequest({
        $,
        query,
        variables,
      });
    },
    /**
     * Retrieves Xray test executions matching an optional JQL filter. Supports
     * offset-based pagination via the `start` parameter.
     *
     * @param {object} [opts] - Options object
     * @param {object} [opts.$] - The Pipedream context object
     * @param {string} [opts.jql] - JQL filter string
     * @param {number} [opts.limit=50] - Max results per page (1-100)
     * @param {number} [opts.start=0] - Pagination offset
     * @returns {object} The GraphQL response containing test executions
     */
    async getTestExecutions({
      $, jql, limit = 50, start = 0,
    } = {}) {
      return this._makeGraphqlRequest({
        $,
        query: `
          query ($jql: String, $limit: Int!, $start: Int) {
            getTestExecutions(jql: $jql, limit: $limit, start: $start) {
              total
              start
              limit
              results {
                issueId
                testRuns(limit: 100) {
                  total
                  results {
                    status { name }
                    test { issueId }
                  }
                }
              }
            }
          }
        `,
        variables: {
          jql,
          limit,
          start,
        },
      });
    },
  },
};
