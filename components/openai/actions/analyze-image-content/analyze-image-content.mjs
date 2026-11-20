import openai from "../../openai.app.mjs";
import common from "../common/common-assistants.mjs";
import {
  DEFAULT_RESPONSES_VISION_MODEL,
  getResponsesVisionModelIds,
} from "../common/responses-vision-model.mjs";
import FormData from "form-data";
import { getFileStreamAndMetadata } from "@pipedream/platform";

export default {
  ...common,
  key: "openai-analyze-image-content",
  name: "Analyze Image Content",
  description: "Send a message or question about an image and receive a response. [See the documentation](https://developers.openai.com/api/reference/resources/responses/methods/create)",
  version: "1.2.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    openai,
    modelId: {
      type: "string",
      label: "Model",
      description: "The vision-capable OpenAI model to use with the Responses API",
      default: DEFAULT_RESPONSES_VISION_MODEL,
      async options() {
        return getResponsesVisionModelIds(this.openai);
      },
    },
    message: {
      type: "string",
      label: "Message",
      description: "The message or question to send",
    },
    imageFileId: {
      propDefinition: [
        openai,
        "fileId",
        () => ({
          purpose: "vision",
        }),
      ],
      optional: true,
    },
    filePath: {
      type: "string",
      label: "File Path",
      description: "The image to process. Provide a path to a file in the `/tmp` directory (for example, `/tmp/myFile.jpg`). Supported image types: jpeg, jpg, png, gif, webp",
      format: "file-ref",
      optional: true,
    },
    fileUrl: {
      type: "string",
      label: "File URL",
      description: "The image to process. Provide a URL to a file (for example, `https://example.com/myFile.jpg`). Supported image types: jpeg, jpg, png, gif, webp",
      optional: true,
    },
    imageDetailLevel: {
      type: "string",
      label: "Image Detail Level",
      description: "The detail parameter tells the model what level of detail to use when processing and understanding the image (low, high, original, or auto). If you skip the parameter, the model will use auto.",
      options: [
        "low",
        "high",
        "original",
        "auto",
      ],
      default: "auto",
      optional: true,
    },
    syncDir: {
      type: "dir",
      accessMode: "read",
      sync: true,
      optional: true,
    },
  },
  async run({ $ }) {
    const data = {
      model: this.modelId ?? DEFAULT_RESPONSES_VISION_MODEL,
      input: [
        {
          role: "user",
          content: [
            {
              type: "input_text",
              text: this.message,
            },
          ],
        },
      ],
    };
    if (this.imageFileId) {
      data.input[0].content.push({
        type: "input_image",
        file_id: this.imageFileId,
        detail: this.imageDetailLevel,
      });
    }
    if (this.fileUrl) {
      data.input[0].content.push({
        type: "input_image",
        image_url: this.fileUrl,
        detail: this.imageDetailLevel,
      });
    }
    if (this.filePath) {
      const fileData = new FormData();
      const {
        stream, metadata,
      } = await getFileStreamAndMetadata(this.filePath);
      fileData.append("purpose", "vision");
      fileData.append("file", stream, {
        contentType: metadata.contentType,
        knownLength: metadata.size,
        filename: metadata.name,
      });

      const { id } = await this.openai.uploadFile({
        $,
        data: fileData,
        headers: fileData.getHeaders(),
      });

      data.input[0].content.push({
        type: "input_image",
        file_id: id,
        detail: this.imageDetailLevel,
      });
    }

    const run = await this.openai.responses({
      $,
      data,
    });

    const returnData = {
      run,
      messages: data.input,
    };

    const message = run.output.find(({
      type, role,
    }) => type === "message" && role === "assistant");
    if (message) {
      const content = message.content?.find(({
        type, text,
      }) => type === "output_text" && text);
      returnData.response = content?.text;
      returnData.messages.push({
        role: message.role,
        content,
      });
    }

    $.export("$summary", "Successfully analyzed image content.");
    return returnData;
  },
};
