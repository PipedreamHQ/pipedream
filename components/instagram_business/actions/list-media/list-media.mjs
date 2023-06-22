import common from "../common/common.mjs";

export default {
  ...common,
  key: "instagram_business-list-media",
  name: "List Media",
  description: "List media objects. [See the documentation](https://developers.facebook.com/docs/instagram-api/reference/ig-user/media#reading)",
  version: "0.0.1",
  type: "action",
  props: {
    ...common.props,
    maxResults: {
      propDefinition: [
        common.props.instagram,
        "maxResults",
      ],
    },
  },
  async run({ $ }) {
    const accountId = await this.instagram.getInstagramBusinessAccountId({
      pageId: this.page,
      $,
    });

    const response = this.paginate({
      fn: this.instagram.listMedia,
      args: {
        accountId,
        params: {
          fields: "comments_count, id, like_count, media_type, media_product_type, media_url, owner, permalink, timestamp, username",
        },
        $,
      },
    });

    const media = [];
    let count = 0;
    for await (const object of response) {
      media.push(object);
      if (this.maxResults && ++count === this.maxResults) {
        break;
      }
    }

    if (media?.length) {
      $.export("$summary", `Successfully retrieved ${media.length} media object${media.length === 1
        ? ""
        : "s"}`);
    }

    return media;
  },
};
