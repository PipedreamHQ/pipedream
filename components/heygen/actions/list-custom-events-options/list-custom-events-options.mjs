import heygen from "../../heygen.app.mjs";

export default {
  key: "heygen-list-custom-events-options",
  name: "List Custom Events Options",
  description: "Retrieves all available webhook event types, whose `event_type` can be used for Custom Events fields. The full list is returned in a single response (no paging). Example: returns `{\"data\": [{\"event_type\": \"avatar_video.success\", \"description\": \"Fires when an avatar video finishes\"}]}`. [See the documentation](https://developers.heygen.com/reference/list-webhook-event-types)",
  version: "1.0.0",
  type: "action",
  ai: "optimized",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    heygen,
  },
  async run({ $ }) {
    const response = await this.heygen.listEventTypes({
      $,
    });
    const count = response.data?.length || 0;
    $.export("$summary", `Successfully retrieved ${count} event type${count === 1
      ? ""
      : "s"}`);
    return response;
  },
};
