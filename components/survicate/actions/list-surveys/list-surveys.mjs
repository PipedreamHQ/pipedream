import app from "../../survicate.app.mjs";

export default {
  key: "survicate-list-surveys",
  name: "List Surveys",
  description: "Retrieves a list of all surveys from your workspace. [See the documentation](https://developers.survicate.com/data-export/survey/)",
  version: "0.0.1",
  type: "action",
  annotations: {
    readOnlyHint: true,
    destructiveHint: false,
    openWorldHint: true,
  },
  props: {
    app,
    itemsPerPage: {
      propDefinition: [
        app,
        "itemsPerPage",
      ],
    },
    start: {
      propDefinition: [
        app,
        "start",
      ],
    },
    end: {
      propDefinition: [
        app,
        "end",
      ],
    },
  },
  async run({ $ }) {
    const {
      app,
      itemsPerPage,
      start,
      end,
    } = this;

    const response = await app.listSurveys({
      $,
      params: {
        items_per_page: itemsPerPage,
        start,
        end,
      },
    });

    $.export("$summary", `Successfully retrieved \`${response.data?.length}\` survey(s)`);
    return response.data;
  },
};
