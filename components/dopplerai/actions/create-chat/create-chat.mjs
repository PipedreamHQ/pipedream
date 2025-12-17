import dopplerai from "../../dopplerai.app.mjs";

export default {
  key: "dopplerai-create-chat",
  name: "Create Chat",
  description: "Initializes a new chat thread. [See the documentation](https://api.dopplerai.com/docs/reference#tag/Chats/operation/create_chat_v1_chats_post)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    dopplerai,
    referenceId: {
      propDefinition: [
        dopplerai,
        "referenceId",
      ],
    },
    name: {
      propDefinition: [
        dopplerai,
        "name",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.dopplerai.createChat({
      $,
      data: {
        reference_id: this.referenceId,
        name: this.name,
      },
    });
    $.export("$summary", `Successfully created chat with UUID ${response.uuid}`);
    return response;
  },
};
