import { defineAction } from "@pipedream/types";
import yelp from "../../app/yelp.app";
import { DOCS } from "../../common/constants";
import {
  ListBusinessReviewsParams,
  ListBusinessReviewsResponse,
} from "../../common/types";

export default defineAction({
  name: "List Business Reviews",
  description: `List the reviews for a business [See docs here](${DOCS.listBusinessReviews})`,
  key: "yelp-list-business-reviews",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    yelp,
    businessIdOrAlias: {
      propDefinition: [
        yelp,
        "businessIdOrAlias",
      ],
    },
    locale: {
      propDefinition: [
        yelp,
        "locale",
      ],
    },
    sortBy: {
      label: "Sort By",
      description: "Sort reviews by Yelp's default sorting or newest first.",
      type: "string",
      options: [
        "yelp_sort",
        "newest",
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      businessIdOrAlias, locale, sortBy: sort_by,
    } = this;

    const params: ListBusinessReviewsParams = {
      $,
      businessIdOrAlias,
      params: {
        locale,
        sort_by,
      },
    };

    const response: ListBusinessReviewsResponse =
      await this.yelp.listBusinessReviews(params);

    $.export(
      "$summary",
      `Obtained ${response.reviews.length} business reviews`,
    );

    return response;
  },
});
