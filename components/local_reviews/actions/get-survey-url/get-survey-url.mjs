import app from "../../local_reviews.app.mjs";

export default {
  key: "local_reviews-get-survey-url",
  name: "Get Survey URL",
  description: "Retrieve the survey link associated with the connected license. [See the documentation](https://app.localreviews.com/review-tools/api-documentation).",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    app,
  },
  async run({ $ }) {
    const response = await this.app.getSurveyUrl({
      $,
    });
    $.export("$summary", "Successfully retrieved survey URL.");
    return response;
  },
};
