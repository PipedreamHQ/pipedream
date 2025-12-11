import app from "../../survicate.app.mjs";

export default {
  key: "survicate-get-response",
  name: "Get Response",
  description: "Retrieves detailed information about a specific response. [See the documentation](https://developers.survicate.com/data-export/response/)",
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
    responseId: {
      propDefinition: [
        app,
        "responseId",
        ({ surveyId }) => ({
          surveyId,
        }),
      ],
    },
  },
  async run({ $ }) {
    const {
      app,
      surveyId,
      responseId,
    } = this;

    const response = await app.getResponse({
      $,
      surveyId,
      responseId,
    });

    $.export("$summary", `Successfully retrieved response with UUID \`${response.uuid}\``);
    return response;
  },
};
