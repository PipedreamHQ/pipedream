import app from "../../privatus_analytics.app.mjs";
import utils from "../../common/utils.mjs";

export default {
  key: "privatus_analytics-create-workspace-chart-note",
  name: "Create Workspace Chart Note",
  description: "Adds a note to the charts of every site in the workspace, such as a release that touched them all. [See the documentation](https://privatusanalytics.com/docs/api)",
  version: "0.0.1",
  type: "action",
  ai: "optimized",
  annotations: {
    "destructiveHint": false,
    "openWorldHint": true,
    "readOnlyHint": false,
  },
  props: {
    app,
    title: {
      propDefinition: [
        app,
        "chartNoteTitle",
      ],
    },
    date: {
      propDefinition: [
        app,
        "chartNoteDate",
      ],
    },
    endDate: {
      propDefinition: [
        app,
        "chartNoteEndDate",
      ],
    },
    body: {
      propDefinition: [
        app,
        "chartNoteBody",
      ],
    },
    url: {
      propDefinition: [
        app,
        "chartNoteUrl",
      ],
    },
    color: {
      propDefinition: [
        app,
        "chartNoteColor",
      ],
    },
    source: {
      propDefinition: [
        app,
        "chartNoteSource",
      ],
    },
    version: {
      propDefinition: [
        app,
        "chartNoteVersion",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.app.request({
      $,
      method: "POST",
      path: await this.app.workspacePath({
        $,
        path: "/notes.json",
      }),
      data: utils.compact({
        title: this.title,
        date: utils.toDate(this.date),
        end_date: utils.toDate(this.endDate),
        body: this.body,
        url: this.url,
        color: this.color,
        source: this.source,
        version: this.version,
      }),
    });
    $.export("$summary", `Successfully created chart note '${response.title}'`);
    return response;
  },
};
