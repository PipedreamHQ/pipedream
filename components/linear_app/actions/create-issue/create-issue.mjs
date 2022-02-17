// legacy_hash_id: a_YEiPqm
import { axios } from "@pipedream/platform";

export default {
  key: "linear_app-create-issue",
  name: "Create issue",
  description: "Create a new issue in Linear",
  version: "0.3.1",
  type: "action",
  props: {
    linear_app: {
      type: "app",
      app: "linear_app",
    },
    title: {
      type: "string",
    },
    description: {
      type: "string",
      optional: true,
    },
    teamId: {
      type: "string",
    },
  },
  async run({ $ }) {
    const data = {
      query: `
  mutation(
    $title: String!
    $description: String
    $teamId: String!
  ) {
    issueCreate(
      input: {
        title: $title
        description: $description
        teamId: $teamId
      }
    ) {
      success
      issue {
        id
        title
      }
    }
  }`,
      variables: {
        title: this.title,
        description: this.description,
        teamId: this.teamId,
      },
    };
    return await axios($, {
      method: "post",
      url: "https://api.linear.app/graphql",
      headers: {
        "Authorization": `${this.linear_app.$auth.api_key}`,
      },
      data,
    });
  },
};
