// legacy_hash_id: a_gnir13
import { axios } from "@pipedream/platform";

export default {
  key: "jira-get-transitions",
  name: "Get Transitions",
  description: "Gets either all transitions or a transition that can be performed by the user on an issue, based on the issue's status.",
  version: "0.1.1",
  type: "action",
  props: {
    jira: {
      type: "app",
      app: "jira",
    },
    issueIdOrKey: {
      type: "string",
      description: "The ID or key of the issue to get transitions of.",
    },
    expand: {
      type: "string",
      description: "Use [expand](https://developer.atlassian.com/cloud/jira/platform/rest/v3/intro/#expansion) to include additional information about transitions in the response. This parameter accepts `transitions.fields`, which returns information about the fields in the transition screen for each transition. Fields hidden from the screen are not returned. Use this information to populate the `fields` and `update` fields in [Transition issue](https://developer.atlassian.com/cloud/jira/platform/rest/v3/api-group-issues/#api-rest-api-3-issue-issueidorkey-transitions-post).",
      optional: true,
    },
    transitionId: {
      type: "string",
      description: "The ID of the transition.",
      optional: true,
    },
    skipRemoteOnlyCondition: {
      type: "boolean",
      description: "Whether transitions with the condition *Hide From User Condition* are included in the response.",
      optional: true,
    },
    includeUnavailableTransitions: {
      type: "boolean",
      description: "Whether details of transitions that fail a condition are included in the response.",
      optional: true,
    },
    sortByOpsBarAndStatus: {
      type: "boolean",
      description: "Whether the transitions are sorted by ops-bar sequence value first then category order (Todo, In Progress, Done) or only by ops-bar sequence value.",
      optional: true,
    },
  },
  async run({ $ }) {
  // First we must make a request to get our the cloud instance ID tied
  // to our connected account, which allows us to construct the correct REST API URL. See Section 3.2 of
  // https://developer.atlassian.com/cloud/jira/platform/oauth-2-authorization-code-grants-3lo-for-apps/
    const resp = await axios($, {
      url: "https://api.atlassian.com/oauth/token/accessible-resources",
      headers: {
        Authorization: `Bearer ${this.jira.$auth.oauth_access_token}`,
      },
    });

    // Assumes the access token has access to a single instance
    const cloudId = resp[0].id;

    // See https://developer.atlassian.com/cloud/jira/platform/rest/v3/api-group-issues/#api-rest-api-3-issue-issueidorkey-transitions-get
    // for all options
    return await axios($, {
      url: `https://api.atlassian.com/ex/jira/${cloudId}/rest/api/3/issue/${this.issueIdOrKey}/transitions`,
      headers: {
        "Authorization": `Bearer ${this.jira.$auth.oauth_access_token}`,
        "Accept": "application/json",
      },
      params: {
        expand: this.expand,
        transitionId: this.transitionId,
        skipRemoteOnlyCondition: this.skipRemoteOnlyCondition,
        includeUnavailableTransitions: this.includeUnavailableTransitions,
        sortByOpsBarAndStatus: this.sortByOpsBarAndStatus,
      },
    });
  },
};
