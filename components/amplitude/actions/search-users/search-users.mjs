// x-pd-ai: optimized
import app from "../../amplitude.app.mjs";

export default {
  key: "amplitude-search-users",
  name: "Search Users",
  description: "Look up Amplitude users by Amplitude ID, Device ID, User ID, or a User ID prefix. Use this before **Get User Activity** to resolve a user's `amplitude_id`. Example: call with `user=\"user@example.com\"` -> returns `{matches: [{amplitude_id: 12345678, user_id: \"user@example.com\"}], type: \"user_id\"}`. [See the documentation](https://amplitude.com/docs/apis/analytics/dashboard-rest#user-search).",
  version: "0.0.1",
  type: "action",
  annotations: {
    readOnlyHint: true,
    destructiveHint: false,
    openWorldHint: true,
  },
  props: {
    app,
    user: {
      type: "string",
      label: "User",
      description: "A free-form user identifier (the `user` param): an Amplitude ID, Device ID, User ID, or a User ID prefix. Example: `user@example.com`.",
    },
  },
  async run({ $ }) {
    const response = await this.app.searchUsers({
      $,
      params: {
        user: this.user,
      },
    });
    $.export("$summary", `Found ${response.matches?.length ?? 0} match(es) for "${this.user}"`);
    return response;
  },
};
