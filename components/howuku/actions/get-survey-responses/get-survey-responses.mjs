import howuku from "../../howuku.app.mjs";

export default {
  key: "howuku-get-survey-responses",
  name: "Get Survey Responses",
  description: "Retrieves a list of survey responses from Howuku. [See the documentation](https://rest.howuku.com/#survey)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    howuku,
    startDate: {
      type: "string",
      label: "Start Date",
      description: "The result will return survey responses after the start date. Enter in ISO 8601 format. Example: `2020-10-27T08:30:28.000Z`",
      optional: true,
    },
    endDate: {
      type: "string",
      label: "End Date",
      description: "The result will return survey responses before the end date. Enter in ISO 8601 format. Example: `2020-10-27T08:30:28.000Z`",
      optional: true,
    },
    limit: {
      type: "integer",
      label: "Limit",
      description: "The result will return latest X number of specified number of heatmaps",
      default: 50,
    },
  },
  async run({ $ }) {
    const response = await this.howuku.listSurveys({
      $,
      params: {
        startdate: this.startDate,
        enddate: this.endDate,
        limit: this.limit,
      },
    });
    $.export("$summary", `Successfully retrieved ${response.length} survey${response.length === 1
      ? ""
      : "s"}`);
    return response;
  },
};
