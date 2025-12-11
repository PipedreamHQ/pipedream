import app from "../../survicate.app.mjs";

export default {
  key: "survicate-list-respondent-responses",
  name: "List Respondent Responses",
  description: "Retrieves a list of survey responses provided by a specific respondent identified by their unique identifier (UUID). [See the documentation](https://developers.survicate.com/data-export/respondent/)",
  version: "0.0.1",
  type: "action",
  annotations: {
    readOnlyHint: true,
    destructiveHint: false,
    openWorldHint: true,
  },
  props: {
    app,
    respondentUuid: {
      propDefinition: [
        app,
        "respondentUuid",
      ],
    },
    itemsPerPage: {
      propDefinition: [
        app,
        "itemsPerPage",
      ],
    },
    start: {
      description: "Optional start timestamp for filtering responses. Responses collected before this timestamp will be included. Format: ISO 8601 with microseconds (e.g., `2023-01-01T00:00:00.000000Z`).",
      propDefinition: [
        app,
        "start",
      ],
    },
  },
  async run({ $ }) {
    const {
      app,
      respondentUuid,
      itemsPerPage,
      start,
    } = this;

    const response = await app.listRespondentResponses({
      $,
      respondentUuid,
      params: {
        items_per_page: itemsPerPage,
        start,
      },
    });

    $.export("$summary", `Successfully retrieved \`${response.data?.length}\` response(s) for respondent with UUID \`${respondentUuid}\``);
    return response.data;
  },
};
