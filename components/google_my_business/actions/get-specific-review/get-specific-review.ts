// x-pd-ai: optimized
import { defineAction } from "@pipedream/types";
import app from "../../app/google_my_business.app";
import { GetReviewParams } from "../../common/requestParams";

const DOCS_LINK = "https://developers.google.com/my-business/content/review-data#get_a_specific_review";

export default defineAction({
  key: "google_my_business-get-specific-review",
  name: "Get a Specific Review",
  description: `Return a specific review by name. [See the documentation](${DOCS_LINK})`,
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
      ],
    },
    review: {
      propDefinition: [
        app,
        "review",
      ],
    },
  },
  async run({ $ }) {
    const {
      account, location, review,
    } = this;

    const params: GetReviewParams = {
      $,
      account,
      location,
      review,
    };

    const response = await this.app.getReview(params);

    $.export("$summary", `Successfully retrieved review: ${review}`);

    return response;
  },
});
