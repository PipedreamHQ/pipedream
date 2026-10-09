import heygen from "../../heygen.app.mjs";

export default {
  key: "heygen-list-custom-events-options",
  name: "List Custom Events Options",
  description: "Retrieves a page of available webhook event types, whose `event_type` can be used for Custom Events fields. If `has_more` is true, pass `next_token` as the Token to get the next page. Example: with no Token it returns `{\"data\": [{\"event_type\": \"avatar_video.success\", \"description\": \"Fires when an avatar video finishes\"}], \"has_more\": false, \"next_token\": null}`. [See the documentation](https://developers.heygen.com/reference/list-webhook-event-types)",
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
    token: {
      propDefinition: [
        heygen,
        "token",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.heygen.listEventTypes({
      $,
      params: {
        token: this.token,
      },
    });
    const count = response.data?.length || 0;
    $.export("$summary", `Successfully retrieved ${count} event type${count === 1
      ? ""
      : "s"}`);
    return response;
  },
};
