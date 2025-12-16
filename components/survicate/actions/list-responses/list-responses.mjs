import app from "../../survicate.app.mjs";

export default {
  key: "survicate-list-responses",
  name: "List Responses",
  description: "Fetches the list of responses for a specific survey identified by its unique ID. [See the documentation](https://developers.survicate.com/data-export/response/)",
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
      description: "Optional start timestamp for filtering responses. Responses collected before this timestamp will be included. Format: ISO 8601 with microseconds (e.g., `2023-01-01T00:00:00.000000Z`).",
      propDefinition: [
        app,
        "start",
      ],
    },
    end: {
      description: "Optional end timestamp for filtering responses. Responses collected after this time will be included. Format: ISO 8601 with microseconds (e.g., `2023-01-01T00:00:00.000000Z`).",
      propDefinition: [
        app,
        "end",
      ],
    },
  },
  async run({ $ }) {
    const {
      app,
      surveyId,
      itemsPerPage,
      start,
      end,
    } = this;

    const response = await app.listResponses({
      $,
      surveyId,
      params: {
        items_per_page: itemsPerPage,
        start,
        end,
      },
    });

    $.export("$summary", `Successfully retrieved \`${response.data?.length}\` response(s)`);
    return response.data;
  },
};
