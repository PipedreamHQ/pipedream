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
    let results = [];
    let stop = false;

    while (!stop) {
      const {
        count, data,
      } = await this.app.getActivities({
        $,
        params: {
          limit: 100,
          offset: results.length,
        },
      });

      results = results.concat(data);

      stop = count <= results.length;
    }

    $.export("$summary", `Successfully retrieved ${results.length} activities`);

    return results;
  },
};
