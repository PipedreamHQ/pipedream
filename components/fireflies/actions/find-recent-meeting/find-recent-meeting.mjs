import fireflies from "../../fireflies.app.mjs";
import queries from "../../common/queries.mjs";
import { ConfigurationError } from "@pipedream/platform";

export default {
  key: "fireflies-find-recent-meeting",
  name: "Find Recent Meeting",
  description: "Retrieves the most recent meeting for a user. [See the documentation](https://docs.fireflies.ai/graphql-api/query/user)",
  version: "0.0.4",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
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
