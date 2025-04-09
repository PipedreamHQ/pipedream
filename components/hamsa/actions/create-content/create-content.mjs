import hamsa from "../../hamsa.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "hamsa-create-content",
  name: "Create AI Content",
  description: "Transform transcribed content into various formats for content marketing. [See the documentation](https://docs.tryhamsa.com/api-reference/endpoint/post-ai-content)",
  version: "0.0.1",
  type: "action",
  props: {
    hamsa,
    mediaUrl: {
      propDefinition: [
        hamsa,
        "mediaUrl",
      ],
    },
    webhookUrl: {
      propDefinition: [
        hamsa,
        "webhookUrl",
      ],
    },
    aiParts: {
      propDefinition: [
        hamsa,
        "aiParts",
      ],
    },
  },
  async run({ $ }) {
    const transcribeResponse = await this.hamsa.transcribeVideo({
      mediaUrl: this.mediaUrl,
      webhookUrl: this.webhookUrl,
    });

    $.export("$summary", `Video transcription job created with ID: ${transcribeResponse.id}`);

    const aiContentResponse = await this.hamsa.createAIContent({
      aiParts: this.aiParts,
    });

    $.export("$summary", `AI content creation job created with ID: ${aiContentResponse.id}`);

    return {
      transcriptionJob: transcribeResponse,
      aiContentJob: aiContentResponse,
    };
  },
};
