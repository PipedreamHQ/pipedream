import openai from "../../openai.app.mjs";
import common from "../common/common-assistants.mjs";

export default {
  ...common,
  key: "openai-chat-with-assistant",
  name: "Chat with Assistant",
  description: "Sends a message and generates a response, storing the message history for a continuous conversation. [See the documentation](https://platform.openai.com/docs/api-reference/runs/createThreadAndRun)",
  version: "0.0.3",
  type: "action",
  props: {
    openai,
    message: {
      type: "string",
      label: "Message",
      description: "The message to send",
    },
    assistantId: {
      propDefinition: [
        openai,
        "assistant",
      ],
      description: "The assistant to use. Leave blank to create a new assistant",
      optional: true,
    },
    name: {
      propDefinition: [
        openai,
        "name",
      ],
    },
    instructions: {
      propDefinition: [
        openai,
        "instructions",
      ],
    },
    model: {
      propDefinition: [
        openai,
        "assistantModel",
      ],
      optional: true,
      default: "gpt-3.5-turbo",
    },
    threadId: {
      propDefinition: [
        openai,
        "threadId",
      ],
      description: "The unique identifier for the thread. Example: `thread_abc123`. Leave blank to create a new thread. To locate the thread ID, make sure your OpenAI Threads setting (Settings -> Organization/Personal -> General -> Features and capabilities -> Threads) is set to \"Visible to organization owners\" or \"Visible to everyone\". You can then access the list of threads and click on individual threads to reveal their IDs",
      optional: true,
    },
    ...common.props,
  },
  async run({ $ }) {
    // create assistant if not provided
    let assistantId = this.assistantId;
    if (!assistantId) {
      const { id: newAssistantId } = await this.openai.createAssistant({
        $,
        data: {
          model: this.model,
          name: this.name,
          instructions: this.instructions,
          tools: this.buildTools(),
          tool_resources: this.buildToolResources(),
        },
      });
      assistantId = newAssistantId;
    }

    // create and run thread if no thread is provided
    let threadId = this.threadId;
    let run;
    if (!threadId) {
      run = await this.openai.createThreadAndRun({
        $,
        data: {
          assistant_id: assistantId,
          thread: {
            messages: [
              {
                role: "user",
                content: this.message,
              },
            ],
          },
          model: this.model,
          instructions: this.instructions,
          tools: this.buildTools(),
          tool_resources: this.buildToolResources(),
        },
      });
      threadId = run.thread_id;
    } else {
      // create run for thread if threadId is provided
      run = await this.openai.createRun({
        $,
        threadId: this.threadId,
        data: {
          assistant_id: assistantId,
          model: this.model,
          instructions: this.instructions,
          tools: this.buildTools(),
          tool_resources: this.buildToolResources(),
          additional_messages: [
            {
              role: "user",
              content: this.message,
            },
          ],
        },
      });
    }
    const runId = run.id;

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
