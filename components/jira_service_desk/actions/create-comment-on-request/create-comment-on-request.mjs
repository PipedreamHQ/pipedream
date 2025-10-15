import jiraServiceDesk from "../../jira_service_desk.app.mjs";

export default {
  key: "jira_service_desk-create-comment-on-request",
  name: "Create Comment on Request",
  description: "Create a comment on a customer request. [See the documentation](https://developer.atlassian.com/cloud/jira/service-desk/rest/api-group-request/#api-rest-servicedeskapi-request-issueidorkey-comment-post)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    jiraServiceDesk,
    cloudId: {
      propDefinition: [
        jiraServiceDesk,
        "cloudId",
      ],
    },
    requestId: {
      propDefinition: [
        jiraServiceDesk,
        "requestId",
        ({ cloudId }) => ({
          cloudId,
        }),
      ],
    },
    body: {
      type: "string",
      label: "Comment Body",
      description: "The content of the comment",
    },
    isPublic: {
      type: "boolean",
      label: "Public",
      description: "Whether the comment is public or not",
    },
  },
  async run({ $ }) {
    const {
      cloudId, requestId, body, isPublic,
    } = this;
    const response = await this.jiraServiceDesk.createRequestComment({
      $,
      cloudId,
      requestId,
      data: {
        body,
        public: isPublic,
      },
    });
    $.export("$summary", "Successfully created comment on request");
    return response;
  },
};
