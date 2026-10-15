import fireflies from "../../fireflies.app.mjs";
import queries from "../../common/queries.mjs";
import { ConfigurationError } from "@pipedream/platform";

export default {
  key: "fireflies-find-recent-meeting",
  name: "Find Recent Meeting",
  description: "Retrieve a specific user's most recent meeting, returning the full transcript (summary, sentence-level text, duration, date, audio/video URLs) rather than just the ID. Use this as the starting point when a request refers to \"my last meeting\" or \"their latest call\". Returns no data if the user has no meetings yet. Use **Find Meeting by ID** instead when you already have a meeting ID. [See the documentation](https://docs.fireflies.ai/graphql-api/query/user)",
  version: "0.0.6",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  ai: "optimized",
  props: {
    fireflies,
    userId: {
      propDefinition: [
        fireflies,
        "userId",
      ],
      description: "The user whose most recent meeting should be retrieved. Use **List User ID Options** to look up a user ID by name.",
    },
  },
  async run({ $ }) {
    if (!this.userId) {
      throw new ConfigurationError("User ID is required");
    }

    const user = await this.fireflies.query({
      $,
      data: {
        query: queries.getUser,
        variables: {
          userId: this.userId,
        },
      },
    });

    const meetingId = user?.data?.user?.recent_meeting;
    if (!meetingId) {
      $.export("$summary", `No meeting found for user with ID ${this.userId}`);
      return;
    }
    const meeting = await this.fireflies.query({
      $,
      data: {
        query: queries.getTranscript,
        variables: {
          transcriptId: meetingId,
        },
      },
    });

    $.export("$summary", `Successfully fetched the most recent meeting for user with ID ${this.userId}`);
    return meeting;
  },
};
