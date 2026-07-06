import app from "../../jira_service_desk.app.mjs";

export default {
  key: "jira_service_desk-transition-request",
  name: "Transition Request",
  description:
    "Transitions a Jira Service Desk request to a new workflow status."
    + " Use **List Request Transitions** first to get valid `transitionId` values for the request."
    + " Use **List Sites** to obtain the required `cloudId`."
    + " Use **List My Requests** or **Get Request** to find the `issueKey` (e.g. `IT-42`)."
    + " Optionally include a comment to explain the transition."
    + " [See the documentation](https://developer.atlassian.com/cloud/jira/service-desk/rest/api-group-request/#api-rest-servicedeskapi-request-issueidorkey-transition-post)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
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
    transitionId: {
      type: "string",
      label: "Transition ID",
      description: "The ID of the transition to perform. Use **List Request Transitions** to retrieve available transition IDs and names.",
    },
    additionalComment: {
      type: "string",
      label: "Additional Comment",
      description: "Optional comment to add when performing the transition.",
      optional: true,
    },
  },
  async run({ $ }) {
    const body = {
      id: this.transitionId,
    };

    if (this.additionalComment) {
      body.additionalComment = {
        body: this.additionalComment,
      };
    }

    const response = await this.app.transitionRequest({
      $,
      cloudId: this.cloudId,
      issueIdOrKey: this.issueIdOrKey,
      data: body,
    });

    $.export("$summary", `Transitioned request ${this.issueIdOrKey} using transition ID ${this.transitionId}`);
    return response;
  },
};
