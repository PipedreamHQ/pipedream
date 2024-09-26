import "graphql/language/index.js";
import { GraphQLClient } from "graphql-request";

export default {
  type: "app",
  app: "product_hunt",
  propDefinitions: {
    topic: {
      type: "string",
      label: "Topic",
      description: "Filter posts by topic",
      async options() {
        const { topics } = await this.listTopics();
        return topics.edges?.map((topic) => ({
          value: topic.node.slug,
          label: topic.node.name,
        })) || [];
      },
      optional: true,
    },
    username: {
      type: "string",
      label: "Username",
      description: "The username (without the @ sign) of the user to watch for upvotes",
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.producthunt.com/v2/api/graphql";
    },
    _headers() {
      return {
        Authorization: `Bearer ${this.$auth.oauth_access_token}`,
      };
    },
    async _getGraphQLClient() {
      return new GraphQLClient(`${this._baseUrl()}`, {
        headers: this._headers(),
      });
    },
    async _makeQueriesRequest(data, variables) {
      const client = await this._getGraphQLClient();
      return client.request(data, variables);
    },
    async listTopics() {
      const query = `
        query posts {
          topics {
            edges {
              node {
                name
                slug
              }
            }
          }
        }
      `;
      return this._makeQueriesRequest(query);
    },
    async listPosts({
      topic, sortBy = "NEWEST", max = 20,
    }) {
      const filterString = topic
        ? `order: ${sortBy}, first: ${max}, topic: "${topic}`
        : `order: ${sortBy}, first: ${max}`;
      const query = `
        query posts {
          posts(${filterString}) {
            edges {
              node {
                id
                name
                tagline
                votesCount
                createdAt
              }
            }
          }
        }
      `;
      return this._makeQueriesRequest(query);
    },
    async listUpvotedPosts({
      username, max = 20,
    } ) {
      const query = `
        query viewer {
          user(username: "${username}") {
            votedPosts(first: ${max}) {
              edges {
                node {
                  id
                  name
                  tagline
                  votesCount
                  createdAt
                  votes {
                    edges {
                      node {
                        id
                        userId
                        createdAt
                      }
                    }
                  }
                }
              }
            }
          }
        }
      `;
      return this._makeQueriesRequest(query);
    },
    async listUserPosts({
      username, max = 20,
    } ) {
      const query = `
        query viewer {
          user(username: "${username}") {
            madePosts(first: ${max}) {
              edges {
                node {
                  id
                  name
                  tagline
                  votesCount
                  createdAt
                }
              }
            }
          }
        }
      `;
      return this._makeQueriesRequest(query);
    },
  },
};
