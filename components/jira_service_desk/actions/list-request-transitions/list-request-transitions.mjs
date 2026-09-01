import app from "../../jira_service_desk.app.mjs";

export default {
  key: "jira_service_desk-list-request-transitions",
  name: "List Request Transitions",
  description:
    "Lists the available workflow transitions for a Jira Service Desk request, returning each transition's `id` and `name`."
    + " Transitions are paginated automatically up to `maxResults`."
    + " Returns `{ transitions, truncated }`, where `truncated` is `true` when more transitions remained unfetched."
    + " Call this before **Transition Request** to obtain valid `transitionId` values."
    + " Use **List Sites** first to obtain the required `cloudId`."
    + " Use **List My Requests** or **Get Request** to find the `issueKey` (e.g. `IT-42`)."
    + " [See the documentation](https://developer.atlassian.com/cloud/jira/service-desk/rest/api-group-request/#api-rest-servicedeskapi-request-issueidorkey-transition-get)",
  version: "1.1.0",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    app,
    cloudId: {
      propDefinition: [
        app,
        "cloudId",
      ],
    },
    issueIdOrKey: {
      propDefinition: [
        app,
        "issueIdOrKey",
      ],
    },
    maxResults: {
      propDefinition: [
        app,
        "maxResults",
      ],
      label: "Max Transitions",
      description: "Maximum number of transitions to return across all pages (1-1000).",
    },
  },
  async run({ $ }) {
    const {
      results: transitions, hasMore,
    } = await this.app.getRequestTransitions({
      $,
      cloudId: this.cloudId,
      issueIdOrKey: this.issueIdOrKey,
      maxResults: this.maxResults,
    });
    $.export("$summary", `Found ${transitions.length}${hasMore
      ? "+"
      : ""} available transition(s) for ${this.issueIdOrKey}`);
    return {
      transitions,
      truncated: hasMore,
    };
  },
};
