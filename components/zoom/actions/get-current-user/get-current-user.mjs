import zoom from "../../zoom.app.mjs";

export default {
  key: "zoom-get-current-user",
  name: "Get Current User",
  description: "Returns the authenticated Zoom user's ID, name, email, account ID, and timezone. Call this first when the user says 'my meetings', 'my recordings', or needs their Zoom identity. Use `id` with **Create Meeting**, `account_id` to scope queries, and `email` to match participants in **List Past Meeting Participants**. [See the documentation](https://developers.zoom.us/docs/api/users/#tag/users/GET/users/{userId}).",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    zoom,
  },
  async run({ $ }) {
    const user = await this.zoom._makeRequest({
      step: $,
      path: "/users/me",
    });

    const summaryName = user.display_name || `${user.first_name} ${user.last_name}`.trim() || user.email;
    $.export("$summary", `Retrieved user ${summaryName}`);

    return {
      id: user.id,
      first_name: user.first_name,
      last_name: user.last_name,
      display_name: user.display_name,
      email: user.email,
      account_id: user.account_id,
      timezone: user.timezone,
    };
  },
};
