import base from "../common/base.mjs";

const { jira } = base.props;

export default {
  ...base,
  key: "jira-get-transitions",
  name: "Get Transitions",
  description: "Gets either all transitions or a transition that can be performed by the user on an issue, based on the issue's status. [See docs here](https://developer.atlassian.com/cloud/jira/platform/rest/v3/api-group-issues/#api-rest-api-3-issue-issueidorkey-transitions-get)",
  version: "0.2.0",
  type: "action",
  props: {
    ...base.props,
    issueId: {
      propDefinition: [
        jira,
        "issueId",
        (c) => ({
          cloudId: c.cloudId,
        }),
      ],
    },
    transitionId: {
      propDefinition: [
        jira,
        "transitionId",
        (c) => ({
          cloudId: c.cloudId,
          issueId: c.issueId,
        }),
      ],
      optional: true,
    },
    expand: {
      propDefinition: [
        jira,
        "expand",
      ],
    },
    skipRemoteOnlyCondition: {
      label: "Skip Remote Only Condition",
      description: "Whether transitions with the condition *Hide From User Condition* are included in the response.",
      type: "boolean",
      optional: true,
    },
    includeUnavailableTransitions: {
      label: "Include Unavailable Transitions",
      description: "Whether details of transitions that fail a condition are included in the response.",
      type: "boolean",
      optional: true,
    },
    sortByOpsBarAndStatus: {
      label: "Sort By Ops Bar And Status",
      description: "Whether the transitions are sorted by ops-bar sequence value first then category order (Todo, In Progress, Done) or only by ops-bar sequence value.",
      type: "boolean",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.jira.getTransitions({
      $,
      cloudId: this.cloudId,
      issueId: this.issueId,
      params: {
        expand: this.expand,
        transitionId: this.transitionId,
        skipRemoteOnlyCondition: this.skipRemoteOnlyCondition,
        includeUnavailableTransitions: this.includeUnavailableTransitions,
        sortByOpsBarAndStatus: this.sortByOpsBarAndStatus,
      },
    });

    $.export("$summary", "Successfully retrieved projects");

    return response;
  },
};
