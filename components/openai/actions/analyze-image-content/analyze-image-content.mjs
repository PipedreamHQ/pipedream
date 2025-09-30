import openai from "../../openai.app.mjs";
import common from "../common/common-assistants.mjs";
import FormData from "form-data";
import { getFileStreamAndMetadata } from "@pipedream/platform";

export default {
  ...common,
  key: "openai-analyze-image-content",
  name: "Analyze Image Content",
  description: "Send a message or question about an image and receive a response. [See the documentation](https://platform.openai.com/docs/api-reference/runs/createThreadAndRun)",
  version: "1.0.3",
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
    const { id: assistantId } = await this.openai.createAssistant({
      $,
      data: {
        model: "gpt-4o", // replaced from "gpt-4-vision-preview" - see https://platform.openai.com/docs/deprecations
      },
    });

    const data = {
      assistant_id: assistantId,
      thread: {
        messages: [
          {
            role: "user",
            content: [
              {
                type: "text",
                text: this.message,
              },
            ],
          },
        ],
      },
      model: this.model,
    };
    if (this.imageUrl) {
      data.thread.messages[0].content.push({
        type: "image_url",
        image_url: {
          url: this.imageUrl,
        },
      });
    }
    if (this.imageFileId) {
      data.thread.messages[0].content.push({
        type: "image_file",
        image_file: {
          file_id: this.imageFileId,
        },
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

      data.thread.messages[0].content.push({
        type: "image_file",
        image_file: {
          file_id: id,
        },
      });
    }

    let run;
    run = await this.openai.createThreadAndRun({
      $,
      data,
    });
    const runId = run.id;
    const threadId = run.thread_id;

    run = await this.pollRunUntilCompleted(run, threadId, runId, $);

    // get response;
    const { data: messages } = await this.openai.listMessages({
      $,
      threadId,
      params: {
        order: "desc",
      },
    });
    const response = messages[0].content[0].text.value;
    return {
      response,
      messages,
      run,
    };
  },
};
