import app from "../../parsehub.app.mjs";

export default {
  key: "parsehub-get-data-run",
  name: "Get Data for a Run",
  description: "Returns the data extracted by a specified run. [See the documentation](https://www.parsehub.com/docs/ref/api/v2/#get-data-for-a-run)",
  version: "0.0.4",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    app,
    runToken: {
      propDefinition: [
        app,
        "runToken",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.app.getRunData({
      $,
      runToken: this.runToken,
    });

    $.export("$summary", `Successfully retrieved data for run token: ${this.runToken}`);

    return response;
  },
};
