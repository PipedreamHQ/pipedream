import wakatime from "../../wakatime.app.mjs";

export default {
  key: "wakatime-fetch-daily-heartbeats",
  name: "Fetch Daily Heartbeats",
  description: "Fetch your daily coding activity from WakaTime. [See the documentation](https://wakatime.com/developers#heartbeats)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    wakatime,
    date: {
      type: "string",
      label: "Date",
      description: "The date to fetch heartbeats for (YYYY-MM-DD)",
    },
  },
  async run({ $ }) {
    const response = await this.wakatime.listHeartbeats({
      $,
      params: {
        date: this.date,
      },
    });

    $.export("$summary", `Retrieved ${response.data.length} heartbeat${response.data.length === 1
      ? ""
      : "s"} for ${this.date}`);
    return response;
  },
};
