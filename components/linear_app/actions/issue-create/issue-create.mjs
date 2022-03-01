// legacy_hash_id: a_l0iLnj
import { axios } from "@pipedream/platform";

export default {
  key: "linear_app-issue-create",
  name: "issueCreate",
  description: "Creates a new issue.",
  version: "0.1.1",
  type: "action",
  props: {
    linear_app: {
      type: "app",
      app: "linear_app",
    },
    input: {
      type: "object",
      description: "The issue object to create.",
    },
    defaultResolvedFields: {
      type: "string",
      optional: true,
    },
  },
  async run({ $ }) {
    const data = {
      query: `query(
    $input: IssueCreateInput!
  ) {
    issueCreate(
      input: $input
    ) {
      ${this.defaultResolvedFields || `
      lastSyncId
      issue {
        id
        createdAt
        updatedAt
        archivedAt
        number
        title
        description
        descriptionData
        priority
        estimate
        boardOrder
        startedAt
        completedAt
        canceledAt
        # team {}
        # cycle {}
        # state {}
        # assignee {}
        # parent {}
        # project {}
        # subscribers {}
        # creator {}
        # children {}
        # comments {}
        # history {}
        # labels {}
        # integrationResources {}
        url
      }
      success
      `}
    }
  }`,
      variables: {
        input: this.input,
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
