import app from "../../survicate.app.mjs";

export default {
  key: "survicate-list-questions",
  name: "List Questions",
  description: "Retrieves a list of questions for a specific survey. [See the documentation](https://developers.survicate.com/data-export/survey/)",
  version: "0.0.1",
  type: "action",
  annotations: {
    readOnlyHint: true,
    destructiveHint: false,
    openWorldHint: true,
  },
  props: {
    app,
    surveyId: {
      propDefinition: [
        app,
        "surveyId",
      ],
    },
    itemsPerPage: {
      propDefinition: [
        app,
        "itemsPerPage",
      ],
    },
    start: {
      description: "The unique identifier of the question, used to return paginated results. This identifier is included in the response for each request, as part of the `next_url` parameter.",
      propDefinition: [
        app,
        "start",
      ],
    },
  },
  async run({ $ }) {
    const {
      app,
      surveyId,
      itemsPerPage,
      start,
    } = this;

    const response = await app.listQuestions({
      $,
      surveyId,
      params: {
        items_per_page: itemsPerPage,
        start,
      },
    });

    $.export("$summary", `Successfully retrieved \`${response.data?.length}\` question(s)`);
    return response.data;
  },
};
