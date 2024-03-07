import app from "../../zixflow.app.mjs";

export default {
  key: "zixflow-get-activities",
  name: "Get Activities",
  description: "Retrieve a list of activities. [See the documentation](https://docs.zixflow.com/api-reference/activity-list/get#body)",
  version: "0.0.1",
  type: "action",
  props: {
    app,
  },
  async run({ $ }) {
    const response = await this.app.getActivities({
      $,
    });

    $.export("$summary", `Successfully retrieved ${response.data.length} activities`);
    return response;
  },
};
