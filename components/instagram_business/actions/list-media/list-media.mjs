import common from "../common/common.mjs";
import constants from "../../common/constants.mjs";

export default {
  ...common,
  key: "instagram_business-list-media",
  name: "List Media",
  description: "List media objects. [See the documentation](https://developers.facebook.com/docs/instagram-api/reference/ig-user/media#reading)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    ...common.props,
    fields: {
      type: "string[]",
      label: "Fields",
      description: "Fields to return in the response",
      options: constants.MEDIA_FIELDS_OPTIONS,
      optional: true,
      default: constants.MEDIA_FIELDS_OPTIONS,
    },
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
          fields: this.fields.join(","),
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
