import timebuzzer from "../../timebuzzer.app.mjs";

export default {
  key: "timebuzzer-list-activities",
  name: "List Activities",
  description: "Retrieves a list of all activities in timebuzzer. An optional 'filter' prop can be used to narrow the results. [See the documentation](https://my.timebuzzer.com/doc/)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    timebuzzer,
    filter: {
      propDefinition: [
        timebuzzer,
        "filter",
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.timebuzzer.listActivities(this.filter || {});
    $.export("$summary", `Fetched ${response.length} activities successfully`);
    return response;
  },
};
