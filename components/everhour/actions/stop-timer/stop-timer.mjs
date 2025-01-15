import everhour from "../../everhour.app.mjs";

export default {
  key: "everhour-stop-timer",
  name: "Stop Timer",
  description: "Halts the current running timer. [See the documentation](https://everhour.docs.apiary.io/#reference/timers/stop-timer)",
  version: "0.0.1",
  type: "action",
  props: {
    everhour,
  },
  async run({ $ }) {
    const response = await this.everhour.stopTimer();
    $.export("$summary", "Successfully stopped the timer");
    return response;
  },
};
