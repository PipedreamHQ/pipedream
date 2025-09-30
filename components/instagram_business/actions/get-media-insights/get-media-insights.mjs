import common from "../common/common.mjs";

export default {
  ...common,
  key: "instagram_business-get-media-insights",
  name: "Get Media Insights",
  description: "Get insights data on a media object. [See the documentation](https://developers.facebook.com/docs/instagram-api/reference/ig-media/insights#read)",
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
    metrics: {
      propDefinition: [
        common.props.instagram,
        "mediaMetrics",
        (c) => ({
          mediaId: c.media,
        }),
      ],
    },
  },
  async run({ $ }) {
    const { data: insights } = await this.instagram.getMediaInsights({
      mediaId: this.media,
      params: {
        metric: this.metrics.join(","),
      },
      $,
    });

    $.export("$summary", `Successfully retrieved insights for media with ID ${this.media}.`);

    return insights;
  },
};
