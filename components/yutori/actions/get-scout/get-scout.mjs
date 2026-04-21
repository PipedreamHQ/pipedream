import yutori from "../../yutori.app.mjs";

export default {
  key: "yutori-get-scout",
  name: "Get Scout",
  description: "Fetch the details and current status of a specific Yutori Scout by its ID. Returns the scout's configuration, status (active, paused, completed), and metadata. [See the documentation](https://docs.yutori.com/reference/scouting-get)",
  version: "0.0.1",
  type: "action",
  annotations: {
    openWorldHint: true,
    destructiveHint: false,
    readOnlyHint: true,
  },
  props: {
    yutori,
    scoutId: {
      type: "string",
      label: "Scout ID",
      description: "The ID of the scout to retrieve, e.g. from the Yutori dashboard or a previous **Get Scout** / **Get Scout Updates** step",
    },
  },
  async run({ $ }) {
    const scout = await this.yutori.getScout($, this.scoutId);
    const name = scout?.display_name ?? scout?.query?.slice(0, 60) ?? this.scoutId;

    $.export("$summary", `Scout: ${name}`);
    return scout;
  },
};
