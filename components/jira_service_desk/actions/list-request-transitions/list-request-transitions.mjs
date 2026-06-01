import app from "../../jira_service_desk.app.mjs";

export default {
  key: "jira_service_desk-list-request-transitions",
  name: "List Request Transitions",
  description:
    "Lists the available workflow transitions for a Jira Service Desk request — returns each transition's `id` and `name`."
    + " **Call this before `Transition Request`** to obtain valid `transitionId` values."
    + " Use **List Sites** first to obtain the required `cloudId`."
    + " Use **List My Requests** or **Get Request** to find the `issueKey` (e.g. `IT-42`)."
    + " [See the documentation](https://developer.atlassian.com/cloud/jira/service-desk/rest/api-group-request/#api-rest-servicedeskapi-request-issueidorkey-transition-get)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    app,
    cloudId: {
      type: "string",
      label: "Cloud ID",
      description: "The Atlassian cloud site ID. Use **List Sites** to retrieve available site IDs.",
    },
    issueIdOrKey: {
      propDefinition: [
        app,
        "issueIdOrKey",
      ],
    },
  },
  async run({ $ }) {
    const transitions = await this.app.getRequestTransitions({
      $,
      cloudId: this.cloudId,
      issueIdOrKey: this.issueIdOrKey,
    });
    $.export("$summary", `Found ${transitions?.length ?? 0} available transition(s) for ${this.issueIdOrKey}`);
    return transitions;
  },
};
