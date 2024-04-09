import timing from "../../timing.app.mjs";

export default {
  key: "timing-stop-timer",
  name: "Stop Timer",
  description: "Halts any active timer.",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    timing,
  },
  async run({ $ }) {
    const response = await this.timing.stopActiveTimer();
    $.export("$summary", "Successfully stopped timer");
    return response;
  },
};
