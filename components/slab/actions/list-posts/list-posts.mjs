import slab from "../../slab.app.mjs";

export default {
  key: "slab-list-posts",
  name: "List Posts",
  description: "List posts in the organization. See [documentation](https://studio.apollographql.com/public/Slab/variant/current/home), [schema link](https://studio.apollographql.com/public/Slab/variant/current/explorer?searchQuery=RootQueryType.search)",
  version: "0.0.1",
  type: "action",
  props: {
    slab,
    first: {
      propDefinition: [
        slab,
        "first",
      ],
    },
    after: {
      propDefinition: [
        slab,
        "after",
      ],
    },
    last: {
      propDefinition: [
        slab,
        "last",
      ],
    },
    before: {
      propDefinition: [
        slab,
        "before",
      ],
    },
  },
  async run({ $ }) {
    const query = `
      query ListPosts($query: String!, $first: Int, $after: String, $last: Int, $before: String) {
        search(query: $query, types: [POST], first: $first, after: $after, last: $last, before: $before) {
          edges {
            node {
              ... on PostSearchResult {
                title
                highlight
                content
                post {
                  id
                  title
                  linkAccess
                  archivedAt
                  publishedAt
                  insertedAt
                  updatedAt
                  version
                  content
                  banner {
                    original
                    thumb
                    preset
                  }
                  owner {
                    id
                    name
                    email
                  }
                  topics {
                    id
                    name
                  }
                }
              }
            }
            cursor
          }
          pageInfo {
            hasNextPage
            hasPreviousPage
            startCursor
            endCursor
          }
        }
      }
    `;
    const variables = {
      query: "",
      ...(this.first && { first: parseInt(this.first) }),
      ...(this.after && { after: this.after }),
      ...(this.last && { last: parseInt(this.last) }),
      ...(this.before && { before: this.before }),
    };
    const response = await this.slab._makeRequest({
      $,
      data: {
        query,
        variables,
      },
    });
    const edges = response.search?.edges || [];
    const posts = edges
      .map((edge) => edge.node?.post)
      .filter(Boolean);
    const pageInfo = response.search?.pageInfo || {};
    $.export("$summary", `Successfully retrieved ${posts.length} post(s)`);
    return {
      posts,
      pageInfo,
      edges,
    };
  },
};

