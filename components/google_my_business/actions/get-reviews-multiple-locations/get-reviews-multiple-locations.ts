import { defineAction } from "@pipedream/types";
import app from "../../app/google_my_business.app";
import { BatchGetReviewsParams } from "../../common/requestParams";
import { REVIEWS_PAGE_SIZE } from "../../common/constants";

const DOCS_LINK = "https://developers.google.com/my-business/reference/rest/v4/accounts.locations/batchGetReviews";

export default defineAction({
  key: "google_my_business-get-reviews-multiple-locations",
  name: "Get Reviews from Multiple Locations",
  description: "Get reviews from several locations of the same account in one request, for example to monitor recent reviews across all branches."
    + ` Each page holds up to \`Page Size\` reviews (max ${REVIEWS_PAGE_SIZE}). When more reviews remain, the output includes a \`nextPageToken\`;`
    + " run the action again with that token in `Page Token` (and the same locations and `Order By`) to get the next page."
    + " Each item in `locationReviews` carries the location `name` and the `review`."
    + " To page through a single location's full history, use **List All Reviews** instead."
    + ` [See the documentation](${DOCS_LINK})`,
  version: "0.1.0",
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
      description: `The number of reviews to return in this page (max ${REVIEWS_PAGE_SIZE}). Use \`Page Token\` to get the next page.`,
      optional: true,
      default: REVIEWS_PAGE_SIZE,
      min: 1,
      max: REVIEWS_PAGE_SIZE,
    },
    orderBy: {
      propDefinition: [
        app,
        "reviewOrderBy",
      ],
    },
    pageToken: {
      propDefinition: [
        app,
        "pageToken",
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
      account, locationNames, pageSize, orderBy, pageToken, ignoreRatingOnlyReviews,
    } = this;

    // The app method builds the full `accounts/{id}/locations/{id}` names
    const params: BatchGetReviewsParams = {
      $,
      account,
      data: {
        locationNames,
        pageSize,
        pageToken,
        orderBy,
        ignoreRatingOnlyReviews,
      },
    };

    const response = await this.app.batchGetReviews(params);

    const count = response?.locationReviews?.length ?? 0;
    $.export("$summary", `Successfully retrieved ${count} review${count === 1
      ? ""
      : "s"} from ${locationNames.length} location${locationNames.length === 1
      ? ""
      : "s"}${response?.nextPageToken
      ? " (more reviews are available, see `nextPageToken`)"
      : ""}`);

    return response;
  },
});
