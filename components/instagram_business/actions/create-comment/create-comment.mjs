import common from "../common/common.mjs";

export default {
  ...common,
  key: "instagram_business-create-comment",
  name: "Create Comment",
  description: "Creates a comment on a media object. [See the documentation](https://developers.facebook.com/docs/instagram-api/reference/ig-media/comments#creating)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    ...common.props,
    media: {
      propDefinition: [
        common.props.instagram,
        "media",
        (c) => ({
          pageId: c.page,
        }),
      ],
    },
    message: {
      type: "string",
      label: "Message",
      description: "The text to be included in the comment",
    },
  },
  async run({ $ }) {
    const comment = await this.instagram.createMediaComment({
      mediaId: this.media,
      data: {
        message: this.message,
      },
      $,
    });

    $.export("$summary", `Successfully created comment with ID ${comment.id}`);

    return comment;
  },
};
