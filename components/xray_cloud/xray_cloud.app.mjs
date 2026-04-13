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
  },
  methods: {
    _baseUrl() {
      return "https://xray.cloud.getxray.app/api/v2";
    },
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
    async _makeGraphqlRequest({
      $ = this, query, variables = {},
    }) {
      const token = await this._authenticate($);
      return axios($, {
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
    },
    async getTests({
      $, jql, limit = 50,
    } = {}) {
      return this._makeGraphqlRequest({
        $,
        query: `
          query ($jql: String, $limit: Int!) {
            getTests(jql: $jql, limit: $limit) {
              total
              results {
                issueId
                testType { name }
                steps {
                  action
                  expectedResult
                }
                preconditions(limit: 10) {
                  results { issueId }
                }
              }
            }
          }
        `,
        variables: {
          jql,
          limit,
        },
      });
    },
    async getTestExecutions({
      $, jql, limit = 50,
    } = {}) {
      return this._makeGraphqlRequest({
        $,
        query: `
          query ($jql: String, $limit: Int!) {
            getTestExecutions(jql: $jql, limit: $limit) {
              total
              results {
                issueId
                testRuns(limit: 100) {
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
        },
      });
    },
  },
};
