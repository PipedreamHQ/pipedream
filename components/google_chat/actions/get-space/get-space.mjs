import app from "../../google_chat.app.mjs";

export default {
  key: "google_chat-get-space",
  name: "Get Space",
  description: "Returns details about a space. [See the documentation](https://developers.google.com/chat/api/reference/rest/v1/spaces/get)",
  version: "0.0.2",
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
  },
  async run({ $ }) {
    const response = await this.app.getSpace({
      $,
      spaceId: this.spaceId,
    });
    $.export("$summary", `Successfully fetched space "${response.name}"`);
    return response;
  },
};
