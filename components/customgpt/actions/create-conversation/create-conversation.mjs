import customgpt from "../../customgpt.app.mjs";

export default {
  key: "customgpt-create-conversation",
  name: "Create Conversation",
  description: "Create a new conversation for an agent (formerly known as project) identified by its unique projectId. [See the documentation](https://docs.customgpt.ai/reference/post_api-v1-projects-projectid-conversations)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    customgpt,
    projectId: {
      propDefinition: [
        customgpt,
        "projectId",
      ],
    },
    name: {
      type: "string",
      label: "Name",
      description: "The name of the conversation",
    },
  },
  async run({ $ }) {
    const response = await this.customgpt.createConversation({
      $,
      projectId: this.projectId,
      data: {
        name: this.name,
      },
    });

    $.export("$summary", `Successfully created conversation with ID "${response.data.project_id}"`);

    return response;
  },
};

