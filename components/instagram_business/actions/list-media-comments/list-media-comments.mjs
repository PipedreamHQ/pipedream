import common from "../common/common.mjs";
import constants from "../../common/constants.mjs";

export default {
  ...common,
  key: "instagram_business-list-media-comments",
  name: "List Media Comments",
  description: "List comments on a media object. [See the documentation](https://developers.facebook.com/docs/instagram-api/reference/ig-media/comments#reading)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
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
    fields: {
      type: "string[]",
      label: "Fields",
      description: "Fields to return in the response",
      options: constants.COMMENT_FIELDS_OPTIONS,
      optional: true,
      default: constants.COMMENT_FIELDS_OPTIONS,
    },
  },
  async run({ $ }) {
    const { data: comments } = await this.instagram.listMediaComments({
      mediaId: this.media,
      params: {
        fields: this.fields.join(","),
      },
      $,
    });

    if (comments?.length) {
      $.export("$summary", `Successfully retrieved ${comments.length} comment${comments.length === 1
        ? ""
        : "s"}`);
    }

    return comments;
  },
};
