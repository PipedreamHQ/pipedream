import { defineAction } from "@pipedream/types";
import app from "../../app/google_my_business.app";
import { BatchGetReviewsParams } from "../../common/requestParams";

const DOCS_LINK = "https://developers.google.com/my-business/content/review-data#get_reviews_from_multiple_locations";
const ORDER_BY_LINK = "https://developers.google.com/my-business/reference/rest/v4/accounts.locations/batchGetReviews";

export default defineAction({
  key: "google_my_business-get-reviews-multiple-locations",
  name: "Get Reviews from Multiple Locations",
  description: `Get reviews from multiple locations at once. [See the documentation](${DOCS_LINK})`,
  version: "0.0.6",
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
    pageToken: {
      type: "string",
      label: "Page Token",
      description: "The `nextPageToken` returned by a previous run of this action, to fetch the next page of reviews",
      optional: true,
    },
    orderBy: {
      type: "string",
      label: "Order By",
      description: `How to order the reviews. Defaults to \`updateTime desc\` when left empty. [See the documentation](${ORDER_BY_LINK})`,
      optional: true,
      options: [
        "rating",
        "rating desc",
        "updateTime desc",
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
      account, locationNames, pageSize, pageToken, orderBy, ignoreRatingOnlyReviews,
    } = this;

    const accountId = this.app.getCleanName(account);

    const params: BatchGetReviewsParams = {
      $,
      account: accountId,
      data: {
        locationNames: locationNames?.map((locationName: string) =>
          `accounts/${accountId}/locations/${this.app.getCleanName(locationName)}`),
        pageSize,
        pageToken,
        orderBy,
        ignoreRatingOnlyReviews,
      },
    };

    const response = await this.app.batchGetReviews(params);

    $.export("$summary", `Successfully retrieved reviews from ${locationNames.length} locations`);

    return response;
  },
});
