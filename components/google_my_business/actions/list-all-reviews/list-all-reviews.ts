import { defineAction } from "@pipedream/types";
import app from "../../app/google_my_business.app";
import { ListReviewsParams } from "../../common/requestParams";
import { REVIEWS_PAGE_SIZE } from "../../common/constants";

const DOCS_LINK = "https://developers.google.com/my-business/reference/rest/v4/accounts.locations.reviews/list";

export default defineAction({
  key: "google_my_business-list-all-reviews",
  name: "List All Reviews",
  description: "List the reviews of a single location, for example to audit or export its review history."
    + ` Google returns at most ${REVIEWS_PAGE_SIZE} reviews per page, so this action keeps requesting pages until it has \`Max Reviews\` reviews or there are none left.`
    + " The output includes `reviews`, the location's `averageRating` and `totalReviewCount`, and a `nextPageToken` when more reviews remain."
    + " To continue, run the action again with that token in `Page Token`."
    + " To read several locations in one call, use **Get Reviews from Multiple Locations** instead."
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
    location: {
      propDefinition: [
        app,
        "location",
        ({ account }: { account: string; }) => ({
          account,
        }),
      ],
    },
    orderBy: {
      propDefinition: [
        app,
        "reviewOrderBy",
      ],
    },
    maxResults: {
      type: "integer",
      label: "Max Reviews",
      description: `The maximum number of reviews to return. Defaults to \`${REVIEWS_PAGE_SIZE}\` (one page). Raise it, e.g. to \`1000\`, to retrieve a full review history in one run.`,
      optional: true,
      default: REVIEWS_PAGE_SIZE,
      min: 1,
    },
    pageToken: {
      propDefinition: [
        app,
        "pageToken",
      ],
    },
  },
  async run({ $ }) {
    const {
      account, location, orderBy, maxResults, pageToken,
    } = this;

    const params: ListReviewsParams = {
      $,
      account,
      location,
      maxResults: maxResults ?? REVIEWS_PAGE_SIZE,
      pageToken,
      params: {
        orderBy,
      },
    };

    const response = await this.app.listAllReviews(params);

    const count = response.reviews?.length ?? 0;
    $.export("$summary", `Successfully listed ${count} review${count === 1
      ? ""
      : "s"}${response.nextPageToken
      ? " (more reviews are available, see `nextPageToken`)"
      : ""}`);

    return response;
  },
});
