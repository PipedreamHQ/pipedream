import freshchat from "../../freshchat.app.mjs";

export default {
  key: "freshchat-get-user",
  name: "Get User",
  description: "Retrieves a single Freshchat user (the customer in a chat) by ID, including `first_name`, `last_name`, `email`, `phone`, and custom `properties` (an array of `{name, value}` objects). Use this to resolve who a conversation belongs to. The user ID is returned as `user_id` (or `actor_id` when `actor_type` is `user`) by **List Messages**, and as `user_id` on conversations. Returns a 404 error if no user exists with the given ID. [See the documentation](https://developers.freshchat.com/api/#retrieve_user_information)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  ai: "optimized",
  props: {
    freshchat,
    userId: {
      propDefinition: [
        freshchat,
        "userId",
      ],
      description: "The ID of the user to retrieve, e.g. `2deb2a22-703e-4f1d-8527-7bd123c84fd4`. Take it from `conversation.user_id` or `actor_id` (when `actor_type` is `user`) in **List Messages**, or select one from the list.",
    },
  },
  async run({ $ }) {
    const response = await this.freshchat.getUser({
      $,
      userId: this.userId,
    });
    $.export("$summary", `Successfully retrieved user ${this.userId}`);
    return response;
  },
};
