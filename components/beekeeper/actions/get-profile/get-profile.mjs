import beekeeper from "../../beekeeper.app.mjs";

export default {
  key: "beekeeper-get-profile",
  name: "Get User Profile",
  description: "Retrieve the profile details of a specific user. [See the documentation](https://beekeeper.stoplight.io/docs/beekeeper-api/05bcd13b38a67-get-profile-of-the-given-user)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    beekeeper,
    userId: {
      propDefinition: [
        beekeeper,
        "userId",
      ],
    },
    includeActivities: {
      type: "boolean",
      label: "Include Activities",
      description: "Whether to include the user's activities.",
      default: true,
    },
    includeTotals: {
      type: "boolean",
      label: "Include Totals",
      description: "Whether to include the user's total number of posts, comments, and likes received.",
      default: true,
    },
  },
  async run({ $ }) {
    const response = await this.beekeeper.getUserProfile({
      $,
      userId: this.userId,
      params: {
        include_activities: this.includeActivities,
        include_totals: this.includeTotals,
      },
    });

    $.export("$summary", `Successfully retrieved profile for user ID ${this.userId}`);
    return response;
  },
};
