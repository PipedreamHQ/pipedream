// x-pd-ai: optimized
import fireflies from "../../fireflies.app.mjs";
import mutations from "../../common/mutations.mjs";
import constants from "../../common/constants.mjs";
import { ConfigurationError } from "@pipedream/platform";

export default {
  key: "fireflies-create-live-meeting-soundbite",
  name: "Create Live Meeting Soundbite",
  description: "Create a soundbite from a meeting that is currently live/in-progress, based on a natural language description of the moment to capture (e.g. `the last 2 minutes` or `when the budget was discussed`). This is documented for use during a live meeting; to clip a meeting that has already ended and been transcribed, use **Create Meeting Clip** instead, which takes an explicit start and end time. Only the meeting organizer or a team admin can run this, and it consumes AI credits and is rate-limited to 10 requests per hour. [See the documentation](https://docs.fireflies.ai/graphql-api/mutation/create-live-soundbite)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    fireflies,
    meetingId: {
      propDefinition: [
        fireflies,
        "meetingId",
      ],
      label: "Live Meeting ID",
      description: "The ID of the currently live (in-progress) meeting to clip. For a meeting that has already ended, use **Create Meeting Clip** instead.",
    },
    prompt: {
      type: "string",
      label: "Prompt",
      description: "A natural language description of the soundbite to create, e.g. `Create a soundbite from the last 2 minutes`. Must be between 5 and 255 characters.",
    },
  },
  async run({ $ }) {
    if (this.prompt.length < constants.MIN_SOUNDBITE_PROMPT_LENGTH
      || this.prompt.length > constants.MAX_SOUNDBITE_PROMPT_LENGTH) {
      throw new ConfigurationError(`Prompt must be between ${constants.MIN_SOUNDBITE_PROMPT_LENGTH} and ${constants.MAX_SOUNDBITE_PROMPT_LENGTH} characters.`);
    }

    const { data: { createLiveSoundbite } } = await this.fireflies.query({
      $,
      data: {
        query: mutations.createLiveSoundbite,
        variables: {
          input: {
            meeting_id: this.meetingId,
            prompt: this.prompt,
          },
        },
      },
    });

    if (!createLiveSoundbite.success) {
      throw new Error(`Failed to create soundbite for meeting ${this.meetingId}`);
    }

    $.export("$summary", `Created soundbite for meeting ${this.meetingId}`);
    return createLiveSoundbite;
  },
};
