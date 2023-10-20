import onedesk from "../../onedesk.app.mjs";

export default {
  key: "onedesk-create-message",
  name: "Create Message",
  description: "Creates a message or comment. [See the docs](https://www.onedesk.com/developers/#_create_comment)",
  version: "0.0.1",
  type: "action",
  props: {
    onedesk,
    itemId: {
      propDefinition: [
        onedesk,
        "itemId",
      ],
    },
    description: {
      type: "string",
      label: "Description",
      description: "Content of the message",
    },
    postType: {
      propDefinition: [
        onedesk,
        "postType",
      ],
    },
  },
  async run({ $ }) {
    const { data } = await this.onedesk.createComment({
      data: {
        itemId: this.itemId,
        description: this.description,
        postType: this.postType,
        token: this.onedesk._authToken(),
      },
      $,
    });

    $.export("$summary", `Successfully created comment with ID ${data}.`);

    return data;
  },
};
