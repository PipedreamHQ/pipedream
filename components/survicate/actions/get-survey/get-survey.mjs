import app from "../../survicate.app.mjs";

export default {
  key: "survicate-get-survey",
  name: "Get Survey",
  description: "Retrieves detailed information about a specific survey. [See the documentation](https://developers.survicate.com/data-export/survey/)",
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
  },
  async run({ $ }) {
    const {
      app,
      surveyId,
    } = this;

    const response = await app.getSurvey({
      $,
      surveyId,
    });

    $.export("$summary", `Successfully retrieved survey with ID \`${response.id}\``);
    return response;
  },
};
