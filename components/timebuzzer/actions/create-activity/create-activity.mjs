import timebuzzer from "../../timebuzzer.app.mjs";

export default {
  key: "timebuzzer-create-activity",
  name: "Create Activity",
  description: "Generates a new activity in timebuzzer. [See the documentation](https://my.timebuzzer.com/doc/)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    timebuzzer,
    activity: {
      propDefinition: [
        timebuzzer,
        "activity",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.timebuzzer.createActivity(this.activity);
    $.export("$summary", `Successfully created activity ${this.activity}`);
    return response;
  },
};
