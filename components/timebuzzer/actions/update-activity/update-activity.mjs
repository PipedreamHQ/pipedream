import timebuzzer from "../../timebuzzer.app.mjs";

export default {
  key: "timebuzzer-update-activity",
  name: "Update Activity",
  description: "Modifies an existing activity in Timebuzzer. [See the documentation](https://my.timebuzzer.com/doc/)",
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
    update: {
      propDefinition: [
        timebuzzer,
        "update",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.timebuzzer.updateActivity(this.activity, this.update);
    $.export("$summary", `Successfully updated activity ${this.activity}`);
    return response;
  },
};
