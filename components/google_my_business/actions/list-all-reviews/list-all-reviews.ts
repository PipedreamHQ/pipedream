import { defineAction } from "@pipedream/types";
import app from "../../app/google_my_business.app";
import { ListReviewsParams } from "../../common/requestParams";

const DOCS_LINK = "https://developers.google.com/my-business/content/review-data#list_all_reviews";

export default defineAction({
  key: "google_my_business-list-all-reviews",
  name: "List All Reviews",
  description: `List all reviews of a location to audit reviews in bulk. [See the documentation](${DOCS_LINK})`,
  version: "0.0.2",
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
  },
  async run({ $ }) {
    const {
      account, location,
    } = this;

    const params: ListReviewsParams = {
      $,
      account,
      location,
    };

    const response = await this.app.listReviews(params);

    $.export("$summary", `Successfully listed ${response.length} reviews`);

    return response;
  },
});
