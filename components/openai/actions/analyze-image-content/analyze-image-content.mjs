import openai from "../../openai.app.mjs";
import common from "../common/common-assistants.mjs";
import FormData from "form-data";
import { getFileStreamAndMetadata } from "@pipedream/platform";

export default {
  ...common,
  key: "openai-analyze-image-content",
  name: "Analyze Image Content",
  description: "Send a message or question about an image and receive a response. [See the documentation](https://developers.openai.com/api/reference/resources/responses/methods/create)",
  version: "1.1.0",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    openai,
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
      label: "File Path or URL",
      description: "The image to process. Provide either a file URL or a path to a file in the `/tmp` directory (for example, `/tmp/myFile.jpg`). Supported image types: jpeg, jpg, png, gif, webp",
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
      model: "gpt-4o",
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
      });
    }

    const run = await this.openai.responses({
      $,
      data,
    });

    const messages = data.input;
    messages.push({
      role: run.output[0].role,
      content: run.output[0].content,
    });

    $.export("$summary", "Successfully analyzed image content.");
    return {
      response: run.output[0].content[0].text,
      messages,
      run,
    };
  },
};
