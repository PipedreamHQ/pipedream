import app from "../../google_chat.app.mjs";

export default {
  key: "google_chat-get-member",
  name: "Get Member",
  description: "Returns details about a membership. [See the documentation](https://developers.google.com/chat/api/reference/rest/v1/spaces.members/get)",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    app,
    spaceId: {
      propDefinition: [
        app,
        "spaceId",
      ],
    },
    memberId: {
      propDefinition: [
        app,
        "memberId",
        (c) => ({
          spaceId: c.spaceId,
        }),
      ],
    },
  },
  async run({ $ }) {
    const response = await this.app.getMember({
      $,
      spaceId: this.spaceId,
      memberId: this.memberId,
    });
    $.export("$summary", `Successfully fetched member "${response.name}"`);
    return response;
  },
};
