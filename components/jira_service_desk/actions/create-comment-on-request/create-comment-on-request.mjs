import jiraServiceDesk from "../../jira_service_desk.app.mjs";

export default {
  key: "jira_service_desk-create-comment-on-request",
  name: "Create Comment on Request",
  description: "Create a comment on a customer request. [See the documentation](https://developer.atlassian.com/cloud/jira/service-desk/rest/api-group-request/#api-rest-servicedeskapi-request-issueidorkey-comment-post)",
  version: "0.0.1",
  type: "action",
  props: {
    jiraServiceDesk,
    requestId: {
      propDefinition: [
        jiraServiceDesk,
        "requestId",
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
      requestId, body, isPublic,
    } = this;
    const response = await this.createRequestComment({
      $,
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
