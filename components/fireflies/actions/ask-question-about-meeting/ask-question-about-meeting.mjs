import fireflies from "../../fireflies.app.mjs";
import mutations from "../../common/mutations.mjs";
import constants from "../../common/constants.mjs";
import { ConfigurationError } from "@pipedream/platform";

export default {
  key: "fireflies-ask-question-about-meeting",
  name: "Ask Question About Meeting",
  description: "Ask AskFred, Fireflies' AI assistant, a natural language question about a meeting's content — for example, action items, decisions made, or a summary of a specific topic. Starts a new AskFred conversation thread; use **Continue AskFred Conversation** to ask follow-up questions in the same thread. Requires AI credits on the connected Fireflies account. [See the documentation](https://docs.fireflies.ai/graphql-api/mutation/create-askfred-thread)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  ai: "optimized",
  props: {
    fireflies,
    query: {
      propDefinition: [
        fireflies,
        "question",
      ],
    },
    meetingId: {
      propDefinition: [
        fireflies,
        "meetingId",
      ],
      description: "Scope the question to a single meeting. Use **Find Meeting by ID** or **Find Recent Meeting** to look up a meeting ID. Omit to search across multiple meetings using `filters` instead.",
      optional: true,
    },
    filters: {
      type: "object",
      label: "Filters",
      description: "Advanced: search across multiple meetings instead of a single one. Ignored if Meeting ID is set. Example: `{\"start_time\": \"2024-01-01T00:00:00Z\", \"end_time\": \"2024-01-31T23:59:59Z\", \"organizers\": [\"user_123\"]}`. Supported keys: `start_time`, `end_time`, `channel_ids`, `organizers`, `participants`, `transcript_ids`.",
      optional: true,
    },
    responseLanguage: {
      propDefinition: [
        fireflies,
        "responseLanguage",
      ],
    },
    formatMode: {
      propDefinition: [
        fireflies,
        "formatMode",
      ],
    },
  },
  async run({ $ }) {
    if (this.query.length > constants.MAX_QUESTION_LENGTH) {
      throw new ConfigurationError(`Question exceeds the ${constants.MAX_QUESTION_LENGTH} character limit.`);
    }

    const { data: { createAskFredThread } } = await this.fireflies.query({
      $,
      data: {
        query: mutations.createAskFredThread,
        variables: {
          input: {
            query: this.query,
            transcript_id: this.meetingId,
            filters: this.meetingId
              ? undefined
              : this.filters,
            response_language: this.responseLanguage,
            format_mode: this.formatMode,
          },
        },
      },
    });

    const { message } = createAskFredThread;
    $.export("$summary", `AskFred started thread ${message.thread_id} for question "${this.query}"`);
    return message;
  },
};
