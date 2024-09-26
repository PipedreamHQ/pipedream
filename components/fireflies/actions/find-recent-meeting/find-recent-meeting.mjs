import fireflies from "../../fireflies.app.mjs";
import queries from "../../common/queries.mjs";

export default {
  key: "fireflies-find-recent-meeting",
  name: "Find Recent Meeting",
  description: "Retrieves the most recent meeting for a user. [See the documentation](https://docs.fireflies.ai/graphql-api/query/user)",
  version: "0.0.1",
  type: "action",
  props: {
    fireflies,
    userId: {
      propDefinition: [
        fireflies,
        "userId",
      ],
    },
  },
  async run({ $ }) {
    const { data: { user: { recent_meeting: meetingId } } } = await this.fireflies.query({
      $,
      data: {
        query: queries.getUser,
        variables: {
          userId: this.userId,
        },
      },
    });
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
