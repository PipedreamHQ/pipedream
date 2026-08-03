// x-pd-ai: optimized
import fireflies from "../../fireflies.app.mjs";
import mutations from "../../common/mutations.mjs";

export default {
  key: "fireflies-continue-askfred-conversation",
  name: "Continue AskFred Conversation",
  description: "Ask a follow-up question in an existing AskFred conversation thread, continuing the context of a prior question. Use **Ask Question About Meeting** first to start a thread and obtain its `thread_id`. [See the documentation](https://docs.fireflies.ai/graphql-api/mutation/continue-askfred-thread)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    fireflies,
    threadId: {
      propDefinition: [
        fireflies,
        "askfredThreadId",
      ],
      label: "Thread ID",
      description: "The AskFred thread to continue. Use the `thread_id` returned by **Ask Question About Meeting**, or **List AskFred Thread ID Options** to browse existing threads.",
    },
    query: {
      type: "string",
      label: "Follow-up Question",
      description: "The follow-up question to ask in this thread, e.g. `Can you provide more detail on the budget discussion?`.",
    },
    responseLanguage: {
      type: "string",
      label: "Response Language",
      description: "Language code for the AI's response, e.g. `en` or `es`. Defaults to English.",
      optional: true,
    },
    formatMode: {
      type: "string",
      label: "Format Mode",
      description: "How the answer should be formatted.",
      optional: true,
      options: [
        "markdown",
        "plaintext",
      ],
    },
  },
  async run({ $ }) {
    const { data: { continueAskFredThread } } = await this.fireflies.query({
      $,
      data: {
        query: mutations.continueAskFredThread,
        variables: {
          input: {
            thread_id: this.threadId,
            query: this.query,
            response_language: this.responseLanguage,
            format_mode: this.formatMode,
          },
        },
      },
    });

    const { message } = continueAskFredThread;
    $.export("$summary", `Continued AskFred thread ${this.threadId}`);
    return message;
  },
};
