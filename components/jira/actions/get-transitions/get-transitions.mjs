import jira from "../../jira.app.mjs";

export default {
  key: "jira-get-transitions",
  name: "Get Transitions",
  description: "Gets either all transitions or a transition that can be performed by the user on an issue, based on the issue's status, [See the docs](https://developer.atlassian.com/cloud/jira/platform/rest/v3/api-group-issues/#api-rest-api-3-issue-issueidorkey-transitions-get)",
  version: "0.1.6",
  type: "action",
  props: {
    jira,
    cloudId: {
      propDefinition: [
        jira,
        "cloudId",
      ],
    },
    issueIdOrKey: {
      propDefinition: [
        jira,
        "issueIdOrKey",
        (c) => ({
          cloudId: c.cloudId,
        }),
      ],
    },
    transitionId: {
      type: "string",
      label: "Transition ID",
      description: "The ID of the transition.",
      optional: true,
    },
    skipRemoteOnlyCondition: {
      type: "boolean",
      label: "Skip remote only condition",
      description: "Whether transitions with the condition *Hide From User Condition* are included in the response.",
      optional: true,
    },
    includeUnavailableTransitions: {
      type: "boolean",
      label: "Include unavailable transitions",
      description: "Whether details of transitions that fail a condition are included in the response.",
      optional: true,
    },
    sortByOpsBarAndStatus: {
      type: "boolean",
      label: "Sort by ops bar and status",
      description: "Whether the transitions are sorted by ops-bar sequence value first then category order (Todo, In Progress, Done) or only by ops-bar sequence value.",
      optional: true,
    },
    expand: {
      propDefinition: [
        jira,
        "expand",
      ],
      description: "Use expand to include additional information about transitions in the response. This parameter accepts `transitions.fields`, which returns information about the fields in the transition screen for each transition. Fields hidden from the screen are not returned. Use this information to populate the fields and update fields in [Transition issue](https://developer.atlassian.com/cloud/jira/platform/rest/v3/api-group-issues/#api-rest-api-3-issue-issueidorkey-transitions-post).",
    },
  },
  async run({ $ }) {
    const response = await this.jira.getTransitions({
      $,
      cloudId: this.cloudId,
      issueIdOrKey: this.issueIdOrKey,
      params: {
        transitionId: this.transitionId,
        skipRemoteOnlyCondition: this.skipRemoteOnlyCondition,
        includeUnavailableTransitions: this.includeUnavailableTransitions,
        sortByOpsBarAndStatus: this.sortByOpsBarAndStatus,
        expand: this.expand,
      },
    });
    $.export("$summary", `Successfully retrieved transitions for the issue with ID(or key): ${this.issueIdOrKey}`);
    return response;
  },
};
