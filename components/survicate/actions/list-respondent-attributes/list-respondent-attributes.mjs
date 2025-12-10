import app from "../../survicate.app.mjs";

export default {
  key: "survicate-list-respondent-attributes",
  name: "List Respondent Attributes",
  description: "Retrieves the names and values of custom attributes associated with a specific respondent, which have been passed to Survicate through the JavaScript API, integrations, or embedded within the survey link. [See the documentation](https://developers.survicate.com/data-export/respondent/)",
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
      description: "The unique identifier of the attribute, used to return paginated results. This identifier is included in the response for each request, as part of the `next_url` parameter.",
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

    const response = await app.listRespondentAttributes({
      $,
      respondentUuid,
      params: {
        items_per_page: itemsPerPage,
        start,
      },
    });

    $.export("$summary", `Successfully retrieved \`${response.data?.length}\` attribute(s) for respondent with UUID \`${respondentUuid}\``);
    return response.data;
  },
};
