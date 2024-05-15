import openai from "../../openai.app.mjs";

export default {
  key: "openai-analyze-image-content",
  name: "Analyze Image Content",
  description: "Send a message or question about an image and receive a response. [See the documentation](https://platform.openai.com/docs/api-reference/runs/createThreadAndRun)",
  version: "0.0.1",
  type: "action",
  props: {
    openai,
    message: {
      type: "string",
      label: "Message",
      description: "The message or question to send",
    },
    imageUrl: {
      type: "string",
      label: "Image URL",
      description: "The URL of the image to analyze. Must be a supported image types: jpeg, jpg, png, gif, webp",
    },
    model: {
      propDefinition: [
        openai,
        "visionModel",
      ],
    },
  },
  async run({ $ }) {
    const { id: assistantId } = await this.openai.createAssistant({
      $,
      data: {
        model: this.model,
      },
    });

    let run;
    run = await this.openai.createThreadAndRun({
      $,
      data: {
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
                {
                  type: "image_url",
                  image_url: {
                    url: this.imageUrl,
                  },
                },
              ],
            },
          ],
        },
        model: this.model,
      },
    });
    const runId = run.id;
    const threadId = run.thread_id;

    // poll until run is completed
    const timer = (ms) => new Promise((res) => setTimeout(res, ms));
    while (run.status !== "completed") {
      run = await this.openai.retrieveRun({
        $,
        threadId,
        runId,
      });
      await timer(3000);
    }

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
