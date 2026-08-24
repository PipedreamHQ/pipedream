// x-pd-ai: optimized
import fireflies from "../../fireflies.app.mjs";
import queries from "../../common/queries.mjs";
import { ConfigurationError } from "@pipedream/platform";

export default {
  key: "fireflies-find-meeting-by-id",
  name: "Find Meeting by ID",
  description: "Retrieve a single meeting's full transcript by its ID, including the summary (overview, action items, keywords, outline), sentence-level transcript text, duration, date, and audio/video URLs. Use this when you already have a meeting ID; use **Find Recent Meeting** instead to get a user's latest meeting, or **List Meeting ID Options** to look up an ID by meeting title. [See the documentation](https://docs.fireflies.ai/graphql-api/query/transcript)",
  version: "0.0.5",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    fireflies,
    meetingId: {
      propDefinition: [
        fireflies,
        "meetingId",
      ],
      description: "The meeting to retrieve. Use **List Meeting ID Options** to look up a meeting ID by title, or **Find Recent Meeting** to get a user's most recent one.",
    },
  },
  async run({ $ }) {
    if (!this.meetingId) {
      throw new ConfigurationError("Meeting ID is required");
    }

    const meeting = await this.fireflies.query({
      $,
      data: {
        query: queries.getTranscript,
        variables: {
          transcriptId: this.meetingId,
        },
      },
    });

    $.export("$summary", `Successfully found meeting with ID: ${this.meetingId}`);
    return meeting;
  },
};
