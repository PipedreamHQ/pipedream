import etrusted from "../../etrusted.app.mjs";

export default {
  key: "etrusted-get-service-review-rating",
  name: "Get Service Review Rating",
  description: "Retrieves aggregate ratings for service reviews by channel ID. [See the documentation](https://developers.etrusted.com/reference/get-channel-service-reviews-aggregate-rating)",
  version: "0.0.1",
  type: "action",
  props: {
    etrusted,
    channelId: {
      propDefinition: [
        etrusted,
        "channelId",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.etrusted.getServiceReviewRating({
      $,
      channelId: this.channelId,
    });
    $.export("$summary", `Successfully retrieved service review rating for ${this.channelId}`);
    return response;
  },
};
