import fireflies from "../../fireflies.app.mjs";
import queries from "../../common/queries.mjs";

export default {
  key: "fireflies-find-meeting-by-id",
  name: "Find Meeting by ID",
  description: "Locates a specific user meeting by its unique ID. [See the documentation](https://docs.fireflies.ai/graphql-api/query/transcript)",
  version: "0.0.1",
  type: "action",
  props: {
    fireflies,
    meetingId: {
      propDefinition: [
        fireflies,
        "meetingId",
      ],
    },
  },
  async run({ $ }) {
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
