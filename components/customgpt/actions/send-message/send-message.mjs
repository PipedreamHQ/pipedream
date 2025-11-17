import { getFileStreamAndMetadata } from "@pipedream/platform";
import FormData from "form-data";
import {
  CHATBOT_MODEL_OPTIONS,
  RESPONSE_SOURCE_OPTIONS,
} from "../../common/constants.mjs";
import customgpt from "../../customgpt.app.mjs";

export default {
  key: "customgpt-send-message",
  name: "Send Message",
  description: "Sends a message to an existing conversation within a project. [See the documentation](https://docs.customgpt.ai/reference/post_api-v1-projects-projectid-conversations-sessionid-messages)",
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
    conversationId: {
      propDefinition: [
        customgpt,
        "conversationId",
        ({ projectId }) => ({
          projectId,
          fieldId: "session_id",
        }),
      ],
    },
    externalId: {
      type: "string",
      label: "External ID",
      description: "The external ID of the message",
      optional: true,
    },
    prompt: {
      type: "string",
      label: "Prompt",
      description: "Prompt to send to OpenAI",
      optional: true,
    },
    customPersona: {
      type: "string",
      label: "Custom Persona",
      description: "Custom persona to use for the conversation",
      optional: true,
    },
    chatbotModel: {
      type: "string",
      label: "Chatbot Model",
      description: "The model to use for the conversation",
      options: CHATBOT_MODEL_OPTIONS,
    },
    responseSource: {
      type: "string",
      label: "Response Source",
      description: "By default, CustomGPT asks ChatGPT to use only your content in its response (recommended). If you wish ChatGPT to improvise and use its own knowledgebase as well, you can set this to \"openai_content\".",
      options: RESPONSE_SOURCE_OPTIONS,
    },
    customContent: {
      type: "string",
      label: "Custom Content",
      description: "Custom content to use for the conversation",
      optional: true,
    },
    file: {
      type: "string",
      label: "File Path",
      description: "The path to the file saved to the `/tmp` directory (e.g. `tmp/example.pdf`). Allowed types: **pdf, docx, doc, odt, txt, jpg, jpeg, png, webp**. [See the documentation](https://pipedream.com/docs/workflows/steps/code/nodejs/working-with-files/#the-tmp-directory).",
      optional: true,
    },
  },
  async run({ $ }) {
    const data = new FormData();
    data.append("prompt", this.prompt);
    data.append("custom_persona", this.customPersona);
    data.append("chatbot_model", this.chatbotModel);
    data.append("response_source", this.responseSource);
    data.append("custom_content", this.customContent);

    if (this.file) {
      const {
        stream, metadata,
      } = await getFileStreamAndMetadata(this.file);
      data.append("file", stream, {
        filename: metadata.name,
        contentType: metadata.contentType,
      });
    }
    const response = await this.customgpt.sendMessage({
      $,
      conversationId: this.conversationId,
      projectId: this.projectId,
      data,
      headers: data.getHeaders(),
      params: {
        external_id: this.externalId,
      },
    });

    $.export("$summary", `Successfully sent message to conversation ${this.conversationId}`);

    return response;
  },
};

