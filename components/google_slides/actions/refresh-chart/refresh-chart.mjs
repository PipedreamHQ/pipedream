import app from "../../google_slides.app.mjs";

export default {
  key: "google_slides-refresh-chart",
  name: "Refresh a chart",
  description: "Refresh a chart from Sheets. [See the docs here](https://developers.google.com/slides/api/samples/elements#refresh_a_chart_from_sheets)",
  version: "0.0.6",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    drive: {
      propDefinition: [
        app,
        "watchedDrive",
      ],
      description: "The drive to select a presentation from. If you are connected with any [Google Shared Drives](https://support.google.com/a/users/answer/9310351), you can select it here.",
    },
    presentationId: {
      propDefinition: [
        app,
        "presentationId",
        (c) => ({
          driveId: app.methods.getDriveId(c.drive),
        }),
      ],
      description: "List of presentations in the specified drive",
    },
  },
  async run({ $ }) {
    const presentation = await this.app.getPresentation(this.presentationId);
    const elements = presentation.slides.map((slide) => slide.pageElements).flat();
    const chartIds = elements.filter((element) => {
      return element.sheetsChart && element.sheetsChart.spreadsheetId;
    }).map((element) => element.objectId);
    const promises = [];
    for (let chartId of chartIds) {
      promises.push(this.app.refreshChart(this.presentationId, chartId));
    }
    await Promise.all(promises);
    $.export("$summary", `Successfully refreshed ${chartIds.length} charts`);
  },
};
