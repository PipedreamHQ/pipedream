import slab from "../../slab.app.mjs";

export default {
  key: "slab-get-posts",
  name: "Get Posts",
  description: "Get posts by ID. See [documentation](https://studio.apollographql.com/public/Slab/variant/current/home), [schema link](https://studio.apollographql.com/public/Slab/variant/current/explorer?searchQuery=RootQueryType.posts)",
  version: "0.0.1",
  type: "action",
  props: {
    slab,
    postIds: {
      type: "string[]",
      label: "Post IDs",
      description: "Select one or more posts to retrieve",
      options: async function({ prevContext }) {
        return this.slab.listPostsForOptions({
          cursor: prevContext?.cursor,
        });
      },
    },
  },
  async run({ $ }) {
    const query = `
      query GetPosts($ids: [ID!]!) {
        posts(ids: $ids) {
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
    `;
    const variables = {
      ids: this.postIds,
    };
    const response = await this.slab._makeRequest({
      $,
      data: {
        query,
        variables,
      },
    });
    const posts = response.posts || [];
    $.export("$summary", `Successfully retrieved ${posts.length} post(s)`);
    return posts;
  },
};

