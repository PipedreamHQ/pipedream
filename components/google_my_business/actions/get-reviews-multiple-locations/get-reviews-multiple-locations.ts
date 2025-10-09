import { defineAction } from "@pipedream/types";
import app from "../../app/google_my_business.app";
import { BatchGetReviewsParams } from "../../common/requestParams";

const DOCS_LINK = "https://developers.google.com/my-business/content/review-data#get_reviews_from_multiple_locations";

export default defineAction({
  key: "google_my_business-get-reviews-multiple-locations",
  name: "Get Reviews from Multiple Locations",
  description: `Get reviews from multiple locations at once. [See the documentation](${DOCS_LINK})`,
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    app,
    account: {
      propDefinition: [
        app,
        "account",
      ],
    },
    locationNames: {
      propDefinition: [
        app,
        "location",
        ({ account }: { account: string; }) => ({
          account,
        }),
      ],
      type: "string[]",
      label: "Location Names",
      description: "One or more locations to get reviews from",
    },
    pageSize: {
      type: "integer",
      label: "Page Size",
      description: "The number of reviews to return per location (max 50)",
      optional: true,
      default: 50,
      min: 1,
      max: 50,
    },
    orderBy: {
      type: "string",
      label: "Order By",
      description: "How to order the reviews: by createTime or updateTime, and ascending or descending",
      optional: true,
      options: [
        "createTime desc",
        "createTime asc",
        "updateTime desc",
        "updateTime asc",
      ],
    },
    ignoreRatingOnlyReviews: {
      type: "boolean",
      label: "Ignore Rating Only Reviews",
      description: "If true, only return reviews that have textual content",
      optional: true,
      default: false,
    },
  },
  async run({ $ }) {
    const {
      account, locationNames, pageSize, orderBy, ignoreRatingOnlyReviews,
    } = this;

    const params: BatchGetReviewsParams = {
      $,
      account,
      data: {
        locationNames: locationNames?.map((locationName: string) => `accounts/${account}/locations/${locationName}`),
        pageSize,
        orderBy,
        ignoreRatingOnlyReviews,
      },
    };

    const response = await this.app.batchGetReviews(params);

    $.export("$summary", `Successfully retrieved reviews from ${locationNames.length} locations`);

    return response;
  },
});
