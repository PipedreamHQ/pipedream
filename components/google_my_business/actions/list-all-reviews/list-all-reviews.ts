import { defineAction } from "@pipedream/types";
import app from "../../app/google_my_business.app";
import { ListReviewsParams } from "../../common/requestParams";
import { ListReviewsResponse } from "../../common/responseSchemas";

const DOCS_LINK = "https://developers.google.com/my-business/content/review-data#list_all_reviews";
const API_LINK = "https://developers.google.com/my-business/reference/rest/v4/accounts.locations.reviews/list";

interface ListAllReviewsParams extends ListReviewsParams {
  params?: {
    pageSize?: number;
    pageToken?: string;
    orderBy?: string;
  };
}

export default defineAction({
  key: "google_my_business-list-all-reviews",
  name: "List All Reviews",
  description: `List all reviews of a location to audit reviews in bulk. [See the documentation](${DOCS_LINK})`,
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
    location: {
      propDefinition: [
        app,
        "location",
        ({ account }: { account: string; }) => ({
          account,
        }),
      ],
    },
    pageSize: {
      type: "integer",
      label: "Page Size",
      description: "The number of reviews to return (max 50)",
      optional: true,
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
      description: `How to order the reviews. Defaults to \`updateTime desc\` when left empty. [See the documentation](${API_LINK})`,
      optional: true,
      options: [
        "rating",
        "rating desc",
        "updateTime desc",
      ],
    },
  },
  async run({ $ }) {
    const {
      account, location, pageSize, pageToken, orderBy,
    } = this;

    const params: ListAllReviewsParams = {
      $,
      account,
      location,
      params: {
        pageSize,
        pageToken,
        orderBy,
      },
    };

    const response: ListReviewsResponse = await this.app.listReviews(params);

    const reviewCount = response?.reviews?.length ?? 0;

    $.export("$summary", `Successfully listed ${reviewCount} review${reviewCount !== 1
      ? "s"
      : ""}`);

    return response;
  },
});
